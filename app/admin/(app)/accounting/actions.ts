"use server";

import { revalidatePath } from "next/cache";
import { updateReservation } from "@/lib/reservations/store";

/** Batch-record supplier (Japan) payment for the selected reservations. */
export async function recordSupplierPayment(formData: FormData) {
  const ids = formData.getAll("ids").map(String).filter(Boolean);
  const date = String(formData.get("supplier_paid_date") || "").trim() || null;

  await Promise.all(
    ids.map((id) =>
      // Supplier settlement is tracked by paid_to_supplier / supplier_paid_date,
      // not the booking status (which follows the Excel customer-facing pipeline).
      updateReservation(id, {
        paid_to_supplier: true,
        supplier_paid_date: date,
      }),
    ),
  );
  revalidatePath("/admin/accounting");
  revalidatePath("/admin");
}
