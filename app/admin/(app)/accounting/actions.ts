"use server";

import { assertCanWrite } from "@/lib/admin/auth";

import { revalidatePath } from "next/cache";
import { updateReservation } from "@/lib/reservations/store";

/**
 * Batch-set the supplier (Japan) payment state for the selected reservations.
 * `paid=0` clears it back to unpaid; otherwise it is marked paid with the
 * given 向供應商付款日期. Settlement is tracked by paid_to_supplier /
 * supplier_paid_date, not the booking status (which follows the Excel pipeline).
 */
export async function recordSupplierPayment(formData: FormData) {
  assertCanWrite();
  const ids = formData.getAll("ids").map(String).filter(Boolean);
  if (ids.length === 0) return;
  const paid = formData.get("paid") !== "0";
  const date = String(formData.get("supplier_paid_date") || "").trim() || null;

  const patch = paid
    ? { paid_to_supplier: true, supplier_paid_date: date }
    : { paid_to_supplier: false, supplier_paid_date: null };

  await Promise.all(ids.map((id) => updateReservation(id, patch)));
  revalidatePath("/admin/accounting");
  revalidatePath("/admin");
}
