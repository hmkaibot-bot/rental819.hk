/** @type {import('next').NextConfig} */

/**
 * 301/308 redirect map: legacy WordPress URLs (indexed by Google, in the old
 * Yoast sitemap) → their new locale-prefixed paths, so search equity and
 * bookmarks survive the DNS cut-over instead of 404-ing.
 *
 * Chinese slugs are written percent-encoded, because Next.js matches the
 * redirect `source` against the encoded request pathname (a decoded literal
 * does not match). Trailing slashes are normalised by Next before matching.
 * Guided-tour / self-drive-package booking now lives on 26adventure.com, so the
 * old `st_activity` / `st_tour` detail pages fold into the new /tours index.
 */
const legacyRedirects = [
  // --- Chinese content pages → /zh-hk (percent-encoded sources) ---
  { source: "/%E9%A0%AD%E7%9B%94%E7%8E%8B-x-rental819-%E6%97%A5%E6%9C%AC%E9%9B%BB%E5%96%AE%E8%BB%8A%E5%87%BA%E7%A7%9F%E8%87%AA%E9%A7%95%E9%81%8A", destination: "/zh-hk", permanent: true },
  { source: "/%E6%97%A5%E6%9C%AC%E9%9B%BB%E5%96%AE%E8%BB%8A%E8%87%AA%E9%A7%95%E9%81%8A-2", destination: "/zh-hk/rental", permanent: true },
  { source: "/%E7%A7%9F%E8%BB%8A%E9%A0%90%E7%B4%84%E9%A0%81", destination: "/zh-hk/booking", permanent: true },
  { source: "/%E9%9B%BB%E5%96%AE%E8%BB%8A%E6%97%85%E8%A1%8C%E5%9C%98", destination: "/zh-hk/tours", permanent: true },
  { source: "/%E8%87%AA%E9%A7%95%E5%9C%98%E5%A0%B1%E5%90%8D%E9%A0%81", destination: "/zh-hk/tours", permanent: true },
  { source: "/%E8%87%AA%E9%A7%95%E5%A5%97%E7%A5%A8", destination: "/zh-hk/packages", permanent: true },
  { source: "/%E8%87%AA%E9%A7%95%E5%A5%97%E7%A5%A8%E9%A0%90%E7%B4%84%E9%A0%81", destination: "/zh-hk/packages", permanent: true },
  { source: "/%E9%97%9C%E6%96%BC%E6%88%91%E5%80%91", destination: "/zh-hk/about", permanent: true },
  { source: "/%E5%A6%82%E4%BD%95%E8%A6%8F%E5%8A%83%E8%A1%8C%E7%A8%8B", destination: "/zh-hk/guide/plan-trip", permanent: true },
  { source: "/%E8%B7%AF%E7%B7%9A%E5%A6%82%E4%BD%95%E8%A6%8F%E5%8A%83%EF%BC%9F", destination: "/zh-hk/guide/route", permanent: true },
  { source: "/%E6%89%93%E7%AE%97%E9%96%8B%E5%B9%BE%E5%A4%A9%E8%BB%8A%EF%BC%9F", destination: "/zh-hk/guide/how-many-days", permanent: true },
  { source: "/%E9%A0%90%E7%AE%97%E6%80%8E%E6%A8%A3%E8%A8%88%EF%BC%9F", destination: "/zh-hk/guide/budget", permanent: true },
  { source: "/%E6%97%A5%E6%9C%AC%E9%9B%BB%E5%96%AE%E8%BB%8A%E8%87%AA%E9%A7%95%E7%A7%9F%E9%87%91%E5%8F%8A%E8%B2%BB%E7%94%A8", destination: "/zh-hk/guide/fees", permanent: true },
  { source: "/%E6%97%A5%E6%9C%AC%E9%9B%BB%E5%96%AE%E8%BB%8A%E8%87%AA%E9%A7%95%E4%BF%9D%E9%9A%AA", destination: "/zh-hk/guide/insurance", permanent: true },
  { source: "/%E6%97%A5%E6%9C%AC%E9%9B%BB%E5%96%AE%E8%BB%8A%E8%87%AA%E9%A7%95%E9%A0%90%E7%B4%84%E5%8F%8A%E5%8F%96%E8%BB%8A%E6%B5%81%E7%A8%8B", destination: "/zh-hk/guide/pickup", permanent: true },
  { source: "/%E6%97%A5%E6%9C%AC%E4%BA%A4%E9%80%9A%E8%A6%8F%E5%89%87", destination: "/zh-hk/guide/traffic-rules", permanent: true },

  // --- English content pages → /en ---
  { source: "/helmet-king-x-rental819-japan-motorcycle-rental-self-driving-tour", destination: "/en", permanent: true },
  { source: "/motorcycle-rental", destination: "/en/rental", permanent: true },
  { source: "/request-for-a-car-rental-reservation", destination: "/en/booking", permanent: true },
  { source: "/self-driving-group", destination: "/en/tours", permanent: true },
  { source: "/apply-for-a-self-driving-tour-reservation", destination: "/en/tours", permanent: true },
  { source: "/about-us", destination: "/en/about", permanent: true },
  { source: "/how-to-plan-your-trip", destination: "/en/guide/plan-trip", permanent: true },
  { source: "/how-is-the-route-planned", destination: "/en/guide/route", permanent: true },
  { source: "/planning-to-drive-for-a-few-days", destination: "/en/guide/how-many-days", permanent: true },
  { source: "/how-is-the-budget-calculated", destination: "/en/guide/budget", permanent: true },
  { source: "/rent-and-fees", destination: "/en/guide/fees", permanent: true },
  { source: "/insurance", destination: "/en/guide/insurance", permanent: true },
  { source: "/reservation-and-pick-up-process", destination: "/en/guide/pickup", permanent: true },
  { source: "/etc", destination: "/en/guide/etc", permanent: true },

  // --- Locale-neutral slugs → default locale ---
  { source: "/faq", destination: "/zh-hk/faq", permanent: true },
  { source: "/contact", destination: "/zh-hk/contact", permanent: true },
  { source: "/privacy-policy", destination: "/zh-hk/privacy", permanent: true },

  // --- Legacy tour / package detail pages (booking now on 26adventure) ---
  { source: "/st_activity/:slug*", destination: "/zh-hk/tours", permanent: true },
  { source: "/st_tour/:slug*", destination: "/zh-hk/tours", permanent: true },

  // --- Apex → default locale ---
  // app/page.tsx also redirects, but doing it here means the edge answers with a
  // real 308 + Location before any RSC render is involved.
  { source: "/", destination: "/zh-hk", permanent: true },
];

const nextConfig = {
  reactStrictMode: true,
  images: {
    // Existing brand assets still live on the WordPress origin during migration.
    remotePatterns: [
      { protocol: "https", hostname: "rental819.hk" },
      { protocol: "https", hostname: "rental819.com" },
    ],
  },
  async redirects() {
    return legacyRedirects;
  },
  async headers() {
    return [
      {
        // Keep every Vercel preview host out of the search index so none of them
        // competes with the production site for duplicate content. `has.value`
        // is compiled to an anchored regex, so a literal hostname would miss the
        // per-branch and per-commit preview URLs. Production rental819.hk is
        // never matched.
        source: "/:path*",
        has: [{ type: "host", value: ".*\\.vercel\\.app" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
