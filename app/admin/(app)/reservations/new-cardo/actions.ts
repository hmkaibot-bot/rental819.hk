"use server";

import { assertCanWrite } from "@/lib/admin/auth";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createReservation } from "@/lib/reservations/store";

/**
 * Create a standalone CARDO intercom rental — a HK-side booking with no Japan
 * bike component. The booking ref comes from the same DB trigger as every
 * other reservation, so CARDO rentals number into the one sequence.
 */
export async function createCardoRentalAction(formData: FormData) {
  assertCanWrite();
  const s = (k: string) => {
    const v = formData.get(k);
    return v == null || String(v).trim() === "" ? null : String(v).trim();
  };

  const res = await createReservation({
    name_zh: s("name_zh"),
    name_en: s("name_en"),
    email: s("email"),
    hk_phone: s("hk_phone"),
    pickup_date: s("pickup_date"),
    return_date: s("return_date"),
    addons: { cardo: true },
    notes: s("notes"),
    source: "admin",
    cardo_only: true,
  });

  revalidatePath("/admin");
  // In demo mode there is no persisted row to open.
  redirect(res.demo ? "/admin" : `/admin/reservations/${res.id}`);
}
