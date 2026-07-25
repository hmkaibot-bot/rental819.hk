import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "RENTAL819 租車後台",
  robots: { index: false, follow: false },
};

// Self-contained document for the whole /admin subtree (login + app).
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hant-HK">
      <body className="min-h-screen bg-slate-50 font-sans text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
