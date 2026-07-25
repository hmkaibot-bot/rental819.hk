"use server";

import { revalidatePath } from "next/cache";
import { updateReservation } from "@/lib/reservations/store";
import type { Reservation } from "@/lib/reservations/types";

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
  if (formData.has("paid_to_supplier")) {
    patch.paid_to_supplier = formData.get("paid_to_supplier") === "on";
  }

  await updateReservation(id, patch);
  revalidatePath(`/admin/reservations/${id}`);
  revalidatePath("/admin");
}
