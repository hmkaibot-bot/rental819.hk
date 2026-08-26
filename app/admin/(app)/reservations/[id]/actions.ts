"use server";

import { assertCanWrite } from "@/lib/admin/auth";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getReservation, updateReservation } from "@/lib/reservations/store";
import {
  costItemsTotal,
  rebateFromCostItems,
  confirmNeedsPaidDate,
  COST_ITEM_LABELS,
  ADDON_LABELS,
  type CostItems,
  type Reservation,
  type ReservationAddons,
} from "@/lib/reservations/types";

/**
 * Every field staff may correct from the reservation page. Customers mistype
 * their own details often enough that the whole submission has to be editable,
 * not just the operational fields.
 */
const NULLABLE_TEXT = [
  "status",
  "source",
  // customer details
  "name_zh",
  "name_en",
  "gender",
  "dob",
  "email",
  "hk_phone",
  "hk_address",
  "jp_address",
  "jp_phone",
  "japanese_ability",
  "english_ability",
  "emergency_contact",
  "emergency_phone",
  // rental details
  "shop",
  "bike_pref_1",
  "bike_pref_2",
  "bike_pref_3",
  "confirmed_bike",
  "pickup_date",
  "pickup_time",
  "return_date",
  "return_time",
  "promo",
  // billing / ops
  "si_number",
  "customer_paid_date",
  "payment_channel",
  "supplier_paid_date",
  "notes",
] as const;

/** Postgres unique_violation — booking_ref carries a UNIQUE index. */
const isUniqueViolation = (e: unknown) =>
  typeof e === "object" && e !== null && (e as { code?: string }).code === "23505";

/** Generic patch: applies whatever editable fields are present in the form. */
export async function patchReservation(formData: FormData) {
  assertCanWrite();
  const id = String(formData.get("id"));
  const patch: Partial<Reservation> = {};

  for (const key of NULLABLE_TEXT) {
    if (formData.has(key)) {
      const v = formData.get(key);
      (patch as Record<string, unknown>)[key] = v === "" ? null : v;
    }
  }
  if (formData.has("cost_jpy")) {
    const v = formData.get("cost_jpy");
    patch.cost_jpy = v === "" || v == null ? null : Number(v);
  }
  if (formData.has("rebate_jpy")) {
    const v = formData.get("rebate_jpy");
    patch.rebate_jpy = v === "" || v == null ? null : Number(v);
  }
  if (formData.has("paid_to_supplier")) {
    patch.paid_to_supplier = formData.get("paid_to_supplier") === "on";
  }

  // 預約編號 is UNIQUE and 提交日期 is NOT NULL in the schema, so neither may go
  // through the blank-means-null path above: a blank one would either break the
  // constraint or leave the booking without the number every email, the invoice
  // and the SI number are keyed on. Both come back as a message on the page
  // instead of a 500. redirect() throws, so it stays out of the try below.
  if (formData.has("booking_ref")) {
    const ref = String(formData.get("booking_ref") ?? "").trim();
    if (!ref) redirect(`/admin/reservations/${id}?err=ref_required`);
    patch.booking_ref = ref;
  }
  if (formData.has("request_date")) {
    const requested = String(formData.get("request_date") ?? "").trim();
    if (!requested) redirect(`/admin/reservations/${id}?err=date_required`);
    patch.request_date = requested;
  }

  // 已確認預定 means the money is in, so it needs 客人付款日期 on record. The date
  // lives in its own form, so take it from this submit when present and fall
  // back to what is already stored.
  if (patch.status === "confirmed") {
    const paidDate = formData.has("customer_paid_date")
      ? String(formData.get("customer_paid_date") ?? "")
      : (await getReservation(id))?.customer_paid_date;
    if (confirmNeedsPaidDate("confirmed", paidDate)) {
      redirect(`/admin/reservations/${id}?err=paid_date_required`);
    }
  }

  try {
    await updateReservation(id, patch);
  } catch (e) {
    if (!isUniqueViolation(e)) throw e;
    redirect(`/admin/reservations/${id}?err=ref_taken`);
  }
  // "layout" invalidates the whole reservation subtree — the JP/customer email
  // pages and the invoice render from this record too, and an exact-path
  // revalidate leaves their client-cached copies stale after an edit.
  revalidatePath(`/admin/reservations/${id}`, "layout");
  revalidatePath("/admin");
  // Land on the clean URL so a fixed-and-resaved edit drops the stale ?err=.
  redirect(`/admin/reservations/${id}`);
}

/**
 * Save the add-ons block on the reservation page (Task: staff can correct what
 * the customer submitted). Unchecked boxes do not post, so every key is read
 * explicitly rather than merged over the existing object.
 */
export async function saveAddons(formData: FormData) {
  assertCanWrite();
  const id = String(formData.get("id"));
  const addons: ReservationAddons = {};
  for (const a of ADDON_LABELS) {
    if (a.key === "full_face" || a.key === "open_face") {
      const n = Number(formData.get(`addon_${a.key}`));
      if (Number.isFinite(n) && n > 0) addons[a.key] = n;
    } else {
      const on = formData.get(`addon_${a.key}`) === "on";
      if (on) (addons as Record<string, unknown>)[a.key] = true;
    }
  }
  await updateReservation(id, { addons });
  revalidatePath(`/admin/reservations/${id}`, "layout");
  revalidatePath("/admin");
  // Land on the clean URL so a stale ?err= from a refused save never sticks.
  redirect(`/admin/reservations/${id}`);
}

/**
 * Save the per-item supplier cost (¥). The total and the rebate are derived,
 * never typed: cost_jpy is the sum of the lines and the rebate is always 10% of
 * the base bike rental, so the two can never drift out of step.
 */
export async function saveCostItems(formData: FormData) {
  assertCanWrite();
  const id = String(formData.get("id"));
  const items: CostItems = {};
  for (const l of COST_ITEM_LABELS) {
    const raw = formData.get(`cost_${l.key}`);
    const n = Number(raw);
    if (raw !== "" && raw != null && Number.isFinite(n) && n !== 0) {
      items[l.key] = n;
    }
  }
  const total = costItemsTotal(items);
  const si = formData.get("si_number");
  const anyEntered = Object.keys(items).length > 0;

  await updateReservation(id, {
    // Submitting an all-blank cost form (e.g. just saving the SI number on a
    // booking whose cost lives elsewhere) must not wipe a recorded total.
    ...(anyEntered
      ? {
          cost_items: items,
          cost_jpy: total,
          rebate_jpy: rebateFromCostItems(items) || null,
        }
      : {}),
    ...(si != null ? { si_number: si === "" ? null : String(si) } : {}),
  });
  revalidatePath(`/admin/reservations/${id}`, "layout");
  revalidatePath("/admin");
  revalidatePath("/admin/accounting");
  // Land on the clean URL so a stale ?err= from a refused save never sticks.
  redirect(`/admin/reservations/${id}`);
}

/**
 * Japan confirmation (step 3): confirm not just the bike but the whole rental —
 * confirmed model, P-grade, pick-up/return date+time, and the confirmed add-ons.
 * The invoice then seeds its line items from all of this.
 */
export async function confirmReservation(formData: FormData) {
  assertCanWrite();
  const id = String(formData.get("id"));
  const current = await getReservation(id);

  const text = (k: string) => {
    const v = formData.get(k);
    return v === "" || v == null ? null : String(v);
  };
  const on = (k: string) => formData.get(k) === "on";
  const count = (k: string) => {
    const n = Number(formData.get(k));
    return Number.isFinite(n) && n > 0 ? n : undefined;
  };

  const grade = String(formData.get("grade") || "").trim();
  const settlement = {
    ...(current?.settlement ?? {}),
    ...(grade ? { grade } : {}),
  };

  const addons: ReservationAddons = {
    cardo: current?.addons?.cardo, // HK-side value-add, preserved (not Japan-confirmed)
    topcase: on("addon_topcase") || undefined,
    sidebag: on("addon_sidebag") || undefined,
    pannier: on("addon_pannier") || undefined,
    mamoride: on("addon_mamoride") || undefined,
    etc: on("addon_etc") || undefined,
    shuttle_bus: on("addon_shuttle_bus") || undefined,
    luggage_storage: on("addon_luggage_storage") || undefined,
    full_face: count("helmet_full"),
    open_face: count("helmet_open"),
  };

  await updateReservation(id, {
    confirmed_bike: text("confirmed_bike"),
    pickup_date: text("pickup_date"),
    pickup_time: text("pickup_time"),
    return_date: text("return_date"),
    return_time: text("return_time"),
    addons,
    settlement,
    // Status is never advanced automatically — staff set it in the 狀態 dropdown.
  });
  revalidatePath(`/admin/reservations/${id}`, "layout");
  revalidatePath("/admin");
  // Land on the clean URL so a stale ?err= from a refused save never sticks.
  redirect(`/admin/reservations/${id}`);
}

/** Toggle the HK-side CARDO value-add (handled by Helmet King, not Japan). */
export async function setCardo(formData: FormData) {
  assertCanWrite();
  const id = String(formData.get("id"));
  const current = await getReservation(id);
  const cardo = formData.get("cardo") === "on";
  await updateReservation(id, {
    addons: { ...(current?.addons ?? {}), cardo },
  });
  revalidatePath(`/admin/reservations/${id}`, "layout");
  // Land on the clean URL so a stale ?err= from a refused save never sticks.
  redirect(`/admin/reservations/${id}`);
}
