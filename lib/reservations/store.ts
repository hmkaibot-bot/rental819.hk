import "server-only";
import { isSupabaseConfigured, supabaseAdmin } from "@/lib/supabase";
import { demoReservations } from "./demo";
import type { Reservation, ReservationStatus } from "./types";

const TABLE = "reservations";

export interface NewReservation {
  booking_ref?: string | null;
  name_zh?: string | null;
  name_en?: string | null;
  gender?: string | null;
  dob?: string | null;
  email?: string | null;
  hk_phone?: string | null;
  hk_address?: string | null;
  jp_address?: string | null;
  jp_phone?: string | null;
  japanese_ability?: string | null;
  english_ability?: string | null;
  emergency_contact?: string | null;
  emergency_phone?: string | null;
  shop?: string | null;
  bike_pref_1?: string | null;
  bike_pref_2?: string | null;
  bike_pref_3?: string | null;
  pickup_date?: string | null;
  pickup_time?: string | null;
  return_date?: string | null;
  return_time?: string | null;
  addons?: Reservation["addons"];
  promo?: string | null;
  notes?: string | null;
  source?: string;
}

export const isDemoMode = () => !isSupabaseConfigured();

export async function listReservations(): Promise<Reservation[]> {
  if (isDemoMode()) {
    return [...demoReservations].sort((a, b) =>
      b.request_date.localeCompare(a.request_date),
    );
  }
  const { data, error } = await supabaseAdmin()
    .from(TABLE)
    .select("*")
    .order("request_date", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Reservation[];
}

export async function getReservation(id: string): Promise<Reservation | null> {
  if (isDemoMode()) {
    return demoReservations.find((r) => r.id === id) ?? null;
  }
  const { data, error } = await supabaseAdmin()
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data as Reservation) ?? null;
}

export async function createReservation(
  input: NewReservation,
): Promise<{ ok: true; id: string; booking_ref: string | null; demo?: boolean }> {
  if (isDemoMode()) {
    // No persistence in demo mode — acknowledge so the public form still works.
    return { ok: true, id: "demo-new", booking_ref: null, demo: true };
  }
  // booking_ref is assigned by a DB trigger on insert (YYYY-NNN), so read it
  // back — the acknowledgement email and Slack notice both quote it.
  const { data, error } = await supabaseAdmin()
    .from(TABLE)
    .insert({ ...input, addons: input.addons ?? {}, status: "new" })
    .select("id, booking_ref")
    .single();
  if (error) throw error;
  return {
    ok: true,
    id: data.id as string,
    booking_ref: (data.booking_ref as string | null) ?? null,
  };
}

export async function updateReservation(
  id: string,
  patch: Partial<Reservation>,
): Promise<{ ok: true; demo?: boolean }> {
  if (isDemoMode()) {
    return { ok: true, demo: true };
  }
  const { error } = await supabaseAdmin().from(TABLE).update(patch).eq("id", id);
  if (error) throw error;
  return { ok: true };
}

export async function setStatus(id: string, status: ReservationStatus) {
  return updateReservation(id, { status });
}
