# Rental819.hk — 日本電單車自駕遊

Rebuilt marketing & booking site for **Rental819 Hong Kong** — Japan motorcycle
self-drive rentals and guided tours for Hong Kong riders (a Helmet King × Rental819
partnership).

Replaces the previous WordPress (Traveler theme + Elementor + WPML) build with a
fast, statically-rendered **Next.js 14** app.

- **Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS
- **i18n:** bilingual 繁體中文 (default) / English via a `[locale]` route segment
- **Deploy target:** Vercel / Cloudflare Pages (static-friendly)

---

## Getting started

```bash
npm install
npm run dev     # http://localhost:3000  → redirects to /zh-hk
```

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Local dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Next.js lint |

---

## Project structure

```
app/
  [locale]/            繁中 (zh-hk) / English (en) route tree
    page.tsx           Home
    rental/            租車 — Japan self-drive rental
    tours/             電單車旅行團 — guided self-drive tours
    packages/          自駕套票 — packages
    guide/             資訊庫 — traffic rules, insurance, fees, ETC, pickup…
    faq/  about/  contact/  booking/  privacy/
  api/booking/         booking-request form endpoint
components/            Header, Footer, LocaleSwitcher, UI building blocks
lib/
  i18n.ts              locale config + helpers
  dictionaries/        UI string dictionaries (zh-hk, en)
  content/             page content (bilingual)
public/                logo, icons, images
```

## Internationalisation

Locales live under `lib/i18n.ts`. The default locale is `zh-hk`; `/` redirects to
`/zh-hk`. Each page reads its locale from the route param and pulls copy from the
matching dictionary / content module, so adding a new page means adding one entry in
each language — never editing two parallel page trees (the WPML pain point this
rebuild removes).
