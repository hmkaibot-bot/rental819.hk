import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMeta } from "@/lib/seo";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { guideDocs } from "@/lib/content/guide";
import { waEnquiry } from "@/lib/site";
import { articleLd, breadcrumbLd } from "@/lib/jsonld";
import PageHero from "@/components/PageHero";
import Breadcrumb from "@/components/Breadcrumb";
import GuideArticle from "@/components/GuideArticle";
import CTABand from "@/components/CTABand";
import JsonLd from "@/components/JsonLd";
import { ArrowRight, WhatsAppIcon } from "@/components/icons";

export function generateStaticParams() {
  return guideDocs["zh-hk"].map((d) => ({ slug: d.slug }));
}

export const dynamicParams = false;

export function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Metadata {
  const locale: Locale = isLocale(params.locale) ? params.locale : "zh-hk";
  const doc = guideDocs[locale].find((d) => d.slug === params.slug);
  // Unknown slug: the route 404s, so say so instead of silently inheriting the
  // home page's title with no canonical of its own.
  if (!doc)
    return {
      title: params.locale === "en" ? "Page not found" : "頁面不存在",
      robots: { index: false, follow: false },
    };
  // The h1 stays doc.title; the search-result title and snippet come from the
  // doc's own SEO fields, falling back to the visible copy when it has none.
  return pageMeta(
    params.locale,
    `/guide/${params.slug}`,
    doc.seoTitle ?? doc.title,
    doc.seoDescription ?? doc.intro ?? "",
  );
}

export default function GuideDocPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const locale: Locale = isLocale(params.locale) ? params.locale : "zh-hk";
  const dict = getDictionary(locale);
  const docs = guideDocs[locale];
  const index = docs.findIndex((d) => d.slug === params.slug);
  if (index === -1) notFound();
  const doc = docs[index];
  const prev = index > 0 ? docs[index - 1] : null;
  const next = index < docs.length - 1 ? docs[index + 1] : null;
  const isEn = locale === "en";
  const waHref = waEnquiry(locale, "rental", doc.title);
  const nextSteps = [
    { href: "/rental", label: isEn ? "Renting a motorcycle in Japan" : "日本租電單車詳情" },
    { href: "/guide/licence", label: dict.guideMenu.licence },
    { href: "/guide/fees", label: dict.guideMenu.fees },
    { href: "/faq", label: dict.nav.faq },
  ].filter((s) => s.href !== `/guide/${doc.slug}`);

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: dict.nav.home, url: localePath(locale, "/") },
          { name: dict.nav.guide, url: localePath(locale, "/guide") },
          { name: doc.title, url: localePath(locale, `/guide/${doc.slug}`) },
        ])}
      />
      <JsonLd data={articleLd(doc, locale)} />
      <PageHero image="/images/tours/kansai-sakura-2026-04-08.jpg" eyebrow={dict.nav.guide} title={doc.title} intro={doc.intro}>
        <Breadcrumb
          locale={locale}
          items={[
            { label: dict.nav.home, href: "/" },
            { label: dict.nav.guide, href: "/guide" },
            { label: doc.title },
          ]}
        />
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={localePath(locale, "/booking")} className="btn-primary" data-cta="guide-hero-book">
            {dict.common.bookNow}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn bg-white/10 text-white ring-1 ring-inset ring-white/20 hover:bg-white/20"
            data-cta="guide-hero-wa"
          >
            <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />
            {dict.common.whatsapp}
          </a>
        </div>
      </PageHero>

      <section className="container-x py-14 lg:py-16">
        {doc.updated && (
          <p className="mb-6 text-sm text-ink-muted">
            {isEn ? "Last updated " : "最後更新："}
            {/* A date-only string parses as UTC midnight, so format it in UTC too. */}
            <time dateTime={doc.updated}>
              {new Intl.DateTimeFormat(isEn ? "en-GB" : "zh-HK", {
                dateStyle: "long",
                timeZone: "UTC",
              }).format(new Date(doc.updated))}
            </time>
            {isEn ? " · RENTAL819 Hong Kong team" : "・RENTAL819 香港團隊"}
          </p>
        )}
        <GuideArticle blocks={doc.blocks} locale={locale} waHref={waHref} />

        <div className="mt-12 max-w-3xl rounded-2xl border border-slate-100 bg-slate-50 p-6">
          <h2 className="text-lg font-bold">{isEn ? "Next steps" : "下一步"}</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {nextSteps.map((s) => (
              <li key={s.href}>
                <Link
                  href={localePath(locale, s.href)}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800"
                  data-cta="guide-next-step"
                >
                  {s.label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Prev / next */}
        <nav className="mt-14 grid gap-4 border-t border-slate-100 pt-8 sm:grid-cols-2">
          {prev ? (
            <Link
              href={localePath(locale, `/guide/${prev.slug}`)}
              className="card-hover flex flex-col p-5"
            >
              <span className="text-xs text-ink-muted">{isEn ? "Previous" : "上一篇"}</span>
              <span className="mt-1 font-semibold text-brand-700">{prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              href={localePath(locale, `/guide/${next.slug}`)}
              className="card-hover flex flex-col p-5 text-right sm:items-end"
            >
              <span className="text-xs text-ink-muted">{isEn ? "Next" : "下一篇"}</span>
              <span className="mt-1 inline-flex items-center gap-1.5 font-semibold text-brand-700">
                {next.title}
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          )}
        </nav>
      </section>

      <div className="pb-20">
        <CTABand
          locale={locale}
          dict={dict}
          title={isEn ? "Ready to plan your ride?" : "準備好規劃你的行程？"}
          subtitle={
            isEn
              ? "Book a rental or message our Hong Kong team for tailored advice."
              : "立即預約租車，或聯絡香港團隊獲取個人化建議。"
          }
          waMessageHref={waHref}
        />
      </div>
    </>
  );
}
