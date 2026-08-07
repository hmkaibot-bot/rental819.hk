import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMeta } from "@/lib/seo";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { guideDocs } from "@/lib/content/guide";
import { articleLd, breadcrumbLd } from "@/lib/jsonld";
import PageHero from "@/components/PageHero";
import Breadcrumb from "@/components/Breadcrumb";
import GuideArticle from "@/components/GuideArticle";
import CTABand from "@/components/CTABand";
import JsonLd from "@/components/JsonLd";
import { ArrowRight } from "@/components/icons";

export function generateStaticParams() {
  return guideDocs["zh-hk"].map((d) => ({ slug: d.slug }));
}

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
      </PageHero>

      <section className="container-x py-14 lg:py-16">
        <GuideArticle blocks={doc.blocks} />

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
        />
      </div>
    </>
  );
}
