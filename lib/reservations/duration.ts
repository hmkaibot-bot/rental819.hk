import type { Reservation } from "./types";

/**
 * Rental duration in days, counted in 24-hour units from pick-up to return —
 * any part of a new 24-hour block counts as a full day, minimum 1. e.g.
 * 08-19 09:00 → 08-20 19:30 is 34.5 hours = 2 days, while an exact
 * 09:00 → next-day 09:00 is 1. Falls back to the plain date difference when a
 * time is missing (a bare date pair like 08-19 → 08-20 still reads as 1 day).
 */
export function rentalDays(
  r: Pick<Reservation, "pickup_date" | "pickup_time" | "return_date" | "return_time">,
): number {
  if (!r.pickup_date || !r.return_date) return 1;
  const ms = at(r.return_date, r.return_time) - at(r.pickup_date, r.pickup_time);
  if (!Number.isFinite(ms)) return 1;
  return Math.max(1, Math.ceil(ms / 86400000));
}

/** Epoch ms for a `YYYY-MM-DD` date plus an optional `HH:MM[:SS]` time. */
function at(date: string, time: string | null | undefined): number {
  const t = (time ?? "").trim();
  const hm = /^\d{2}:\d{2}/.test(t) ? t.slice(0, 5) : "00:00";
  return new Date(`${date}T${hm}:00`).getTime();
}
