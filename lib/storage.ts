/**
 * Browser-only localStorage entries that lapse after a day. localStorage rather
 * than sessionStorage because the booking form's /rental link opens a new tab,
 * and a new tab starts with an empty sessionStorage. Storage can be missing or
 * throw (private mode, blocked site data), so every call swallows errors and
 * callers must work without it.
 */
const TTL_MS = 24 * 60 * 60 * 1000;

export function readStored(key: string): unknown {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const { t, v } = JSON.parse(raw) as { t?: unknown; v?: unknown };
    if (typeof t === "number" && Date.now() - t < TTL_MS) return v ?? null;
    window.localStorage.removeItem(key);
  } catch {
    // Unavailable or malformed: behave as if nothing was stored.
  }
  return null;
}

export function writeStored(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify({ t: Date.now(), v: value }));
  } catch {
    // Unavailable or full: the page carries on without it.
  }
}

export function removeStored(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Unavailable: nothing to remove.
  }
}
