import type { Metadata } from "next";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "RENTAL819 — 日本電單車自駕遊",
    template: "%s — RENTAL819",
  },
  description:
    "頭盔王 × Rental819：香港騎士的日本電單車租賃及自駕遊團，橫跨全日本 99 間分店。",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

/**
 * Passthrough root layout — the real <html>/<body> live in app/[locale]/layout.tsx
 * so the `lang` attribute is correct per locale (Next.js i18n pattern).
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
