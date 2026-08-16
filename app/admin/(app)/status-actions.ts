"use server";

import { revalidatePath } from "next/cache";
import { assertCanWrite } from "@/lib/admin/auth";
import { setStatus } from "@/lib/reservations/store";
import {
  STATUS_FLOW,
  TERMINAL_STATUS,
  type ReservationStatus,
} from "@/lib/reservations/types";

const VALID = new Set<string>([...STATUS_FLOW, ...TERMINAL_STATUS].map((s) => s.key));

/** Status change straight from the dashboard list, without opening the record. */
export async function updateStatusFromList(formData: FormData) {
  assertCanWrite();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !VALID.has(status)) return;
  await setStatus(id, status as ReservationStatus);
  revalidatePath("/admin");
  // Subtree: the record's email/invoice pages render status-derived content.
  revalidatePath(`/admin/reservations/${id}`, "layout");
}
