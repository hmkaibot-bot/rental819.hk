"use server";

import { assertCanWrite } from "@/lib/admin/auth";

import { revalidatePath } from "next/cache";
import { updateReservation } from "@/lib/reservations/store";
import type { InvoiceItem, Reservation } from "@/lib/reservations/types";

export async function saveInvoice(input: {
  id: string;
  si_number: string | null;
  invoice_date: string | null;
  invoice_items: InvoiceItem[];
  settlement?: Reservation["settlement"];
  markInvoiced?: boolean;
}) {
  assertCanWrite();
  await updateReservation(input.id, {
    si_number: input.si_number || null,
    invoice_date: input.invoice_date || null,
    invoice_items: input.invoice_items,
    ...(input.settlement ? { settlement: input.settlement } : {}),
    ...(input.markInvoiced ? { status: "awaiting_payment" as const } : {}),
  });
  // Subtree revalidate: the emails and the dashboard list read SI number and
  // status too, so the exact-path pair used to leave them stale.
  revalidatePath(`/admin/reservations/${input.id}`, "layout");
  revalidatePath("/admin");
  return { ok: true };
}
