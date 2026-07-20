import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { site } from "@/lib/site";
import { guideDocs } from "@/lib/content/guide";

const staticPaths = [
  "",
  "/rental",
  "/tours",
  "/packages",
  "/guide",
  "/about",
  "/faq",
  "/contact",
  "/booking",
  "/privacy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${site.url}/${locale}${path}`,
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.7,
      });
    }
    for (const doc of guideDocs[locale]) {
      entries.push({
        url: `${site.url}/${locale}/guide/${doc.slug}`,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
