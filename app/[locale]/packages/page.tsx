import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { packages, packageLeaflets } from "@/lib/content/tours";
import { site, whatsappLink } from "@/lib/site";
import { breadcrumbLd, packagesLd } from "@/lib/jsonld";
import PageHero from "@/components/PageHero";
import Breadcrumb from "@/components/Breadcrumb";
import CTABand from "@/components/CTABand";
import JsonLd from "@/components/JsonLd";
import { CheckIcon, WhatsAppIcon, PdfIcon } from "@/components/icons";

const fmt = (n: number) => n.toLocaleString("en-US");

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const isEn = params.locale === "en";
  const list = packages[isLocale(params.locale) ? params.locale : "zh-hk"];
  const noHotelMin = Math.min(...list.map((p) => p.priceFrom));
  const hotelMin = Math.min(...list.map((p) => p.hotelFrom));
  return pageMeta(
    params.locale,
    "/packages",
    isEn ? "Japan Motorcycle Packages: Flight + Bike" : "日本電單車自駕套票｜機票連電單車，可加住宿",
    isEn
      ? `Japan self-drive motorcycle packages from Hong Kong: return flight + bike from HK$${fmt(noHotelMin)} (3 days / 2 nights), or flight + hotel with breakfast + bike from HK$${fmt(hotelMin)}. Osaka, Kyushu, Okinawa and Tokyo routes, each with a suggested-route leaflet.`
      : `日本電單車自駕套票：香港來回機票＋電單車 3日2夜 HK$${fmt(noHotelMin)} 起；另有機票＋住宿連早餐＋電單車套票 HK$${fmt(hotelMin)} 起。大阪、九州、沖繩、東京四條路線，附建議路線單張，WhatsApp 即可查詢。`,
  );
}

export default function PackagesPage({ params }: { params: { locale: string } }) {
  const locale: Locale = isLocale(params.locale) ? params.locale : "zh-hk";
  const dict = getDictionary(locale);
  const isEn = locale === "en";
  const list = packages[locale];

  const includes = isEn
    ? [
        "Return economy flight from Hong Kong",
        "Motorcycle rental (from P3 class)",
        "Suggested route (see leaflet)",
        "Insurance & ETC guidance",
        "Hong Kong team support",
      ]
    : ["香港來回經濟客位機票", "電單車租賃（P3 級起）", "建議路線（見套票單張）", "保險及 ETC 指引", "香港團隊支援"];

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: dict.nav.home, url: localePath(locale, "/") },
          { name: dict.nav.packages, url: localePath(locale, "/packages") },
        ])}
      />
      <JsonLd data={packagesLd(locale, list)} />
      <PageHero
        image="/images/tours/kyushu-aso-2026-04-30.jpg"
        eyebrow={dict.nav.packages}
        title={isEn ? "Self-drive packages" : "電單車自駕套票"}
        intro={
          isEn
            ? "Flight + bike bundles for popular routes, with an optional version that adds hotels — the easy way to ride Japan independently, at your own pace."
            : "熱門路線的機票＋電單車套票，亦可選連住宿版本，最方便的日本電單車自由行組合，行程自己話事。"
        }
      >
        <Breadcrumb
          locale={locale}
          items={[{ label: dict.nav.home, href: "/" }, { label: dict.nav.packages }]}
        />
      </PageHero>

      {/* What's included */}
      <section className="container-x py-14">
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 sm:p-8">
          <h2 className="text-lg font-bold">
            {isEn ? "Every package includes" : "每個套票包括"}
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {includes.map((it) => (
              <li key={it} className="flex items-center gap-2 text-sm text-ink-soft">
                <CheckIcon className="h-5 w-5 shrink-0 text-brand-600" />
                {it}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-ink-muted">
            {isEn
              ? "Hotel with breakfast is included only in the flight + hotel + bike version. Prices are before taxes; peak-date supplements apply on some departures; prices vary with airline and bike class; book at least 21 days before departure or a surcharge may apply. Prices exclude HK and Japanese departure taxes, HK airport security charge, travel insurance and fuel surcharges. All prices are confirmed at the time of booking."
              : "住宿連早餐只包括於「機票＋住宿連早餐＋電單車」版本。套票價格為稅前票價；個別出發日子設旺季附加費；價格隨所選航空公司及電單車級別調整；請於出發前最少 21 天購票，否則或需支付附加費。套票價格不包括香港及當地離境稅、香港機場保安稅、旅遊保險及燃油附加費。所有價格以預訂時最後答覆為準。"}
          </p>
        </div>
      </section>

      {/* Package cards */}
      <section className="container-x pb-16">
        <div className="grid gap-6 md:grid-cols-2">
          {list.map((p) => {
            const leaflet = packageLeaflets[p.id];
            return (
            <article key={p.id} id={p.id} className="card-hover flex scroll-mt-24 flex-col p-7">
              <span className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                {p.region}
              </span>
              <h3 className="mt-2 text-xl font-bold">{p.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-ink-muted">{p.blurb}</p>

              {/* Full leaflet: day-by-day itinerary, the P3–P7 bike/price table
                  and the booking terms. Opens in a new tab so the reader keeps
                  their place on the page. */}
              {leaflet && (
                <a
                  href={leaflet.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 flex items-center gap-3 rounded-xl border border-brand-100 bg-brand-50/60 px-4 py-3 transition hover:border-brand-300 hover:bg-brand-50"
                >
                  <PdfIcon className="h-6 w-6 shrink-0 text-brand-600" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-brand-800">
                      {isEn ? "Full package leaflet" : "套票詳情單張"}
                    </span>
                    <span className="block text-xs text-ink-muted">
                      {isEn
                        ? `Day-by-day itinerary, bike tiers & prices · PDF ${leaflet.mb} MB · Chinese`
                        : `逐日行程、車款級別及價目表 · PDF ${leaflet.mb} MB`}
                    </span>
                  </span>
                </a>
              )}

              <dl className="mt-5 space-y-4 border-t border-slate-100 pt-5">
                {[
                  {
                    label: isEn ? "Flight + bike (no hotel)" : "機票＋電單車（不含住宿）",
                    duration: p.tiers,
                    price: p.priceFrom,
                  },
                  {
                    label: isEn ? "Flight + hotel with breakfast + bike" : "機票＋住宿連早餐＋電單車",
                    duration: p.hotelDuration,
                    price: p.hotelFrom,
                  },
                ].map((row) => (
                  <div key={row.label}>
                    <dt className="text-sm font-semibold text-ink-soft">{row.label}</dt>
                    <dd className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <span className="text-xs text-ink-muted">{row.duration}</span>
                      <span className="text-2xl font-black text-accent-600">
                        HK${fmt(row.price)}
                        <span className="ml-1 text-sm font-medium text-ink-muted">
                          {isEn ? "from" : "起"}
                        </span>
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-xs text-ink-muted">
                {p.airline} · {isEn ? "from a P3-class bike" : "P3 級電單車起"}
              </p>

              <div className="mt-5 flex justify-end">
                <a
                  href={whatsappLink(
                    isEn
                      ? `Hi, I'd like to ask about the ${p.title} self-drive package.`
                      : `你好，我想查詢自駕套票：${p.title}`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline"
                  data-cta="package-wa"
                >
                  <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
                  {isEn ? "Ask on WhatsApp" : "WhatsApp 查詢"}
                </a>
              </div>
            </article>
            );
          })}
        </div>
      </section>

      <div className="pb-20">
        <CTABand
          locale={locale}
          dict={dict}
          primaryHref={whatsappLink(
            isEn
              ? "Hi, I'd like to ask about a self-drive package."
              : "你好，我想查詢自駕套票。",
          )}
          primaryLabel={isEn ? "Ask on WhatsApp" : "WhatsApp 查詢"}
          title={isEn ? "Book a package" : "預約自駕套票"}
          subtitle={
            isEn
              ? "Message us on WhatsApp to plan and book your self-drive package."
              : "WhatsApp 我們，即可查詢及預約自駕套票。"
          }
        />
        <p className="container-x mt-6 text-center text-xs text-ink-muted">
          {isEn
            ? `Self-drive packages are operated by ${site.travelAgent.name} · HK Travel Agent Licence No. ${site.travelAgent.licence}.`
            : `自駕套票由 ${site.travelAgent.name} 提供，旅行代理商牌照號碼：${site.travelAgent.licence}。`}
        </p>
      </div>
    </>
  );
}
