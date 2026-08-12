import { NextResponse } from "next/server";
import { authenticate, sessionCookie, clearCookieHeaders } from "@/lib/admin/auth";

export const runtime = "nodejs";

/**
 * Where to land after signing in. Only same-site absolute paths are honoured —
 * `next` arrives from the query string, so echoing it into a redirect verbatim
 * would let a crafted login link bounce someone to another origin.
 */
function safeNext(value: unknown): string {
  const v = typeof value === "string" ? value : "";
  return v.startsWith("/") && !v.startsWith("//") ? v : "/admin";
}

export async function POST(request: Request) {
  const form = await request.formData().catch(() => null);
  const account = (form?.get("account") as string) ?? "";
  const password = (form?.get("password") as string) ?? "";
  const next = safeNext(form?.get("next"));

  const role = authenticate(account, password);
  if (!role) {
    return NextResponse.redirect(
      new URL(`/admin/login?error=1`, request.url),
      { status: 303 },
    );
  }
  const res = NextResponse.redirect(new URL(next, request.url), { status: 303 });
  res.cookies.set(sessionCookie(role));
  return res;
}

export async function DELETE(request: Request) {
  const res = NextResponse.redirect(new URL("/admin/login", request.url), {
    status: 303,
  });
  for (const h of clearCookieHeaders()) res.headers.append("Set-Cookie", h);
  return res;
}
