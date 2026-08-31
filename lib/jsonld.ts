import { site } from "@/lib/site";
import { htmlLang, type Locale } from "@/lib/i18n";
import { aboutContent } from "@/lib/content/about";
import type { GuideDoc } from "@/lib/content/blocks";
import type { Package } from "@/lib/content/tours";
import type { RoadRegion } from "@/lib/content/roads";

/** Stable node ids so every page's graph points at one organization / one site. */
export const ORG_ID = `${site.url}/#organization`;
export const WEBSITE_ID = `${site.url}/#website`;

/**
 * Languages the Hong Kong team actually answers in — Traditional Chinese in
 * writing, Cantonese / Mandarin / English on the phone. Stated on /contact.
 */
const LANGUAGES = ["zh-Hant", "yue", "cmn", "en"] as const;

/** E.164 form of the WhatsApp / hotline number, for structured data only. */
const TEL = `+${site.phoneRaw}`;

/**
 * Organization structured data (site-wide).
 *
 * Deliberately *not* LocalBusiness: no street address is published anywhere on
 * the site, so the extra LocalBusiness properties would be unsubstantiated.
 * The corporate shape follows lib/content/about.ts — 頭盔王 (est. 2014) is the
 * parent group; Rental819 Japan is the principal we represent as the 指定香港
 * 及澳門區代理 since 2017, i.e. a brand we carry and a network we belong to,
 * not a parent company.
 */
export function organizationLd(locale: Locale): Record<string, unknown> {
  const isEn = locale === "en";
  const about = aboutContent[locale];
  const group = site.sisters[0]; // Helmet King 頭盔王

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: isEn ? "RENTAL819 Hong Kong" : "RENTAL819 香港",
    alternateName: isEn ? "RENTAL819 香港" : "RENTAL819 Hong Kong",
    description: about.hero.intro,
    url: site.url,
    foundingDate: "2017",
    logo: {
      "@type": "ImageObject",
      url: `${site.url}/logo-lg.png`,
      width: 768,
      height: 488,
    },
    image: [`${site.url}/images/about/shop.jpg`, `${site.url}/opengraph-image`],
    telephone: TEL,
    email: site.email,
    hasMap: site.maps,
    address: {
      "@type": "PostalAddress",
      addressCountry: "HK",
      addressLocality: "Hong Kong",
    },
    areaServed: [
      { "@type": "Country", name: "Hong Kong" },
      { "@type": "Country", name: "Macau" },
    ],
    serviceArea: { "@type": "Country", name: "Japan" },
    knowsLanguage: [...LANGUAGES],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: TEL,
      email: site.email,
      availableLanguage: [...LANGUAGES],
      url: site.whatsapp,
    },
    // The Japanese principal: a brand we carry and a network we belong to.
    brand: {
      "@type": "Organization",
      name: site.parent.name,
      url: site.parent.url,
    },
    memberOf: {
      "@type": "Organization",
      name: site.parent.name,
      url: site.parent.url,
    },
    parentOrganization: {
      "@type": "Organization",
      name: group.name,
      url: group.url,
      foundingDate: "2014",
    },
    // sameAs asserts *identity*, so it may only list this organization's own
    // profiles. rental819.com, 26adventure.com and the sister-brand sites all
    // belong to other legal entities — they are modelled above as brand /
    // memberOf / parentOrganization instead.
    sameAs: [site.social.facebook, site.social.instagram],
  };
}

/** WebSite structured data (site-wide). No SearchAction — there is no search route. */
export function websiteLd(locale: Locale): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: `${site.url}/`,
    name: locale === "en" ? "RENTAL819 Hong Kong" : "RENTAL819 香港",
    inLanguage: htmlLang[locale],
    publisher: { "@id": ORG_ID },
  };
}

/** FAQPage structured data from the FAQ groups. */
export function faqLd(
  groups: { items: { q: string; a: string }[] }[],
  locale: Locale,
): Record<string, unknown> {
  const url = `${site.url}/${locale}/faq`;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    url,
    // Must match the visible h1 on /faq.
    name: locale === "en" ? "Frequently asked questions" : "常見問題",
    inLanguage: htmlLang[locale],
    isPartOf: { "@id": WEBSITE_ID },
    publisher: { "@id": ORG_ID },
    mainEntity: groups.flatMap((g) =>
      g.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    ),
  };
}

/**
 * BreadcrumbList structured data. `items` are absolute or site-relative URLs.
 * The @id is derived from the last crumb so the zh-hk and en breadcrumbs for
 * the same page stay distinct nodes.
 */
export function breadcrumbLd(
  items: { name: string; url: string }[],
): Record<string, unknown> {
  const absolute = (url: string) =>
    url.startsWith("http") ? url : `${site.url}${url}`;
  const last = items[items.length - 1];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${last ? absolute(last.url) : site.url}#breadcrumb`,
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absolute(it.url),
    })),
  };
}

/**
 * Article structured data for a long-form /guide doc.
 * `dateModified` is emitted only when the doc carries one — never invented,
 * and there is no attested publication date for any of these pages.
 */
export function articleLd(doc: GuideDoc, locale: Locale): Record<string, unknown> {
  const url = `${site.url}/${locale}/guide/${doc.slug}`;
  const updated = (doc as GuideDoc & { updated?: string }).updated;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    mainEntityOfPage: url,
    isPartOf: { "@id": WEBSITE_ID },
    headline: doc.title,
    ...(doc.intro ? { description: doc.intro } : {}),
    inLanguage: htmlLang[locale],
    // The PageHero image rendered on every /guide/[slug] route.
    image: `${site.url}/images/tours/kansai-sakura-2026-04-08.jpg`,
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    ...(updated ? { dateModified: updated } : {}),
  };
}

/**
 * Service structured data for /rental. The offer catalog mirrors the bike
 * categories actually rendered on the page, so each locale describes its own
 * cards. No price is shown on /rental, so none is emitted.
 */
export function serviceLd(
  locale: Locale,
  c: { name: string; description: string; categories: { title: string }[] },
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${site.url}/${locale}/rental#service`,
    name: c.name,
    description: c.description,
    serviceType: "Motorcycle rental",
    provider: { "@id": ORG_ID },
    areaServed: { "@type": "Country", name: "Japan" },
    // Service has no inLanguage — the languages we serve riders in go here.
    availableLanguage: [...LANGUAGES],
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: `${site.url}/${locale}/booking`,
      servicePhone: { "@type": "ContactPoint", telephone: TEL },
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: c.name,
      itemListElement: c.categories.map((cat) => ({
        "@type": "Service",
        name: cat.title,
        serviceType: "Motorcycle rental",
        provider: { "@id": ORG_ID },
      })),
    },
  };
}

/**
 * How many purchasable variants a package card actually offers: the duration
 * tiers printed on it ("3日 / 4日 / 5日" -> 3). Derived from the very string the
 * card renders, so the count can never drift from what a visitor is shown.
 */
function tierCount(tiers: string): number {
  return tiers.split("/").filter((t) => t.trim()).length;
}

/**
 * Product list for /packages. Prices are the HK$ "from" figures printed on the
 * cards. The seller is the licensed travel agent named in the disclosure line
 * on the same page — not this organization, which only arranges the bikes.
 *
 * Search Console flags `highPrice`, `aggregateRating` and `review` as missing
 * recommended fields here. Three deliberate positions, so nobody "fixes" them
 * by inventing data:
 *
 *  - `highPrice` is emitted only from `priceTo`, i.e. only once a top-tier
 *    price is actually published on the card. Deriving one from `priceFrom`
 *    would put a number in the search result that appears nowhere on the page.
 *  - `aggregateRating` and `review` are NOT emitted. The site displays no
 *    customer reviews at all, and Google's structured-data policy requires
 *    review markup to reflect genuine reviews visible on that page; marking up
 *    ratings that do not exist risks a manual action against the whole site.
 *    The fix is to publish real reviews first, then mark them up.
 */
export function packagesLd(
  locale: Locale,
  list: Package[],
): Record<string, unknown> {
  const url = `${site.url}/${locale}/packages`;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${url}#packages`,
    itemListOrder: "https://schema.org/ItemListUnordered",
    numberOfItems: list.length,
    itemListElement: list.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        "@id": `${url}#${p.id}`,
        name: p.title,
        description: p.blurb,
        brand: { "@id": ORG_ID },
        offers: {
          "@type": "AggregateOffer",
          lowPrice: p.priceFrom,
          ...(p.priceTo ? { highPrice: p.priceTo } : {}),
          offerCount: tierCount(p.tiers),
          priceCurrency: "HKD",
          url,
          seller: {
            "@type": "Organization",
            name: site.travelAgent.name,
          },
        },
      },
    })),
  };
}

/**
 * ItemList of the named roads on /roads, flattened across regions.
 * No geo — lib/content/roads.ts carries no coordinates.
 */
export function roadsLd(
  locale: Locale,
  regions: RoadRegion[],
): Record<string, unknown> {
  const roads = regions.flatMap((r) => r.roads);
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${site.url}/${locale}/roads#roads`,
    itemListOrder: "https://schema.org/ItemListUnordered",
    numberOfItems: roads.length,
    itemListElement: roads.map((road, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "TouristAttraction",
        name: road.name,
        description: road.blurb,
        address: {
          "@type": "PostalAddress",
          addressRegion: road.pref,
          addressCountry: "JP",
        },
      },
    })),
  };
}
