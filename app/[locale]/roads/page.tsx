import Link from "next/link";
import type { Metadata } from "next";
import { pageAlternates } from "@/lib/seo";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { roadsContent, TOURS_URL } from "@/lib/content/roads";
import PageHero from "@/components/PageHero";
import { ArrowRight } from "@/components/icons";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const isEn = params.locale === "en";
  return {
    alternates: pageAlternates(params.locale, "/roads"),
    title: isEn ? "Japan's Legendary Roads" : "日本名道圖鑑",
    description: isEn
      ? "A field guide to Japan's greatest riding roads — by region, from Hokkaido to Okinawa. Rent a bike and ride them, or join a guided tour."
      : "日本名道圖鑑：由北海道到沖繩，按地區精選全日本最值得騎的名道與絕景公路。租車自駕或參加電單車旅行團。",
  };
}

export default function RoadsPage({ params }: { params: { locale: string } }) {
  const locale: Locale = isLocale(params.locale) ? params.locale : "zh-hk";
  const dict = getDictionary(locale);
  const c = roadsContent[locale];

  return (
    <>
      <PageHero image="/images/tours/hokkaido-2026-07-30.jpg" eyebrow={c.hero.eyebrow} title={c.hero.title} intro={c.hero.intro}>
        <a href={TOURS_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">
          {c.ctaTours}
          <ArrowRight className="h-4 w-4" />
        </a>
      </PageHero>

      <div className="container-x py-14 lg:py-20">
        <div className="space-y-14">
          {c.regions.map((region) => (
            <section key={region.region}>
              <div className="mb-5 flex items-center gap-3">
                <h2 className="text-xl font-bold sm:text-2xl">{region.region}</h2>
                <span className="h-px flex-1 bg-slate-100" />
                <span className="text-sm text-ink-muted">{region.roads.length}</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {region.roads.map((road) => (
                  <div key={road.name} className="card h-full p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-bold leading-snug text-ink">{road.name}</h3>
                      <span className="shrink-0 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">
                        {road.pref}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-ink-muted">{road.blurb}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* CTA */}
      <section className="bg-slate-50">
        <div className="container-x py-14 lg:py-20">
          <div className="rounded-3xl bg-brand-700 px-6 py-12 text-center text-white lg:px-12">
            <h2 className="text-2xl font-bold sm:text-3xl">{c.ctaTitle}</h2>
            <p className="mx-auto mt-3 max-w-2xl text-white/85">{c.ctaSubtitle}</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <a href={TOURS_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-brand-700 transition hover:bg-white/90">
                {c.ctaTours}
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link href={localePath(locale, "/booking")} className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10">
                {c.ctaBook}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
