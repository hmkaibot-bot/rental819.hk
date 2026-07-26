"use server";

import { revalidatePath } from "next/cache";
import { updateReservation } from "@/lib/reservations/store";

/** Batch-record supplier (Japan) payment for the selected reservations. */
export async function recordSupplierPayment(formData: FormData) {
  const ids = formData.getAll("ids").map(String).filter(Boolean);
  const date = String(formData.get("supplier_paid_date") || "").trim() || null;

  await Promise.all(
    ids.map((id) =>
      updateReservation(id, {
        paid_to_supplier: true,
        supplier_paid_date: date,
        ...(date ? { status: "settled" as const } : {}),
      }),
    ),
  );
  revalidatePath("/admin/accounting");
  revalidatePath("/admin");
}
