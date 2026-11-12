import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import type { CatalogueData } from "@/lib/catalogue/query";
import { makerLabel, typeLabel } from "@/lib/catalogue/labels";
import { shopAreaLabel, shopLabel } from "@/lib/reservations/shop-labels";
import type { RentalContent } from "@/lib/content/rental";

const field =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20";

export default function BikeCatalogue({
  locale,
  copy,
  data,
}: {
  locale: Locale;
  copy: RentalContent["catalogue"];
  data: CatalogueData;
}) {
  const isEn = locale === "en";
  const action = localePath(locale, "/rental");
  const days = data.pickup && data.returnDate ? copy.days.replace("{n}", String(dayCount(data.pickup, data.returnDate))) : "";

  return (
    <div id="catalogue" className="scroll-mt-24">
      <div className="mb-8 max-w-3xl">
        <h2 className="text-2xl font-bold sm:text-3xl">{copy.head}</h2>
        <p className="mt-3 text-ink-muted">{copy.intro}</p>
      </div>

      {!data.synced ? (
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 text-sm leading-6 text-ink-soft">
          <p>{copy.noShops}</p>
          <Link href={localePath(locale, "/booking")} className="btn-brand mt-4">
            {copy.book}
          </Link>
        </div>
      ) : (
        <>
          <form method="get" action={action} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-card sm:p-5">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
              <label className="block text-sm font-medium text-ink-soft lg:col-span-2">
                {copy.shop}
                <select name="shop" defaultValue={data.selected ? String(data.selected.storeId) : ""} className={field}>
                  {!data.selected && <option value="">{copy.any}</option>}
                  {groupOptions(data, locale)}
                </select>
              </label>
              <label className="block text-sm font-medium text-ink-soft">
                {copy.pickup}
                <input type="date" name="pickup" defaultValue={data.pickup} className={field} />
              </label>
              <label className="block text-sm font-medium text-ink-soft">
                {copy.return}
                <input type="date" name="return" defaultValue={data.returnDate} className={field} />
              </label>
              <label className="block text-sm font-medium text-ink-soft">
                {copy.type}
                <select name="type" defaultValue={data.type} className={field}>
                  <option value="">{copy.any}</option>
                  {data.types.map((type) => (
                    <option key={type} value={type}>
                      {typeLabel(type, locale)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-medium text-ink-soft">
                {copy.maker}
                <select name="maker" defaultValue={data.maker} className={field}>
                  <option value="">{copy.any}</option>
                  {data.makers.map((maker) => (
                    <option key={maker} value={maker}>
                      {makerLabel(maker, locale)}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button type="submit" className="btn-brand">
                {copy.search}
              </button>
              <Link href={action} className="text-sm font-semibold text-brand-700 hover:text-brand-800">
                {copy.clear}
              </Link>
              {data.selected && (
                <span className="text-sm text-ink-muted">
                  {copy.results.replace("{n}", String(data.matched))}
                </span>
              )}
            </div>
            {data.dateError === "order" && <p className="mt-3 text-sm text-accent-700">{copy.dateOrder}</p>}
            {data.dateError === "past" && <p className="mt-3 text-sm text-accent-700">{copy.datePast}</p>}
            {data.areaEmpty && <p className="mt-3 text-sm text-ink-muted">{copy.areaEmpty}</p>}
          </form>

          {data.selected && data.cards.length === 0 ? (
            <p className="mt-8 text-sm text-ink-muted">{data.listed === 0 ? copy.noBikes : copy.emptyFilter}</p>
          ) : (
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {data.cards.map((card) => (
                <li key={card.key} className="card flex flex-col overflow-hidden">
                  <div className="relative aspect-[4/3] bg-slate-100">
                    {card.photo?.startsWith("https://cdn.rental819.com/") ? (
                      <Image
                        src={card.photo}
                        alt={card.title}
                        fill
                        sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-ink-muted">{copy.noPhoto}</div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-bold leading-snug">{card.title}</h3>
                      {card.bikeClass && (
                        <span className="shrink-0 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-700">
                          {card.bikeClass}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-ink-muted">
                      {[card.typeLabel, card.ccLabel, card.year].filter(Boolean).join(" · ")}
                    </p>
                    {card.colours.length > 0 && (
                      <p className="mt-1 text-sm text-ink-muted">
                        {copy.colours}: {card.colours.join(isEn ? ", " : "、")}
                      </p>
                    )}
                    {card.equipment && card.equipment.lines.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {card.equipment.lines.map((line) => (
                          <div key={line.key}>
                            {card.equipment?.varies && line.colour && (
                              <p className="text-xs font-semibold text-ink-muted">{line.colour}</p>
                            )}
                            {line.free.length > 0 && (
                              <EquipList title={copy.freeEquip} items={line.free} />
                            )}
                            {line.paid.length > 0 && (
                              <EquipList title={copy.paidEquip} items={line.paid} />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    {card.priceLabel && (
                      <p className="mt-3 text-sm font-semibold text-ink">
                        {copy.reference} {card.priceLabel}
                        {days ? `（${days}）` : ` ${copy.perDay}`}
                        <span className="mt-0.5 block text-xs font-normal text-ink-muted">{copy.quoteNote}</span>
                      </p>
                    )}
                    <p
                      className={`mt-3 text-sm font-semibold ${
                        card.availability === "yes"
                          ? "text-emerald-700"
                          : card.availability === "no"
                            ? "text-accent-700"
                            : "text-ink-muted"
                      }`}
                    >
                      {card.availability === "yes"
                        ? copy.available
                        : card.availability === "no"
                          ? copy.unavailable
                          : copy.pickDates}
                    </p>
                    <Link href={card.bookHref} className="btn-primary mt-4" data-cta="catalogue-book">
                      {copy.book}
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {data.selected && data.cards.length > 0 && (
            <p className="mt-6 max-w-3xl text-sm leading-6 text-ink-muted">{copy.footnote}</p>
          )}
        </>
      )}
    </div>
  );
}

function EquipList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-1.5">
      <p className="text-xs font-semibold text-ink-soft">{title}</p>
      <ul className="mt-1 space-y-1">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-md border border-brand-300 px-2 py-1 text-center text-xs font-medium text-brand-800"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function groupOptions(data: CatalogueData, locale: Locale) {
  const groups = new Map<string, { label: string; shops: CatalogueData["shops"] }>();
  for (const shop of data.shops) {
    const key = shop.areaJa;
    const existing = groups.get(key);
    const label = locale === "en" ? shop.areaEn || shopAreaLabel(shop.areaJa, locale) : shop.areaJa;
    if (existing) existing.shops.push(shop);
    else groups.set(key, { label, shops: [shop] });
  }
  return [...groups.entries()].map(([key, group]) => (
    <optgroup key={key} label={group.label}>
      {group.shops.map((shop) => (
        <option key={shop.storeId} value={String(shop.storeId)}>
          {locale === "en" ? shop.nameEn || shopLabel(shop.nameJa, locale) : shop.nameJa}
        </option>
      ))}
    </optgroup>
  ));
}

function dayCount(start: string, end: string): number {
  const [ys, ms, ds] = start.split("-").map(Number);
  const [ye, me, de] = end.split("-").map(Number);
  return Math.max(1, Math.round((Date.UTC(ye, me - 1, de) - Date.UTC(ys, ms - 1, ds)) / 86400000));
}
