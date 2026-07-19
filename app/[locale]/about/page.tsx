import Image from "next/image";
import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { aboutContent } from "@/lib/content/about";
import { site } from "@/lib/site";
import PageHero from "@/components/PageHero";
import CTABand from "@/components/CTABand";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const isEn = params.locale === "en";
  return {
    title: isEn ? "About Us" : "關於我們",
    description: isEn
      ? "RENTAL819 Hong Kong — the official HK & Macau agent for Rental819 Japan, part of the Helmet King group."
      : "RENTAL819 香港 — 日本 Rental819 指定港澳代理，隸屬頭盔王集團。",
  };
}

export default function AboutPage({ params }: { params: { locale: string } }) {
  const locale: Locale = isLocale(params.locale) ? params.locale : "zh-hk";
  const dict = getDictionary(locale);
  const c = aboutContent[locale];

  return (
    <>
      <PageHero eyebrow={c.hero.eyebrow} title={c.hero.title} intro={c.hero.intro} />

      {/* Stats */}
      <section className="border-b border-slate-100 bg-white">
        <div className="container-x grid grid-cols-2 gap-6 py-10 lg:grid-cols-4">
          {c.stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-black text-brand-700 sm:text-4xl">{s.value}</p>
              <p className="mt-1 text-xs text-ink-muted sm:text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Group brands */}
      <section className="container-x py-16 lg:py-20">
        <div className="grid gap-6 lg:grid-cols-3">
          {c.brands.map((b) => (
            <div key={b.name} className="card flex flex-col p-7">
              <span className="text-xs font-semibold uppercase tracking-wide text-accent-600">
                {b.year}
              </span>
              <h2 className="mt-1 text-xl font-bold">{b.name}</h2>
              <p className="mt-3 text-sm leading-6 text-ink-muted">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Roles + shop image */}
      <section className="bg-slate-50">
        <div className="container-x grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-20">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">{c.roleTitle}</h2>
            <div className="mt-8 space-y-6">
              {c.roles.map((r, i) => (
                <div key={r.title} className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-black text-white">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-ink">{r.title}</h3>
                    <p className="mt-1.5 text-sm leading-6 text-ink-muted">{r.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-card">
            <Image
              src="/images/about/shop.jpg"
              alt="Helmet King × Rental819"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Word from founder */}
      <section className="container-x py-16 lg:py-20">
        <div className="mx-auto max-w-3xl rounded-3xl bg-brand-950 p-8 text-white sm:p-12">
          <h2 className="text-xl font-bold text-accent-400">{c.wordTitle}</h2>
          <p className="mt-4 text-lg leading-8 text-brand-100">{c.word}</p>
        </div>
      </section>

      <div className="pb-20">
        <CTABand
          locale={locale}
          dict={dict}
          title={locale === "en" ? "Ride Japan with us" : "與我們一起衝出香港"}
          subtitle={
            locale === "en"
              ? "Rent a bike, join a tour, or ask us anything."
              : "租車、參團，或有任何問題，歡迎聯絡我們。"
          }
        />
      </div>
    </>
  );
}
