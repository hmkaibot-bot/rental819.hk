"use server";

import { assertCanWrite } from "@/lib/admin/auth";

import { revalidatePath } from "next/cache";
import { updateFeeItems, type FeeItemPatch } from "@/lib/reservations/items-store";

export async function saveFeeItems(patches: FeeItemPatch[]) {
  assertCanWrite();
  if (patches.length) await updateFeeItems(patches);
  revalidatePath("/admin/items");
  revalidatePath("/admin/accounting");
  return { ok: true as const };
}
