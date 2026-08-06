import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { site } from "@/lib/site";
import { guideDocs } from "@/lib/content/guide";

/** Last content sweep over the static pages. Bump when copy actually changes. */
const SITE_UPDATED = new Date("2026-08-06");

/** Fallback for guide docs with no explicit `updated`. */
const GUIDE_UPDATED = "2026-08-06";

const staticPaths = [
  "",
  "/rental",
  "/tours",
  "/packages",
  "/roads",
  "/guide",
  "/about",
  "/faq",
  "/contact",
  "/booking",
  "/privacy",
];

type Entry = MetadataRoute.Sitemap[number];
type Tier = { priority: number; changeFrequency: Entry["changeFrequency"] };

/**
 * Crawl-budget tiering: the booking funnel first, the inspiration pages next,
 * boilerplate last. A flat priority tells Googlebot nothing.
 */
const tiers: Record<string, Tier> = {
  "": { priority: 1, changeFrequency: "weekly" },
  "/rental": { priority: 0.9, changeFrequency: "monthly" },
  "/booking": { priority: 0.9, changeFrequency: "monthly" },
  "/tours": { priority: 0.8, changeFrequency: "weekly" },
  "/packages": { priority: 0.8, changeFrequency: "weekly" },
  "/roads": { priority: 0.8, changeFrequency: "weekly" },
  "/guide": { priority: 0.8, changeFrequency: "monthly" },
  "/about": { priority: 0.6, changeFrequency: "monthly" },
  "/faq": { priority: 0.6, changeFrequency: "monthly" },
  "/contact": { priority: 0.6, changeFrequency: "monthly" },
  "/privacy": { priority: 0.3, changeFrequency: "yearly" },
};

/**
 * The same zh-Hant-HK / en pair lib/seo.ts puts in <head>, repeated per entry so
 * the sitemap corroborates it (Next renders the xhtml:link namespace itself).
 */
function languages(path: string): Record<string, string> {
  return {
    "zh-Hant-HK": `${site.url}/zh-hk${path}`,
    en: `${site.url}/en${path}`,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of staticPaths) {
      const tier = tiers[path];
      entries.push({
        url: `${site.url}/${locale}${path}`,
        lastModified: SITE_UPDATED,
        changeFrequency: tier.changeFrequency,
        priority: tier.priority,
        alternates: { languages: languages(path) },
      });
    }
    for (const doc of guideDocs[locale]) {
      entries.push({
        url: `${site.url}/${locale}/guide/${doc.slug}`,
        // `updated` is optional on GuideDoc — read it defensively.
        lastModified: new Date(
          (doc as { updated?: string }).updated ?? GUIDE_UPDATED,
        ),
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: { languages: languages(`/guide/${doc.slug}`) },
      });
    }
  }

  return entries;
}
