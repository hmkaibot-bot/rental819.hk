import "server-only";
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE = "r819_admin";

function password(): string {
  // Set ADMIN_PASSWORD in the environment for production.
  return process.env.ADMIN_PASSWORD || "rental819";
}

function secret(): string {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "r819-dev-secret";
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
 * Logout has to clear both paths: sessions issued before the cookie moved to
 * "/" still carry the old /admin-scoped one, and a cookie left at /admin would
 * keep authenticating the admin pages after logging out.
 *
 * These are raw Set-Cookie strings rather than two `res.cookies.set()` calls,
 * because ResponseCookies keys by name — setting the same name twice replaces
 * the first entry instead of emitting both headers.
 */
export function clearCookieHeaders(): string[] {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return ["/", "/admin"].map(
    (path) => `${COOKIE}=; Path=${path}; Max-Age=0; HttpOnly; SameSite=Lax${secure}`,
  );
}
