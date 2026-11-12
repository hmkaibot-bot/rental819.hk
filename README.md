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
| `npm run sync-catalogue` | Pull shops, bikes and availability into Supabase |

---

## Bike catalogue sync

`/zh-hk/rental` and `/en/rental` read the `catalogue_*` tables (migrations
`supabase/migrations/0012_catalogue.sql` and `0013_catalogue_equipment.sql`).
Each unit's free and paid equipment is scraped from the bike page bitmask
(`data-default-option` / `data-custom-option`). NULL means that unit has not
been scraped since the column was added; the booking form then leaves every
add-on selectable. A daily GitHub Action
(`.github/workflows/sync-catalogue.yml`, 02:00 Hong Kong time) refreshes every
branch. It is a few thousand polite requests, so it does not run as a Vercel
cron. The booking form's branch list is loaded from `catalogue_shops` and
falls back to the static list in `lib/reservations/types.ts` when the table
is empty.

Manual run for one shop (Itami is store `110`):

```bash
NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
  npm run sync-catalogue -- --store 110
```

Omit `--store` to sync every shop. `--dump /tmp/out` writes JSON and skips the
database when the service-role key is not set. Optional
`CATALOGUE_SYNC_INTERVAL_MS` (default `650`) is the gap between upstream requests.

GitHub repository secrets (Actions) and Vercel env:

| Name | Where | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Vercel + GitHub | Supabase project URL (`rental819-hk`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Vercel | Public catalogue reads. If unset, the site falls back to the service role on the server |
| `SUPABASE_SERVICE_ROLE_KEY` | Vercel + GitHub | Admin writes and the sync. Never expose this in the browser |

Apply `0012_catalogue.sql` before the first sync. The Action will no-op until
those two secrets exist. A nationwide run can take a few hours of GitHub-hosted
runner time.

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
