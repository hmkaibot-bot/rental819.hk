import type { Metadata } from "next";
import { site } from "@/lib/site";

/**
 * Normalise a locale-independent path: "" and "/" collapse to "", everything
 * else gains a leading slash. Shared so canonical and og:url can never drift.
 */
function normalisePath(path: string): string {
  return path && path !== "/" ? (path.startsWith("/") ? path : `/${path}`) : "";
}

/**
 * Self-referencing canonical + hreflang alternates for a page.
 * `path` is the locale-independent path (e.g. "/rental", or "" for home).
 * Produces zh-Hant-HK / en pairs plus an x-default pointing at the default locale.
 */
export function pageAlternates(
  locale: string,
  path = "",
): NonNullable<Metadata["alternates"]> {
  const clean = normalisePath(path);
  const current = locale === "en" ? "en" : "zh-hk";
  return {
    canonical: `${site.url}/${current}${clean}`,
    languages: {
      "zh-Hant-HK": `${site.url}/zh-hk${clean}`,
      en: `${site.url}/en${clean}`,
      "x-default": `${site.url}/zh-hk${clean}`,
    },
  };
}

/**
 * Full per-page metadata: canonical + hreflang, plus its own Open Graph and
 * Twitter block. Without the OG block a page silently inherits the root
 * layout's Chinese home-page defaults — wrong title, wrong url, wrong locale
 * on every /en page.
 */
export function pageMeta(
  locale: string,
  path: string,
  title: string,
  description: string,
): Metadata {
  const clean = normalisePath(path);
  const isEn = locale === "en";
  return {
    title,
    description,
    alternates: pageAlternates(locale, path),
    openGraph: {
      type: "website",
      siteName: "RENTAL819 HK",
      title,
      description,
      url: `${site.url}/${isEn ? "en" : "zh-hk"}${clean}`,
      locale: isEn ? "en_US" : "zh_HK",
      alternateLocale: isEn ? ["zh_HK"] : ["en_US"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
