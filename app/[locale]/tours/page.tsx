import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { tours, providerNote, REG_CLOSE_DAYS, type Tour } from "@/lib/content/tours";
import { whatsappLink, waEnquiry, site } from "@/lib/site";
import { breadcrumbLd } from "@/lib/jsonld";
import PageHero from "@/components/PageHero";
import Breadcrumb from "@/components/Breadcrumb";
import CTABand from "@/components/CTABand";
import JsonLd from "@/components/JsonLd";
import { ArrowRight, WhatsAppIcon } from "@/components/icons";

// Re-derive each tour's listing state daily, so departures drop out of
// 「現已接受報名」 without a deploy.
export const revalidate = 86400;

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const isEn = params.locale === "en";
  return pageMeta(
    params.locale,
    "/tours",
    isEn ? "Guided Japan Motorcycle Tours" : "日本電單車自駕遊旅行團",
    isEn
      ? "Led group self-drive motorcycle tours across Japan, with Cantonese-speaking guides and full support."
      : "日本電單車自駕遊旅行團：自 2017 年起已舉辦逾 20 次、逾 500 位港澳團友參與，每團均設資深廣東話領隊及後勤車全程隨團支援，行程輕鬆無憂。",
  );
}

function priceLabel(t: Tour, isEn: boolean) {
  if (t.priceFrom == null) return isEn ? "On enquiry" : "歡迎查詢";
  return `${isEn ? "from " : "HK$"}${isEn ? "HK$" : ""}${t.priceFrom.toLocaleString("en-US")}${isEn ? "" : " 起"}`;
}

/** Today's date in Hong Kong as YYYY-MM-DD. */
function hkToday() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Hong_Kong" }).format(new Date());
}

function daysBefore(iso: string, days: number) {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

type TourState = "open" | "closed" | "tbc" | "past";

/** Compared on the START date, so a tour already under way is no longer open. */
function tourState(t: Tour, today: string): TourState {
  if (t.date === "") return "open";
  if ((t.closes ?? daysBefore(t.date, REG_CLOSE_DAYS)) >= today) return "open";
  if (t.date >= today) return "closed";
  return t.ran ? "past" : "tbc";
}

function whatsappCta(t: Tour, state: TourState, isEn: boolean): { message: string; label: string } {
  switch (state) {
    case "open":
      return isEn
        ? { message: "Hi, I'd like to ask about a private club / group / corporate tour.", label: "Ask on WhatsApp" }
        : { message: "你好，我想查詢車會／團體／公司包團服務。", label: "WhatsApp 查詢" };
    case "closed":
      return isEn
        ? { message: `Hi, are there any places left on "${t.title}"?`, label: "Ask about places" }
        : { message: `你好，我想查詢「${t.title}」仲有冇餘位。`, label: "查詢餘位" };
    case "tbc":
      return isEn
        ? { message: `Hi, when is the next departure of "${t.title}"?`, label: "Ask about next date" }
        : { message: `你好，我想查詢「${t.title}」下一團的出發日期。`, label: "查詢下一團" };
    case "past":
      return isEn
        ? { message: `Hi, I'd like to ask about running a trip like "${t.title}" for my group.`, label: "Ask about a similar trip" }
        : { message: `你好，我想查詢類似「${t.title}」的包團行程。`, label: "查詢類似行程" };
  }
}

function TourCard({ tour, state, locale }: { tour: Tour; state: TourState; locale: Locale }) {
  const isEn = locale === "en";
  const badge = {
    open: null,
    closed: isEn ? "Registration closed" : "報名已截止",
    tbc: isEn ? "Next date TBC" : "下一團日期待定",
    past: isEn ? "Departed" : "已出發",
  }[state];
  const bookUrl = state === "open" ? tour.bookUrl : undefined;
  const cta = bookUrl ? null : whatsappCta(tour, state, isEn);
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
        {badge && (
          <span className="absolute right-3 top-3 rounded-full bg-ink/75 px-3 py-1 text-xs font-medium text-white">
            {badge}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between text-xs font-medium text-ink-muted">
          <span>{state === "tbc" ? (isEn ? "Date TBC" : "出發日期待定") : tour.dateLabel}</span>
          <span>{tour.duration}</span>
        </div>
        <h3 className="mt-2 text-lg font-bold leading-snug">{tour.title}</h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-ink-muted">
          {tour.description}
        </p>
        {/* Only open tours show a price: a closed tour can't be booked at it,
            and the next run's price is unknown. */}
        <div className="mt-5 flex items-center justify-between gap-4">
          {state === "open" && (
            <span className="text-lg font-black text-accent-600">
              {priceLabel(tour, isEn)}
            </span>
          )}
          <a
            href={bookUrl ?? whatsappLink(cta?.message)}
            target="_blank"
            rel="noopener noreferrer"
            data-cta="tour-signup"
            className="ml-auto inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800"
          >
            {cta && <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />}
            {cta ? cta.label : isEn ? "Sign up" : "報名"}
            {bookUrl && <ArrowRight className="h-4 w-4" />}
          </a>
        </div>
        {state === "open" && tour.priceFrom != null && (
          <p className="mt-2 text-xs leading-5 text-ink-muted">
            {isEn
              ? "Per person, twin share; excludes flights, fuel and tolls (meet and finish in Japan)"
              : "每位・兩人一房・不含機票、油費及路費（日本當地集合及解散）"}
          </p>
        )}
      </div>
    </article>
  );
}

function TourSection({
  title,
  intro,
  list,
  state,
  locale,
  shaded,
}: {
  title: string;
  intro?: string;
  list: Tour[];
  state: TourState;
  locale: Locale;
  shaded: boolean;
}) {
  return (
    <section className={shaded ? "bg-slate-50" : undefined}>
      <div className="container-x py-16 lg:py-20">
        <h2 className={`${intro ? "mb-2" : "mb-8"} text-2xl font-bold sm:text-3xl`}>{title}</h2>
        {intro && <p className="mb-8 max-w-2xl text-ink-muted">{intro}</p>}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((t) => (
            <TourCard key={t.id} tour={t} state={state} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}

const soonestFirst = (a: Tour, b: Tour) =>
  Number(a.date === "") - Number(b.date === "") || a.date.localeCompare(b.date);
const latestFirst = (a: Tour, b: Tour) => b.date.localeCompare(a.date);

export default function ToursPage({ params }: { params: { locale: string } }) {
  const locale: Locale = isLocale(params.locale) ? params.locale : "zh-hk";
  const dict = getDictionary(locale);
  const isEn = locale === "en";
  const today = hkToday();
  const inState = (s: TourState) => tours[locale].filter((t) => tourState(t, today) === s);
  const sections = [
    {
      state: "open" as const,
      list: inState("open").sort(soonestFirst),
      title: isEn ? "Now accepting registration" : "現已接受報名",
    },
    {
      state: "closed" as const,
      list: inState("closed").sort(soonestFirst),
      title: isEn ? "Departing soon (registration closed)" : "即將出發（報名已截止）",
    },
    {
      state: "tbc" as const,
      list: inState("tbc").sort(latestFirst),
      title: isEn ? "Next departure to be confirmed" : "下一團日期待定",
      intro: isEn
        ? "Dates for the next run of these routes haven't been announced yet — ask us on WhatsApp."
        : "以下路線的下一團日期尚待公布，歡迎 WhatsApp 查詢。",
    },
    {
      state: "past" as const,
      list: inState("past").sort(latestFirst),
      title: isEn ? "Past departures" : "過往的自駕團",
      intro: isEn
        ? "A glimpse of routes we've already led — ask us to run a similar itinerary for your group."
        : "以下是我們曾帶領的路線 — 歡迎查詢為你的團度身安排類似行程。",
    },
  ].filter((s) => s.list.length > 0);

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: dict.nav.home, url: localePath(locale, "/") },
          { name: dict.nav.tours, url: localePath(locale, "/tours") },
        ])}
      />
      <PageHero
        image="/images/tours/tohoku-2026-09-20.jpg"
        eyebrow={dict.nav.tours}
        title={isEn ? "Guided self-drive motorcycle tours" : "電單車自駕遊旅行團"}
        intro={
          isEn
            ? "Since 2017 we've run 20+ tours for 500+ Hong Kong & Macau riders — every departure led by an experienced Cantonese-speaking guide with a support vehicle throughout."
            : "自 2017 年起已舉辦逾 20 次旅行團、逾 500 位港澳團友參與。每團均設資深廣東話領隊及後勤車全程隨團支援，讓你無憂享受騎旅。"
        }
      >
        <Breadcrumb
          locale={locale}
          items={[{ label: dict.nav.home, href: "/" }, { label: dict.nav.tours }]}
        />
        {/* Who actually organises and sells these tours — stated up front, in
            the same view as the prices on the cards below. */}
        <p className="mt-6 max-w-2xl text-sm leading-6 text-brand-100">
          {providerNote[locale]}
        </p>
        <div className="mt-6">
          <a
            href={waEnquiry(locale, "tours", dict.nav.tours)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn bg-white text-brand-800 hover:bg-brand-50"
            data-cta="tours-hero-wa"
          >
            <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />
            {dict.common.whatsapp}
          </a>
        </div>
      </PageHero>

      {/* Shading alternates over the sections actually shown, since any of them can be empty. */}
      {sections.map((sec, i) => (
        <TourSection key={sec.state} {...sec} locale={locale} shaded={i % 2 === 1} />
      ))}

      <div className="py-20">
        <CTABand
          locale={locale}
          dict={dict}
          primaryHref={site.adventureUrl}
          primaryLabel={isEn ? "Book on 26 Adventure" : "到 26 Adventure 報名"}
          waMessageHref={waEnquiry(locale, "tours", dict.nav.tours)}
          title={isEn ? "Ready to join a tour?" : "想參加自駕團？"}
          subtitle={
            isEn ? (
              <>
                Guided tours are booked on 26adventure.com; for{" "}
                <Link href={localePath(locale, "/packages")} className="font-semibold text-white underline">
                  self-drive packages
                </Link>
                , ask us on WhatsApp.
              </>
            ) : (
              <>
                自駕團於 26adventure.com 報名；
                <Link href={localePath(locale, "/packages")} className="font-semibold text-white underline">
                  自駕套票
                </Link>
                請 WhatsApp 查詢。
              </>
            )
          }
        />
        <p className="container-x mt-6 text-center text-xs text-ink-muted">
          {isEn
            ? `Guided tours are operated by ${site.travelAgent.name} · HK Travel Agent Licence No. ${site.travelAgent.licence}.`
            : `自駕團由 ${site.travelAgent.name} 提供，旅行代理商牌照號碼：${site.travelAgent.licence}。`}
        </p>
      </div>
    </>
  );
}
