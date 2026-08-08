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
  const configured = (process.env.ADMIN_SESSION_SECRET ?? "").trim();
  const adminPw = (process.env.ADMIN_PASSWORD ?? "").trim();

  // A viewer's browser holds sign("viewer") in the clear. If that is keyed with
  // the admin password, the viewer is holding an offline verifier for it — one
  // hash per guess, no salt, no rate limit — and recovering it makes them an
  // admin. So the moment a read-only login exists, the signing key has to be
  // something other than the credential it protects.
  if (viewerPassword()) {
    if (!configured) {
      throw new Error(
        "Set ADMIN_SESSION_SECRET before enabling VIEWER_PASSWORD — signing sessions with the admin password would hand read-only users an offline cracking oracle for it. Generate one with: openssl rand -hex 32",
      );
    }
    if (configured === adminPw) {
      throw new Error(
        "ADMIN_SESSION_SECRET must differ from ADMIN_PASSWORD when VIEWER_PASSWORD is set.",
      );
    }
  }

  if (configured) return configured;
  if (adminPw) return adminPw;

  // The last fallback is a constant in a public repo. Signing a *role* with it
  // would let anyone who can read the source mint an `admin.<hmac>` cookie.
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "Set ADMIN_SESSION_SECRET — refusing to sign sessions with the public development key.",
    );
  }
  return "r819-dev-secret";
}

/** Read-only accounts sign in with an account name as well as a password. */
function viewerAccount(): string {
  return ((process.env.VIEWER_EMAIL ?? "").trim() || "inquiry@mototoursjapan.com").toLowerCase();
}

/** No fallback: with VIEWER_PASSWORD unset there is simply no viewer login. */
function viewerPassword(): string | null {
  return (process.env.VIEWER_PASSWORD ?? "").trim() || null;
}

/**
 * The same validation secret() enforces, but reported rather than thrown — so
 * the login page can say what to fix instead of returning a bare 500. Returns
 * null when the configuration is safe.
 */
export function configError(): string | null {
  if (!viewerPassword()) return null;
  const configured = (process.env.ADMIN_SESSION_SECRET ?? "").trim();
  if (!configured) {
    return "ADMIN_SESSION_SECRET is not set. It is required once VIEWER_PASSWORD is enabled — otherwise sessions are signed with the admin password, which a read-only user could then attack offline. Generate one with: openssl rand -hex 32";
  }
  if (configured === (process.env.ADMIN_PASSWORD ?? "").trim()) {
    return "ADMIN_SESSION_SECRET must be different from ADMIN_PASSWORD when VIEWER_PASSWORD is set.";
  }
  return null;
}

export type AdminRole = "admin" | "viewer";

/**
 * Session signature. The role is signed rather than merely stored, because the
 * cookie value is attacker-controlled: the role is read out of it but only
 * believed once the HMAC over that same claimed role verifies. A second cookie
 * holding the role would not be covered by this signature at all.
 */
function sign(role: AdminRole): string {
  return createHmac("sha256", secret()).update(`v1:${role}`).digest("hex");
}

/** Constant-time compare that tolerates a malformed cookie of any length. */
function eq(a: string, b: string): boolean {
  const x = Buffer.from(a || "");
  const y = Buffer.from(b || "");
  // timingSafeEqual throws on a length mismatch, which would turn a junk cookie
  // into a 500 instead of a redirect to the login page.
  return x.length === y.length && timingSafeEqual(x, y);
}

export function verifyPassword(input: string): boolean {
  return eq(input || "", password());
}

/** The role this request is authenticated as, or null when it is not. */
export function sessionRole(): AdminRole | null {
  const raw = cookies().get(COOKIE)?.value ?? "";
  if (!raw) return null;

  const dot = raw.indexOf(".");
  if (dot < 0) {
    // Pre-role cookie: a bare digest over "admin-ok". Kept so the deploy does
    // not sign every logged-in operator out; safe to delete once rolled out.
    const legacy = createHmac("sha256", secret()).update("admin-ok").digest("hex");
    return eq(raw, legacy) ? "admin" : null;
  }

  const role = raw.slice(0, dot);
  if (role !== "admin" && role !== "viewer") return null;
  return eq(raw.slice(dot + 1), sign(role)) ? role : null;
}

export function isAuthed(): boolean {
  return sessionRole() !== null;
}

/** Only a full admin may change anything. */
export function canWrite(): boolean {
  return sessionRole() === "admin";
}

/**
 * Authorisation backstop for every mutating server action and route handler.
 *
 * Server actions compile to POST endpoints that are addressable on their own —
 * the redirect in the admin layout guards page renders, not action calls — so
 * hiding a button in the UI proves nothing. This has to be the first statement
 * in the action body.
 */
export function assertCanWrite(): void {
  if (!canWrite()) {
    throw new Error("forbidden: this session is read-only and cannot make changes");
  }
}

/**
 * Which role do these credentials grant, if any? The admin check runs first and
 * ignores the account field, so the existing password-only admin login is
 * unchanged.
 */
export function authenticate(account: string, input: string): AdminRole | null {
  if (verifyPassword(input)) return "admin";
  const vp = viewerPassword();
  if (vp && (account ?? "").trim().toLowerCase() === viewerAccount() && eq(input || "", vp)) {
    return "viewer";
  }
  return null;
}

export function sessionCookie(role: AdminRole) {
  return {
    name: COOKIE,
    value: `${role}.${sign(role)}`,
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
