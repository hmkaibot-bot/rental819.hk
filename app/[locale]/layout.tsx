import { notFound } from "next/navigation";
import { locales, isLocale, htmlLang, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { buildNav } from "@/lib/nav";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
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
        <Header locale={locale} dict={dict} nav={nav} />
        <main className="flex-1">{children}</main>
        <Footer locale={locale} dict={dict} />
        <WhatsAppFloat label={dict.common.whatsapp} />
      </body>
    </html>
  );
}
