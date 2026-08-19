"use server";

import { revalidatePath } from "next/cache";
import { assertCanWrite } from "@/lib/admin/auth";
import { getReservation, setStatus } from "@/lib/reservations/store";
import {
  STATUS_FLOW,
  TERMINAL_STATUS,
  confirmNeedsPaidDate,
  type ReservationStatus,
} from "@/lib/reservations/types";

const VALID = new Set<string>([...STATUS_FLOW, ...TERMINAL_STATUS].map((s) => s.key));

/**
 * Status change straight from the dashboard list, without opening the record.
 * Returns a result rather than throwing so the dropdown can roll the pick back
 * AND say why — a silent revert reads as a broken control.
 */
export async function updateStatusFromList(
  formData: FormData,
): Promise<{ ok: boolean; error?: "invalid" | "paid_date_required" }> {
  assertCanWrite();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !VALID.has(status)) return { ok: false, error: "invalid" };

  // Same rule as the reservation page: 已確認預定 needs 客人付款日期 on record.
  if (status === "confirmed") {
    const r = await getReservation(id);
    if (confirmNeedsPaidDate(status, r?.customer_paid_date)) {
      return { ok: false, error: "paid_date_required" };
    }
  }

  await setStatus(id, status as ReservationStatus);
  revalidatePath("/admin");
  // Subtree: the record's email/invoice pages render status-derived content.
  revalidatePath(`/admin/reservations/${id}`, "layout");
  return { ok: true };
}
