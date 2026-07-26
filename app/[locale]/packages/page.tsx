import type { Metadata } from "next";
import { pageAlternates } from "@/lib/seo";
import { isLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { packages } from "@/lib/content/tours";
import { site } from "@/lib/site";
import PageHero from "@/components/PageHero";
import CTABand from "@/components/CTABand";
import { CheckIcon, ArrowRight } from "@/components/icons";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const isEn = params.locale === "en";
  return {
    alternates: pageAlternates(params.locale, "/packages"),
    title: isEn ? "Self-Drive Packages" : "自駕套票",
    description: isEn
      ? "Motorcycle rental + accommodation bundles for popular Japan routes, in 3/4/5-day tiers."
      : "熱門日本路線的租車＋住宿自駕套票，設 3／4／5 日選擇。",
  };
}

export default function PackagesPage({ params }: { params: { locale: string } }) {
  const locale: Locale = isLocale(params.locale) ? params.locale : "zh-hk";
  const dict = getDictionary(locale);
  const isEn = locale === "en";
  const list = packages[locale];

  const includes = isEn
    ? ["Motorcycle rental", "Accommodation", "Suggested route & itinerary", "Insurance & ETC guidance", "Hong Kong team support"]
    : ["電單車租金", "住宿安排", "建議路線及行程", "保險及 ETC 指引", "香港團隊支援"];

  return (
    <>
      <PageHero
        image="/images/tours/kyushu-aso-2026-04-30.jpg"
        eyebrow={dict.nav.packages}
        title={isEn ? "Self-drive packages" : "電單車自駕套票"}
        intro={
          isEn
            ? "Bike and accommodation bundled for popular routes — the easy-value way to go independent, at your own pace."
            : "熱門路線的租車＋住宿套票，最抵、最方便的自由行組合，行程自己話事。"
        }
      />

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
        </div>
      </section>

      {/* Package cards */}
      <section className="container-x pb-16">
        <div className="grid gap-6 md:grid-cols-2">
          {list.map((p) => (
            <article key={p.id} className="card-hover flex flex-col p-7">
              <span className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                {p.region}
              </span>
              <h3 className="mt-2 text-xl font-bold">{p.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-ink-muted">{p.blurb}</p>
              <div className="mt-5 flex items-end justify-between border-t border-slate-100 pt-5">
                <div>
                  <p className="text-xs text-ink-muted">{p.tiers}</p>
                  <p className="text-2xl font-black text-accent-600">
                    HK${p.priceFrom.toLocaleString("en-US")}
                    <span className="ml-1 text-sm font-medium text-ink-muted">
                      {isEn ? "from" : "起"}
                    </span>
                  </p>
                </div>
                <a
                  href={site.adventureUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline"
                >
                  {isEn ? "Book on 26 Adventure" : "到 26 Adventure 報名"}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="pb-20">
        <CTABand
          locale={locale}
          dict={dict}
          primaryHref={site.adventureUrl}
          primaryLabel={isEn ? "Book on 26 Adventure" : "到 26 Adventure 報名"}
          title={isEn ? "Book a package" : "預約自駕套票"}
          subtitle={
            isEn
              ? "Self-drive packages are booked on 26adventure.com."
              : "自駕套票現於 26adventure.com 報名預約。"
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
