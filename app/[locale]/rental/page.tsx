import Link from "next/link";
import type { Metadata } from "next";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { rentalContent } from "@/lib/content/rental";
import PageHero from "@/components/PageHero";
import CTABand from "@/components/CTABand";
import { ArrowRight } from "@/components/icons";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const isEn = params.locale === "en";
  return {
    title: isEn ? "Rent a Motorcycle in Japan" : "日本電單車租賃",
    description: isEn
      ? "Rent a motorcycle in Japan — 125cc to big tourers and Harleys, 99 branches nationwide, booked from Hong Kong."
      : "日本電單車租賃：125cc 至大型旅行車、Harley，全日本 99 間分店，香港預約。",
  };
}

export default function RentalPage({ params }: { params: { locale: string } }) {
  const locale: Locale = isLocale(params.locale) ? params.locale : "zh-hk";
  const dict = getDictionary(locale);
  const c = rentalContent[locale];
  const isEn = locale === "en";

  return (
    <>
      <PageHero eyebrow={c.hero.eyebrow} title={c.hero.title} intro={c.hero.intro}>
        <Link href={localePath(locale, "/booking")} className="btn-primary">
          {dict.common.bookNow}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </PageHero>

      {/* Bike categories */}
      <section className="container-x py-16 lg:py-20">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-2xl font-bold sm:text-3xl">{c.categoriesHead}</h2>
          <p className="mt-3 text-ink-muted">{c.categoriesIntro}</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {c.categories.map((cat) => (
            <div key={cat.name} className="card p-6">
              <div className="flex items-baseline justify-between">
                <h3 className="text-lg font-bold">{cat.name}</h3>
                <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-700">
                  {cat.cc}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-ink-muted">{cat.note}</p>
            </div>
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {c.regions.map((r) => (
              <div key={r.name} className="rounded-xl border border-slate-100 bg-white p-5">
                <h3 className="font-bold text-brand-700">{r.name}</h3>
                <p className="mt-1 text-sm text-ink-muted">{r.prefectures}</p>
              </div>
            ))}
          </div>
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
        <CTABand locale={locale} dict={dict} title={c.ctaTitle} subtitle={c.ctaSubtitle} />
      </div>
    </>
  );
}
