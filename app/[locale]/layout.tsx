import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { locales, isLocale, htmlLang, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { buildNav } from "@/lib/nav";
import { organizationLd, websiteLd } from "@/lib/jsonld";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import JsonLd from "@/components/JsonLd";
import ConversionTracker from "@/components/ConversionTracker";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const en = params.locale === "en";
  return {
    title: {
      template: en ? "%s | RENTAL819 Hong Kong" : "%s｜RENTAL819 香港",
      // `absolute`, not `default`: a default would still get the root layout's
      // "%s — RENTAL819" template and carry the brand twice.
      absolute: en ? "RENTAL819 Hong Kong — Japan motorcycle rental" : "RENTAL819 香港 — 日本電單車自駕遊",
    },
  };
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const nav = buildNav(dict);

  return (
    <html lang={htmlLang[locale]}>
      <body className="flex min-h-screen flex-col font-sans">
        <JsonLd data={organizationLd(locale)} />
        <JsonLd data={websiteLd(locale)} />
        <Header locale={locale} dict={dict} nav={nav} />
        <main className="flex-1">{children}</main>
        <Footer locale={locale} dict={dict} />
        <WhatsAppFloat locale={locale} label={dict.common.whatsapp} />
        <Analytics />
        <ConversionTracker />
      </body>
    </html>
  );
}
