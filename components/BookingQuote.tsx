import type { Locale } from "@/lib/i18n";
import { DEC2026_PROMO, type QuoteAddonKey, type RentalQuote } from "@/lib/promo/dec2026";

const ADDON_LABEL: Record<Locale, Record<QuoteAddonKey, string>> = {
  "zh-hk": {
    helmet: "頭盔",
    topcase: "尾箱",
    sidebag: "側袋",
    pannier: "側箱",
    mamoride: "MamoRide",
    cardo: "CARDO 對講機",
  },
  en: {
    helmet: "Helmets",
    topcase: "Tail box",
    sidebag: "Side bag",
    pannier: "Side box",
    mamoride: "MamoRide",
    cardo: "CARDO intercom",
  },
};

function hkd(n: number): string {
  const body = Math.round(n).toLocaleString("en-US");
  return n < 0 ? `−HK$${body.replace("-", "")}` : `HK$${body}`;
}

/** Reference quote shown on the booking form and the submission summary. */
export default function BookingQuote({
  locale,
  quote,
  unpricedNote,
  hideTitle = false,
}: {
  locale: Locale;
  quote: RentalQuote;
  /** Shuttle / luggage have no HK$ list price. */
  unpricedNote?: string;
  /** The booking form already labels the surrounding section. */
  hideTitle?: boolean;
}) {
  if (!quote.ok) return null;
  const isEn = locale === "en";
  const labels = ADDON_LABEL[locale];
  const row = "flex items-baseline justify-between gap-4 text-sm";
  return (
    <div
      data-booking-quote={quote.applies ? "promo" : "list"}
      className={
        hideTitle
          ? "text-left"
          : "rounded-2xl border border-brand-100 bg-brand-50 p-4 text-left"
      }
    >
      <div className="flex items-baseline justify-between gap-3">
        {!hideTitle && (
          <h3 className="text-sm font-bold text-brand-800">
            {isEn ? "Reference quote" : "參考報價"}
          </h3>
        )}
        <p className={`text-xs text-ink-muted ${hideTitle ? "" : "ml-auto"}`}>
          {isEn ? `${quote.days} day(s) · P-${quote.grade}` : `${quote.days} 日 · P-${quote.grade}`}
        </p>
      </div>
      <dl className="mt-3 space-y-1.5">
        <div className={row}>
          <dt className="text-ink-soft">{isEn ? "Bike rent + damage protection" : "車租＋車損保障"}</dt>
          <dd className={quote.applies ? "text-ink-muted line-through" : "font-semibold text-ink"}>
            {hkd(quote.eligible)}
          </dd>
        </div>
        {quote.applies && (
          <>
            <div className={row}>
              <dt className="font-semibold text-accent-700">{DEC2026_PROMO.customerLabelZh}</dt>
              <dd className="font-semibold text-accent-700">{hkd(-quote.discount)}</dd>
            </div>
            {isEn && (
              <p className="text-xs text-ink-muted">{DEC2026_PROMO.customerLabelEn}</p>
            )}
            <div className={row}>
              <dt className="text-ink-soft">
                {isEn ? "Bike rent + damage protection after offer" : "優惠後車租＋車損保障"}
              </dt>
              <dd className="font-semibold text-ink">{hkd(quote.discountedEligible)}</dd>
            </div>
          </>
        )}
        {quote.addons.map((a) => (
          <div key={a.key} className={row}>
            <dt className="text-ink-soft">
              {labels[a.key]}
              {quote.applies && (
                <span className="ml-1 text-xs text-ink-muted">
                  {isEn ? "(not discounted)" : "（不計折扣）"}
                </span>
              )}
            </dt>
            <dd className="font-semibold text-ink">{hkd(a.amount)}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-3 border-t border-brand-100 pt-3">
        {quote.applies && (
          <p className={`${row} text-ink-muted`}>
            <span>{isEn ? "Total before offer" : "原價合計"}</span>
            <span className="line-through">{hkd(quote.totalBefore)}</span>
          </p>
        )}
        <p className="mt-1 flex items-baseline justify-between gap-4">
          <span className="text-sm font-bold text-ink">
            {quote.applies ? (isEn ? "Total after offer" : "優惠後合計") : isEn ? "Total" : "合計"}
          </span>
          <span className="text-lg font-black text-ink">{hkd(quote.totalAfter)}</span>
        </p>
      </div>
      <p className="mt-2 text-xs leading-5 text-ink-muted">
        {isEn
          ? "A reference only — the invoice is the final quote. Fuel, expressway tolls and parking are extra."
          : "僅供參考，最終以發票為準。燃油、高速公路費及泊車另計。"}
      </p>
      {unpricedNote && <p className="mt-1 text-xs leading-5 text-ink-muted">{unpricedNote}</p>}
    </div>
  );
}
