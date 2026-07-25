import { NextResponse } from "next/server";
import { CLEAR_COOKIE } from "@/lib/admin/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const res = NextResponse.redirect(new URL("/admin/login", request.url), {
    status: 303,
  });
  res.cookies.set(CLEAR_COOKIE);
  return res;
}
