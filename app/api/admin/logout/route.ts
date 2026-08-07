import { NextResponse } from "next/server";
import { clearCookieHeaders } from "@/lib/admin/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const res = NextResponse.redirect(new URL("/admin/login", request.url), {
    status: 303,
  });
  for (const h of clearCookieHeaders()) res.headers.append("Set-Cookie", h);
  return res;
}
