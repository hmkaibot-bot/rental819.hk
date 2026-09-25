import Link from "next/link";
import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { rentalContent } from "@/lib/content/rental";
import { site, waEnquiry } from "@/lib/site";
import { breadcrumbLd, serviceLd } from "@/lib/jsonld";
import PageHero from "@/components/PageHero";
import Breadcrumb from "@/components/Breadcrumb";
import CTABand from "@/components/CTABand";
import CoverageMap from "@/components/CoverageMap";
import JsonLd from "@/components/JsonLd";
import TrustLine from "@/components/TrustLine";
import { ArrowRight } from "@/components/icons";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const isEn = params.locale === "en";
  return pageMeta(
    params.locale,
    "/rental",
    isEn ? "Rent a Motorcycle in Japan | Book from Hong Kong" : "日本租電單車｜香港中文預約・1 天 HK$295 起",
    isEn
      ? `Rent a motorcycle in Japan from HK$295 a day (class P-1, reference price) with compulsory and voluntary insurance included — scooters, naked bikes, tourers, Harleys and adventure bikes at ${site.parent.branches} branches, quoted by our Hong Kong team.`
      : `日本租電單車 1 天參考租金 HK$295 起（P-1 級），已包強制及任意保險；綿羊、街車、旅行車、Harley 及越野車，全日本 ${site.parent.branches} 間分店取車，香港團隊以中文確認報價。`,
  );
}

export default function RentalPage({ params }: { params: { locale: string } }) {
  const locale: Locale = isLocale(params.locale) ? params.locale : "zh-hk";
  const dict = getDictionary(locale);
  const c = rentalContent[locale];
  const isEn = locale === "en";

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: dict.nav.home, url: localePath(locale, "/") },
          { name: dict.nav.rental, url: localePath(locale, "/rental") },
        ])}
      />
      {/* The bike categories rendered below are the offer catalog — no price is
          shown on this page, so the Service node carries none. */}
      <JsonLd
        data={serviceLd(locale, {
          name: c.hero.title,
          description: c.hero.intro,
          categories: c.categories.map((cat) => ({ title: cat.name })),
        })}
      />
      <PageHero image="/images/tours/shikoku-2026-07-01.jpg" eyebrow={c.hero.eyebrow} title={c.hero.title} intro={c.hero.intro}>
        <Breadcrumb
          locale={locale}
          items={[{ label: dict.nav.home, href: "/" }, { label: dict.nav.rental }]}
        />
        <div className="mt-6">
          <Link href={localePath(locale, "/booking")} className="btn-primary" data-cta="rental-hero-book">
            {dict.common.bookNow}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <TrustLine locale={locale} dict={dict} tone="dark" />
      </PageHero>

      {/* Bike categories */}
      <section className="container-x py-16 lg:py-20">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-2xl font-bold sm:text-3xl">{c.categoriesHead}</h2>
          <p className="mt-3 text-ink-muted">{c.categoriesIntro}</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {c.categories.map((cat) => (
            <Link
              key={cat.name}
              href={localePath(locale, `/booking?bike=${encodeURIComponent(`${cat.name} ${cat.cc}`)}`)}
              className="card-hover block p-6"
              data-cta="rental-category"
            >
              <div className="flex items-baseline justify-between">
                <h3 className="text-lg font-bold">{cat.name}</h3>
                <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-700">
                  {cat.cc}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-ink-muted">{cat.note}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-700">
                {isEn ? "Choose this type" : "揀呢類車"} <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Coverage */}
      <section className="bg-slate-50">
        <div className="container-x py-16 lg:py-20">
          <div className="mb-10 max-w-2xl">
            <h2 className="text-2xl font-bold sm:text-3xl">{c.coverageHead}</h2>
            <p className="mt-3 text-ink-muted">{c.coverageIntro}</p>
          </div>
          <CoverageMap locale={locale} />
        </div>
      </section>

      {/* Process link */}
      <section className="container-x py-16 lg:py-20">
        <div className="grid items-center gap-8 rounded-3xl border border-slate-100 bg-white p-8 shadow-card lg:grid-cols-[1.4fr_1fr] lg:p-12">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">{c.howHead}</h2>
            <p className="mt-3 text-ink-muted">{c.howIntro}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={localePath(locale, "/guide/pickup")} className="btn-brand">
                {isEn ? "See the full process" : "查看完整流程"}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href={localePath(locale, "/guide/fees")} className="btn-outline">
                {isEn ? "Rent & fees" : "租金及費用"}
              </Link>
            </div>
          </div>
          <ol className="space-y-3 text-sm text-ink-soft">
            {(isEn
              ? ["Check your documents", "Pick a branch & bike", "Choose your dates", "Send the booking form", "Collect & ride"]
              : ["確認證件", "選擇分店及車款", "選擇租用日期", "填寫預約表格", "取車出發"]
            ).map((step, i) => (
              <li key={i} className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-600 text-xs font-black text-white">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className="pb-20">
        <CTABand
          locale={locale}
          dict={dict}
          title={c.ctaTitle}
          subtitle={c.ctaSubtitle}
          waMessageHref={waEnquiry(locale, "rental", dict.nav.rental)}
        />
      </div>
    </>
  );
}
