import { site } from "@/lib/site";

/** Organization / LocalBusiness structured data (site-wide). */
export function organizationLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "RENTAL819 HK — 頭盔王 × Rental819",
    url: site.url,
    image: `${site.url}/icon.png`,
    telephone: site.phone,
    email: site.email,
    priceRange: "$$",
    areaServed: ["HK", "MO", "JP"],
    address: {
      "@type": "PostalAddress",
      addressCountry: "HK",
      addressLocality: "Hong Kong",
    },
    sameAs: [site.social.facebook, site.social.instagram],
    parentOrganization: {
      "@type": "Organization",
      name: site.parent.name,
      url: site.parent.url,
    },
  };
}

/** FAQPage structured data from the FAQ groups. */
export function faqLd(
  groups: { items: { q: string; a: string }[] }[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: groups.flatMap((g) =>
      g.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    ),
  };
}

/** BreadcrumbList structured data. `items` are absolute or site-relative URLs. */
export function breadcrumbLd(
  items: { name: string; url: string }[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url.startsWith("http") ? it.url : `${site.url}${it.url}`,
    })),
  };
}
