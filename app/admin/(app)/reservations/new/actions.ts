"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createReservation } from "@/lib/reservations/store";
import type { ReservationAddons } from "@/lib/reservations/types";

/** Create a reservation from the back-office form. */
export async function createReservationAction(formData: FormData) {
  const s = (k: string) => {
    const v = formData.get(k);
    return v == null || String(v).trim() === "" ? null : String(v).trim();
  };
  const on = (k: string) => formData.get(k) === "on";
  const count = (k: string) => {
    const n = Number(formData.get(k));
    return Number.isFinite(n) && n > 0 ? n : undefined;
  };

  const addons: ReservationAddons = {
    cardo: on("addon_cardo") || undefined,
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

  const res = await createReservation({
    booking_ref: s("booking_ref"),
    name_zh: s("name_zh"),
    name_en: s("name_en"),
    gender: s("gender"),
    dob: s("dob"),
    email: s("email"),
    hk_phone: s("hk_phone"),
    hk_address: s("hk_address"),
    jp_address: s("jp_address"),
    jp_phone: s("jp_phone"),
    japanese_ability: s("japanese_ability"),
    english_ability: s("english_ability"),
    emergency_contact: s("emergency_contact"),
    emergency_phone: s("emergency_phone"),
    shop: s("shop"),
    bike_pref_1: s("bike_pref_1"),
    bike_pref_2: s("bike_pref_2"),
    bike_pref_3: s("bike_pref_3"),
    pickup_date: s("pickup_date"),
    pickup_time: s("pickup_time"),
    return_date: s("return_date"),
    return_time: s("return_time"),
    addons,
    promo: s("promo"),
    notes: s("notes"),
    source: "admin",
  });

  revalidatePath("/admin");
  // In demo mode there is no persisted row to open.
  redirect(res.demo ? "/admin" : `/admin/reservations/${res.id}`);
}
