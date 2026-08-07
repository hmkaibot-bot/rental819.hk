import "server-only";
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

/**
 * Session cookie, issued site-wide (path=/).
 *
 * Deliberately a different name from the pre-2026-08 `r819_admin`, which was
 * scoped to /admin. Reusing the name would leave a stale /admin-scoped cookie
 * sitting alongside the new one: the admin pages would still read as logged in
 * (so /admin/login bounces you away and you can never obtain the new cookie),
 * while every /api/admin/* call — which that old cookie is never sent to —
 * keeps returning 401. Renaming makes the legacy cookie invisible, so the next
 * login is a clean one.
 */
const COOKIE = "r819_sess";

/** Pre-2026-08 cookies to clear on logout so no stale copy is left behind. */
const LEGACY = [{ name: "r819_admin", path: "/admin" }, { name: "r819_admin", path: "/" }];

function password(): string {
  // Set ADMIN_PASSWORD in the environment for production.
  //
  // Trimmed because pasting a value into a hosting dashboard very easily picks
  // up a trailing newline or space, and the comparison below is exact — the
  // symptom is "the right password stops working" with nothing in the logs.
  // A shared gate password with meaningful edge whitespace is not worth
  // supporting against that.
  return (process.env.ADMIN_PASSWORD ?? "").trim() || "rental819";
}

function secret(): string {
  // Trimmed for the same reason as password(): a stray newline here silently
  // changes the signing key and invalidates every issued session.
  return (
    (process.env.ADMIN_SESSION_SECRET ?? "").trim() ||
    (process.env.ADMIN_PASSWORD ?? "").trim() ||
    "r819-dev-secret"
  );
}

/** Signed session token (not a real user system yet — a shared-password gate). */
function token(): string {
  return createHmac("sha256", secret()).update("admin-ok").digest("hex");
}

export function verifyPassword(input: string): boolean {
  const a = Buffer.from(input || "");
  const b = Buffer.from(password());
  return a.length === b.length && timingSafeEqual(a, b);
}

export function isAuthed(): boolean {
  const c = cookies().get(COOKIE)?.value;
  if (!c) return false;
  const expected = token();
  const a = Buffer.from(c);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function sessionCookie() {
  return {
    name: COOKIE,
    value: token(),
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    // Site-wide, not "/admin": the admin's own API routes live under
    // /api/admin, which is not under /admin, so a cookie scoped to /admin is
    // never sent to them and every isAuthed() check there fails with 401.
    path: "/",
    maxAge: 60 * 60 * 12, // 12h
  };
}

/**
 * Logout clears the current cookie and every legacy one, so no stale copy is
 * left to confuse a later session.
 *
 * These are raw Set-Cookie strings rather than repeated `res.cookies.set()`
 * calls, because ResponseCookies keys by name — setting the same name twice
 * replaces the first entry instead of emitting both headers.
 */
export function clearCookieHeaders(): string[] {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return [{ name: COOKIE, path: "/" }, ...LEGACY].map(
    ({ name, path }) => `${name}=; Path=${path}; Max-Age=0; HttpOnly; SameSite=Lax${secure}`,
  );
}
