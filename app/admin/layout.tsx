import type { Metadata } from "next";
import "../globals.css";
import { getAdminLang } from "@/lib/admin/lang";
import { adminDict } from "@/lib/admin/i18n";

export function generateMetadata(): Metadata {
  return {
    title: `RENTAL819 ${adminDict(getAdminLang()).nav.badge}`,
    robots: { index: false, follow: false },
  };
}

// Self-contained document for the whole /admin subtree (login + app).
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The document language follows the operator's choice so screen readers and
  // the browser's own font selection match what is on screen.
  const lang = getAdminLang();

  return (
    <html lang={lang === "ja" ? "ja" : "zh-Hant-HK"}>
      <body className="min-h-screen bg-slate-50 font-sans text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
