"use server";

import { revalidatePath } from "next/cache";
import { getReservation, updateReservation } from "@/lib/reservations/store";
import type { Reservation, ReservationAddons } from "@/lib/reservations/types";

const NULLABLE_TEXT = [
  "status",
  "confirmed_bike",
  "si_number",
  "customer_paid_date",
  "supplier_paid_date",
  "shop",
  "notes",
] as const;

/** Generic patch: applies whatever editable fields are present in the form. */
export async function patchReservation(formData: FormData) {
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

  await updateReservation(id, patch);
  revalidatePath(`/admin/reservations/${id}`);
  revalidatePath("/admin");
}

/**
 * Japan confirmation (step 3): confirm not just the bike but the whole rental —
 * confirmed model, P-grade, pick-up/return date+time, and the confirmed add-ons.
 * The invoice then seeds its line items from all of this.
 */
export async function confirmReservation(formData: FormData) {
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
    status: "awaiting_si", // Japan confirmed availability → next step is to issue the SI
  });
  revalidatePath(`/admin/reservations/${id}`);
  revalidatePath("/admin");
}

/** Toggle the HK-side CARDO value-add (handled by Helmet King, not Japan). */
export async function setCardo(formData: FormData) {
  const id = String(formData.get("id"));
  const current = await getReservation(id);
  const cardo = formData.get("cardo") === "on";
  await updateReservation(id, {
    addons: { ...(current?.addons ?? {}), cardo },
  });
  revalidatePath(`/admin/reservations/${id}`);
}
