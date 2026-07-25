import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { pageAlternates } from "@/lib/seo";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { homeContent } from "@/lib/content/home";
import { guidePages } from "@/lib/nav";
import { whatsappLink } from "@/lib/site";
import { Section, SectionHeader } from "@/components/Section";
import FeatureIcon from "@/components/FeatureIcon";
import CTABand from "@/components/CTABand";
import { ArrowRight, WhatsAppIcon } from "@/components/icons";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const isEn = params.locale === "en";
  return {
    alternates: pageAlternates(params.locale, ""),
    title: isEn
      ? "Japan Motorcycle Rental & Self-Drive Tours"
      : "日本電單車租賃・自駕遊團",
    description: isEn
      ? "Rent a motorcycle in Japan and ride self-drive tours, booked from Hong Kong. 99 branches, full insurance, ETC and gear included."
      : "由香港預約日本電單車租賃及自駕遊，全日本 99 間分店，包保險、ETC 及裝備。",
  };
}

export default function HomePage({ params }: { params: { locale: string } }) {
  const locale: Locale = isLocale(params.locale) ? params.locale : "zh-hk";
  const dict = getDictionary(locale);
  const c = homeContent[locale];
  const guides = guidePages(dict);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-950 text-white">
        <div className="pointer-events-none absolute inset-0">
          {/* Banner photo — riders on a Japanese country road */}
          <Image
            src="/images/tours/hokkaido-2026-07-30.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-60"
          />
          {/* Dark gradient keeps the left-aligned copy legible over the photo */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-950 via-brand-950/80 to-brand-950/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-transparent to-brand-950/40" />
          <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-accent-600/30 blur-3xl" />
        </div>
        <div className="container-x relative py-20 lg:py-28">
          <div className="max-w-3xl animate-fade-up">
            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-semibold text-brand-100">
              {c.hero.badge}
            </span>
            <h1 className="mt-6 text-4xl font-black leading-[1.1] sm:text-5xl lg:text-6xl">
              {c.hero.title}
              <span className="mt-2 block text-accent-500">{c.hero.highlight}</span>
            </h1>
            <p className="mt-5 max-w-2xl text-xl font-medium text-white/95 sm:text-2xl">
              {c.hero.tagline}
            </p>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-brand-100">
              {c.hero.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href={localePath(locale, "/booking")} className="btn-primary text-base">
                {c.hero.primaryCta}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn bg-white/10 text-white ring-1 ring-inset ring-white/20 hover:bg-white/20"
              >
                <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />
                {c.hero.secondaryCta}
              </a>
            </div>
            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-8">
              {c.hero.stats.map((s) => (
                <div key={s.label}>
                  <dt className="text-2xl font-black text-white sm:text-3xl">{s.value}</dt>
                  <dd className="mt-1 text-xs text-brand-200">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Features */}
      <Section>
        <SectionHeader
          eyebrow={c.featuresHead.eyebrow}
          title={c.featuresHead.title}
          intro={c.featuresHead.intro}
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {c.features.map((f) => (
            <div key={f.title} className="card-hover p-6">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <FeatureIcon icon={f.icon} />
              </div>
              <h3 className="mt-4 text-lg font-bold">{f.title}</h3>
              <p className="mt-2 text-sm leading-6 text-ink-muted">{f.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Offers */}
      <Section className="bg-slate-50">
        <SectionHeader
          eyebrow={c.offersHead.eyebrow}
          title={c.offersHead.title}
          intro={c.offersHead.intro}
        />
        <div className="grid gap-6 md:grid-cols-3">
          {c.offers.map((o, i) => (
            <Link
              key={o.href}
              href={localePath(locale, o.href)}
              className="group card-hover flex flex-col overflow-hidden"
            >
              <div
                className={`h-2 w-full ${
                  i === 0 ? "bg-brand-600" : i === 1 ? "bg-accent-600" : "bg-brand-400"
                }`}
              />
              <div className="flex flex-1 flex-col p-7">
                <h3 className="text-xl font-bold">{o.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-ink-muted">{o.body}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 group-hover:gap-2.5">
                  {o.cta}
                  <ArrowRight className="h-4 w-4 transition-all" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* Steps */}
      <Section>
        <SectionHeader
          eyebrow={c.stepsHead.eyebrow}
          title={c.stepsHead.title}
          intro={c.stepsHead.intro}
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {c.steps.map((s, i) => (
            <div key={s.title} className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-600 text-lg font-black text-white">
                {i + 1}
              </div>
              <h3 className="mt-4 text-base font-bold">{s.title}</h3>
              <p className="mt-2 text-sm leading-6 text-ink-muted">{s.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Regions */}
      <Section className="bg-brand-950 text-white">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-accent-400">
            {c.regionsHead.eyebrow}
          </p>
          <h2 className="text-3xl sm:text-4xl">{c.regionsHead.title}</h2>
          <p className="mt-4 text-lg text-brand-100">{c.regionsHead.intro}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {c.regions.map((r) => (
            <div
              key={r.name}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-white/25 hover:bg-white/10"
            >
              <h3 className="text-lg font-bold text-white">{r.name}</h3>
              <p className="mt-1.5 text-sm text-brand-200">{r.note}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Guide teaser */}
      <Section>
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="eyebrow mb-3">{c.guideHead.eyebrow}</p>
            <h2 className="text-3xl sm:text-4xl">{c.guideHead.title}</h2>
            <p className="mt-4 text-lg leading-8 text-ink-muted">{c.guideHead.intro}</p>
            <Link
              href={localePath(locale, "/guide")}
              className="btn-brand mt-6"
            >
              {c.guideHead.cta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {guides.slice(0, 6).map((g) => (
              <Link
                key={g.href}
                href={localePath(locale, g.href)}
                className="rounded-xl border border-slate-100 bg-white px-4 py-3 text-sm font-medium text-ink-soft shadow-sm transition hover:border-brand-200 hover:text-brand-700"
              >
                {g.label}
              </Link>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <div className="pb-24">
        <CTABand
          locale={locale}
          dict={dict}
          title={c.ctaBand.title}
          subtitle={c.ctaBand.subtitle}
        />
      </div>
    </>
  );
}
