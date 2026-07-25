import { NextResponse } from "next/server";
import { verifyPassword, sessionCookie, CLEAR_COOKIE } from "@/lib/admin/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const form = await request.formData().catch(() => null);
  const password = (form?.get("password") as string) ?? "";
  const next = (form?.get("next") as string) || "/admin";

  if (!verifyPassword(password)) {
    return NextResponse.redirect(
      new URL(`/admin/login?error=1`, request.url),
      { status: 303 },
    );
  }
  const res = NextResponse.redirect(new URL(next, request.url), { status: 303 });
  res.cookies.set(sessionCookie());
  return res;
}

export async function DELETE(request: Request) {
  const res = NextResponse.redirect(new URL("/admin/login", request.url), {
    status: 303,
  });
  res.cookies.set(CLEAR_COOKIE);
  return res;
}
