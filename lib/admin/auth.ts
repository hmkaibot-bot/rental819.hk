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
    path: "/admin",
    maxAge: 60 * 60 * 12, // 12h
  };
}

export const CLEAR_COOKIE = { name: COOKIE, value: "", path: "/admin", maxAge: 0 };
