import Link from "next/link";
import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { site, whatsappLink } from "@/lib/site";
import { breadcrumbLd } from "@/lib/jsonld";
import PageHero from "@/components/PageHero";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/JsonLd";
import { WhatsAppIcon, FacebookIcon, InstagramIcon, ArrowRight } from "@/components/icons";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const isEn = params.locale === "en";
  return pageMeta(
    params.locale,
    "/contact",
    isEn ? "Contact" : "聯絡我們",
    isEn
      ? "Reach the RENTAL819 Hong Kong team by WhatsApp, email or social media."
      : "透過 WhatsApp、電郵或社交媒體聯絡 RENTAL819 香港團隊。",
  );
}

export default function ContactPage({ params }: { params: { locale: string } }) {
  const locale: Locale = isLocale(params.locale) ? params.locale : "zh-hk";
  const dict = getDictionary(locale);
  const isEn = locale === "en";

  const methods = [
    {
      label: "WhatsApp",
      value: site.phone,
      href: whatsappLink(),
      icon: <WhatsAppIcon className="h-6 w-6" />,
      accent: "bg-[#25D366]",
    },
    {
      label: isEn ? "Email" : "電郵",
      value: site.email,
      href: `mailto:${site.email}`,
      icon: <span className="text-lg font-bold">@</span>,
      accent: "bg-brand-600",
    },
    {
      label: "Facebook",
      value: "rental819hk",
      href: site.social.facebook,
      icon: <FacebookIcon className="h-6 w-6" />,
      accent: "bg-[#1877F2]",
    },
    {
      label: "Instagram",
      value: "rental819_hk",
      href: site.social.instagram,
      icon: <InstagramIcon className="h-6 w-6" />,
      accent: "bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af]",
    },
  ];

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: dict.nav.home, url: localePath(locale, "/") },
          { name: dict.nav.contact, url: localePath(locale, "/contact") },
        ])}
      />
      <PageHero
        image="/images/about/shop.jpg"
        eyebrow={dict.nav.contact}
        title={isEn ? "Get in touch" : "聯絡我們"}
        intro={
          isEn
            ? "Questions, quotes or route advice — the Hong Kong team is here to help, in Cantonese, Mandarin or English."
            : "查詢、報價或路線建議 — 香港團隊隨時以廣東話、普通話或英語為你解答。"
        }
      >
        <Breadcrumb
          locale={locale}
          items={[{ label: dict.nav.home, href: "/" }, { label: dict.nav.contact }]}
        />
      </PageHero>

      <section className="container-x py-16 lg:py-20">
        <div className="grid gap-6 sm:grid-cols-2">
          {methods.map((m) => (
            <a
              key={m.label}
              href={m.href}
              target="_blank"
              rel="noopener noreferrer"
              className="card-hover flex items-center gap-4 p-6"
            >
              <span className={`flex h-12 w-12 items-center justify-center rounded-xl text-white ${m.accent}`}>
                {m.icon}
              </span>
              <span>
                <span className="block text-sm text-ink-muted">{m.label}</span>
                <span className="block font-semibold text-ink">{m.value}</span>
              </span>
            </a>
          ))}
        </div>

        <div className="mt-10 grid gap-6 rounded-3xl border border-slate-100 bg-slate-50 p-8 sm:grid-cols-2">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide text-brand-700">
              {dict.footer.hours}
            </h2>
            <p className="mt-2 text-sm text-ink-soft">{dict.footer.hoursValue}</p>
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide text-brand-700">
              {isEn ? "Find us" : "地址"}
            </h2>
            <a
              href={site.maps}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 hover:text-brand-800"
            >
              {isEn ? "Open in Google Maps" : "於 Google Maps 開啟"}
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="mt-10 text-center">
          <p className="text-ink-muted">
            {isEn ? "Ready to book?" : "準備好預約？"}
          </p>
          <Link href={localePath(locale, "/booking")} className="btn-primary mt-3">
            {dict.common.bookNow}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
