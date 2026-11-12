export interface AvailDay {
  day: string;
  status: string;
  canStart: boolean;
}

/** Inclusive calendar walk from `start` through `end`, using UTC dates. */
export function eachDateInclusive(start: string, end: string): string[] {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(start) || !/^\d{4}-\d{2}-\d{2}$/.test(end) || start > end) {
    return [];
  }
  const out: string[] = [];
  let day = start;
  while (day <= end && out.length < 400) {
    out.push(day);
    day = addUtcDay(day);
  }
  return out;
}

export function dateDiffDays(start: string, end: string): number {
  const [ys, ms, ds] = start.split("-").map(Number);
  const [ye, me, de] = end.split("-").map(Number);
  const a = Date.UTC(ys, ms - 1, ds);
  const b = Date.UTC(ye, me - 1, de);
  return Math.round((b - a) / 86400000);
}

function addUtcDay(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + 1);
  return dt.toISOString().slice(0, 10);
}

/**
 * A unit can be requested for pick-up on `pickup` and return on `returnDate`
 * when every day in that inclusive range is `reservable`, and the pick-up day
 * is still inside the official 4-month booking window (`canStart`).
 * The return day has to be reservable too: the branch calendar will not accept
 * a closed day or a day already marked taken.
 */
export function unitAvailable(
  days: AvailDay[],
  pickup: string,
  returnDate: string,
): boolean {
  if (!(pickup < returnDate)) return false;
  const byDay = new Map(days.map((d) => [d.day, d]));
  const start = byDay.get(pickup);
  if (!start || start.status !== "reservable" || !start.canStart) return false;
  for (const day of eachDateInclusive(pickup, returnDate)) {
    const row = byDay.get(day);
    if (!row || row.status !== "reservable") return false;
  }
  return true;
}
