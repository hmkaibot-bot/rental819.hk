import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { tours, type Tour } from "@/lib/content/tours";
import { whatsappLink } from "@/lib/site";
import PageHero from "@/components/PageHero";
import CTABand from "@/components/CTABand";
import { ArrowRight, WhatsAppIcon } from "@/components/icons";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const isEn = params.locale === "en";
  return {
    title: isEn ? "Guided Motorcycle Tours" : "電單車旅行團",
    description: isEn
      ? "Led group self-drive motorcycle tours across Japan, with Cantonese-speaking guides and full support."
      : "資深廣東話領隊帶隊、後勤車全程支援的日本電單車自駕遊旅行團。",
  };
}

function priceLabel(t: Tour, isEn: boolean) {
  if (t.priceFrom == null) return isEn ? "On enquiry" : "歡迎查詢";
  return `${isEn ? "from " : "HK$"}${isEn ? "HK$" : ""}${t.priceFrom.toLocaleString("en-US")}${isEn ? "" : " 起"}`;
}

function TourCard({ tour, locale }: { tour: Tour; locale: Locale }) {
  const isEn = locale === "en";
  return (
    <article className="group card-hover flex flex-col overflow-hidden">
      <div className="relative aspect-[16/10] overflow-hidden">
        {tour.image ? (
          <Image
            src={tour.image}
            alt={tour.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-700 to-brand-950 p-4 text-center">
            <span className="text-lg font-black text-white/90">{tour.region}</span>
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-brand-950/85 px-3 py-1 text-xs font-semibold text-white">
          {tour.region}
        </span>
        {!tour.upcoming && (
          <span className="absolute right-3 top-3 rounded-full bg-ink/75 px-3 py-1 text-xs font-medium text-white">
            {isEn ? "Departed" : "已出發"}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between text-xs font-medium text-ink-muted">
          <span>{tour.dateLabel}</span>
          <span>{tour.duration}</span>
        </div>
        <h3 className="mt-2 text-lg font-bold leading-snug">{tour.title}</h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-ink-muted">
          {tour.description}
        </p>
        <div className="mt-5 flex items-center justify-between">
          <span className="text-lg font-black text-accent-600">
            {priceLabel(tour, isEn)}
          </span>
          <a
            href={whatsappLink(
              isEn
                ? `Hi, I'm interested in the tour: ${tour.title} (${tour.dateLabel})`
                : `你好，我想查詢旅行團：${tour.title}（${tour.dateLabel}）`,
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800"
          >
            {isEn ? "Enquire" : "查詢報名"}
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </article>
  );
}

export default function ToursPage({ params }: { params: { locale: string } }) {
  const locale: Locale = isLocale(params.locale) ? params.locale : "zh-hk";
  const dict = getDictionary(locale);
  const isEn = locale === "en";
  const list = tours[locale];
  const upcoming = list.filter((t) => t.upcoming);
  const past = list.filter((t) => !t.upcoming);

  return (
    <>
      <PageHero
        eyebrow={dict.nav.tours}
        title={isEn ? "Guided self-drive motorcycle tours" : "電單車自駕遊旅行團"}
        intro={
          isEn
            ? "Since 2017 we've run 20+ tours for 500+ Hong Kong & Macau riders — every departure led by an experienced Cantonese-speaking guide with a support vehicle throughout."
            : "自 2017 年起已舉辦逾 20 次旅行團、逾 500 位港澳團友參與。每團均設資深廣東話領隊及後勤車全程隨團支援，讓你無憂享受騎旅。"
        }
      >
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="btn bg-white text-brand-800 hover:bg-brand-50"
        >
          <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />
          {dict.common.whatsapp}
        </a>
      </PageHero>

      <section className="container-x py-16 lg:py-20">
        <h2 className="mb-8 text-2xl font-bold sm:text-3xl">
          {isEn ? "Now accepting registration" : "現已接受報名"}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {upcoming.map((t) => (
            <TourCard key={t.id} tour={t} locale={locale} />
          ))}
        </div>
      </section>

      {past.length > 0 && (
        <section className="bg-slate-50">
          <div className="container-x py-16 lg:py-20">
            <h2 className="mb-2 text-2xl font-bold sm:text-3xl">
              {isEn ? "Past departures" : "過往的自駕團"}
            </h2>
            <p className="mb-8 max-w-2xl text-ink-muted">
              {isEn
                ? "A glimpse of routes we've already led — ask us to run a similar itinerary for your group."
                : "以下是我們曾帶領的路線 — 歡迎查詢為你的團度身安排類似行程。"}
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {past.map((t) => (
                <TourCard key={t.id} tour={t} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="py-20">
        <CTABand
          locale={locale}
          dict={dict}
          title={isEn ? "Want a private group tour?" : "想包團出發？"}
          subtitle={
            isEn
              ? "Clubs, groups and companies — we tailor the route, dates and support to you."
              : "車會、團體、公司包團 — 路線、日期、後勤全為你度身訂造。"
          }
        />
      </div>
    </>
  );
}
