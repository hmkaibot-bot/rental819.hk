/**
 * Browser-only storage entries that lapse after a day.
 *
 * "local" (the default) is localStorage: shared by every tab and kept across
 * reloads and browser restarts, so the booking form's trip draft and the
 * first-touch attribution survive a visitor coming back later or in another
 * tab (for example a /rental category card opened in a new tab).
 * "session" is sessionStorage: it belongs to one tab and is cleared when that
 * tab closes, for data that should not outlive the visit, such as the booking
 * form's personal details during a same-tab trip to /rental and back.
 *
 * Storage can be missing or throw (private mode, blocked site data), so every
 * call swallows errors and callers must work without it.
 */
const TTL_MS = 24 * 60 * 60 * 1000;

export type StorageArea = "local" | "session";

function area(where: StorageArea): Storage {
  return where === "session" ? window.sessionStorage : window.localStorage;
}

/** The stored value, or null when missing, malformed or expired (an expired entry is deleted). */
export function readStored(key: string, where: StorageArea = "local"): unknown {
  try {
    const s = area(where);
    const raw = s.getItem(key);
    if (!raw) return null;
    const { t, v } = JSON.parse(raw) as { t?: unknown; v?: unknown };
    if (typeof t === "number" && Date.now() - t < TTL_MS) return v ?? null;
    s.removeItem(key);
  } catch {
    // Unavailable or malformed: behave as if nothing was stored.
  }
  return null;
}

export function writeStored(key: string, value: unknown, where: StorageArea = "local"): void {
  try {
    area(where).setItem(key, JSON.stringify({ t: Date.now(), v: value }));
  } catch {
    // Unavailable or full: the page carries on without it.
  }
}

export function removeStored(key: string, where: StorageArea = "local"): void {
  try {
    area(where).removeItem(key);
  } catch {
    // Unavailable: nothing to remove.
  }
}

/** localStorage key of the booking form's trip draft. */
export const bookingDraftKey = (locale: string) => `r819_booking_draft_${locale}`;
/** sessionStorage key of the booking form's personal details (this tab only). */
export const bookingPersonalKey = (locale: string) => `r819_booking_personal_${locale}`;
