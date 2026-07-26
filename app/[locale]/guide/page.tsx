import Link from "next/link";
import type { Metadata } from "next";
import { pageAlternates } from "@/lib/seo";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { guideDocs } from "@/lib/content/guide";
import PageHero from "@/components/PageHero";
import CTABand from "@/components/CTABand";
import { ArrowRight } from "@/components/icons";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const isEn = params.locale === "en";
  return {
    alternates: pageAlternates(params.locale, "/guide"),
    title: isEn ? "Ride Guide" : "自駕攻略",
    description: isEn
      ? "Everything you need to plan and ride a motorcycle self-drive trip in Japan."
      : "由證件、交通規則、保險到行程規劃，日本電單車自駕遊你需要知道的一切。",
  };
}

export default function GuideIndex({ params }: { params: { locale: string } }) {
  const locale: Locale = isLocale(params.locale) ? params.locale : "zh-hk";
  const dict = getDictionary(locale);
  const docs = guideDocs[locale];
  const isEn = locale === "en";

  return (
    <>
      <PageHero
        image="/images/tours/kansai-sakura-2026-04-08.jpg"
        eyebrow={dict.nav.guide}
        title={isEn ? "The Japan ride guide" : "日本自駕攻略"}
        intro={
          isEn
            ? "From licences and traffic rules to insurance, ETC and itinerary planning — read up before you ride."
            : "由所需證件、交通規則、保險、ETC，到行程與預算規劃，出發前先了解清楚。"
        }
      />
      <section className="container-x py-16 lg:py-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {docs.map((doc, i) => (
            <Link
              key={doc.slug}
              href={localePath(locale, `/guide/${doc.slug}`)}
              className="group card-hover flex flex-col p-6"
            >
              <span className="text-xs font-bold text-accent-600">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2 className="mt-2 text-lg font-bold text-ink">{doc.title}</h2>
              {doc.intro && (
                <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-ink-muted">
                  {doc.intro}
                </p>
              )}
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 group-hover:gap-2.5">
                {dict.common.readMore}
                <ArrowRight className="h-4 w-4 transition-all" />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <div className="pb-24">
        <CTABand
          locale={locale}
          dict={dict}
          title={isEn ? "Questions before you go?" : "出發前仲有疑問？"}
          subtitle={
            isEn
              ? "Our Hong Kong team is here to help you plan every detail."
              : "香港團隊樂意為你解答並規劃行程每個細節。"
          }
        />
      </div>
    </>
  );
}
