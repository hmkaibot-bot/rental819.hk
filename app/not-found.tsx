import Link from "next/link";

/**
 * Root-segment 404. An unmatched path (e.g. /zh-hk/nope) resolves this boundary
 * OUTSIDE app/[locale]/layout.tsx, and the root layout is a passthrough — so the
 * document shell has to be rendered here, otherwise Next serves its own
 * "This page could not be found" with no <!doctype>, no <html lang>, no <body>.
 * In-locale 404s (e.g. a missing guide slug) still use app/[locale]/not-found.tsx.
 */
export default function NotFound() {
  return (
    <html lang="zh-Hant-HK">
      <body className="flex min-h-screen flex-col font-sans">
        <div className="container-x flex flex-1 flex-col items-center justify-center py-20 text-center">
          <p className="text-6xl font-black text-brand-600">404</p>
          <h1 className="mt-4 text-2xl font-bold">頁面不存在 · Page not found</h1>
          <p className="mt-2 text-ink-muted">
            抱歉，找不到你要的頁面。 · Sorry, we couldn&apos;t find that page.
          </p>
          <div className="mt-8 flex gap-3">
            <Link href="/zh-hk" className="btn-primary">
              返回首頁
            </Link>
            <Link href="/en" className="btn-outline">
              Back to home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
