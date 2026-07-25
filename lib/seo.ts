import type { Metadata } from "next";
import { site } from "@/lib/site";

/**
 * Self-referencing canonical + hreflang alternates for a page.
 * `path` is the locale-independent path (e.g. "/rental", or "" for home).
 * Produces zh-Hant-HK / en pairs plus an x-default pointing at the default locale.
 */
export function pageAlternates(
  locale: string,
  path = "",
): NonNullable<Metadata["alternates"]> {
  const clean = path && path !== "/" ? (path.startsWith("/") ? path : `/${path}`) : "";
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
