import { NextRequest, NextResponse } from "next/server";

/**
 * Locale constants are inlined here (rather than imported from "@/lib/i18n")
 * on purpose: Vercel's Edge-Function bundler rejects path-aliased imports in
 * middleware ("referencing unsupported modules: @/lib/i18n"), so the middleware
 * must stay self-contained. Keep these in sync with lib/i18n.ts.
 */
const locales = ["zh-hk", "en"] as const;
const defaultLocale = "zh-hk";

const PUBLIC_FILE = /\.(.*)$/;

/**
 * Redirect any path that isn't already locale-prefixed to the default locale,
 * e.g. `/rental` → `/zh-hk/rental`, `/` → `/zh-hk`.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip Next internals, the API, and static files.
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return;
  }

  const hasLocale = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );
  if (hasLocale) return;

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
