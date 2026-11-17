/**
 * December 2026 promotion — the only place the dates, rate and eligible
 * categories live. Delete or edit this module to end the offer.
 *
 * Two clocks, on purpose:
 * - The homepage popup starts as soon as this build is deployed. `popup.startsAt`
 *   is 2026-11-17 00:00 Asia/Hong_Kong (already reached on the ship day) and
 *   `popup.endsAt` is exclusive: the popup stops at 2027-01-01 00:00 HKT, i.e.
 *   after 2026-12-31 23:59 HKT. Both instants carry a +08:00 offset, so the
 *   check does not depend on the server's timezone.
 * - The discount follows the pick-up (起租) date only, inclusive of
 *   2026-12-01 and 2026-12-31. When the booking was made does not matter.
 *   A November booking for a December pick-up qualifies; a December booking
 *   for a January pick-up does not.
 *
 * What is discounted: bike rent + vehicle-damage protection (車損保障 /
 * insurance) combined, at 12% off (88折). Helmets, cases, bags, phone mounts,
 * luggage storage, MamoRide and the Hong Kong CARDO rental are not discounted.
 * Fuel, tolls and parking are not on these quotes.
 *
 * Rounding: the discount is 12% of the eligible subtotal, snapped to cents,
 * then rounded to the nearest whole HKD. Halves round away from zero
 * (1.5 → 2). The credit is never larger than the eligible subtotal. Worked
 * example: P-4, 2026-12-10 10:00 → 2026-12-12 10:00 is 2 days, bike rent
 * 1,030 + 685 = 1,715, insurance 195 + 105 = 300, eligible 2,015.
 * 2,015 × 12% = 241.8 → HK$242 off. A tail box (90 + 20 = 110) stays full price.
 *
 * Billing matches the invoice seeder: the first 24 hours at the 1st-day rate
 * and each further 24-hour block at the subsequent-day rate (`rentalDays`).
 * The 4-hour and 8-hour bands on the fee guide are not used here.
 */

export const DEC2026_PROMO = {
  id: "dec2026",
  /** Percent taken off the combined bike-rent + damage-protection subtotal. */
  percentOff: 12,
  invoiceDescription:
    "DEC 2026 PROMO 12% OFF (BIKE RENT + INSURANCE) 12月優惠 88折",
  /** Shown on the booking form when the pick-up qualifies. */
  customerLabelZh: "12月優惠：車租＋車損保障 88折",
  customerLabelEn: "December offer: 12% off bike rent + damage protection (pay 88%)",
  catalogueNoteZh:
    "12月優惠：此取車日的車租＋車損保障享 88折（此頁參考價為未折扣車租）。頭盔、尾箱及其他配件不計折扣，折後價在預約表格顯示。",
  catalogueNoteEn:
    "December offer: bike rent + damage protection are 12% off for this pick-up date. The reference price here is the undiscounted bike rent. Helmets, cases and other accessories are not discounted — the booking form shows the reduced quote.",
  /** Catalog groups the rate applies to. Everything else is full price. */
  eligibleGroups: ["bike", "insurance"] as const,
  /** Inclusive pick-up dates, compared as YYYY-MM-DD strings. */
  pickupFrom: "2026-12-01",
  pickupTo: "2026-12-31",
  popup: {
    /** Inclusive. Already in the past on the day this ships, so the popup shows on deploy. */
    startsAt: "2026-11-17T00:00:00+08:00",
    /** Exclusive. Last moment shown is 2026-12-31 23:59:59.999 HKT. */
    endsAt: "2027-01-01T00:00:00+08:00",
    sessionKey: "rental819.promo.dec2026",
    square: "/promo/dec2026-square.jpg",
    portrait: "/promo/dec2026-portrait.jpg",
  },
} as const;

const ELIGIBLE = new Set<string>(DEC2026_PROMO.eligibleGroups);
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function isEligibleGroup(group: string | null | undefined): boolean {
  return !!group && ELIGIBLE.has(group);
}

/** True when `pickupDate` is a calendar day inside the promotional pick-up window. */
export function pickupEligible(pickupDate: string | null | undefined): boolean {
  if (!pickupDate || !ISO_DATE.test(pickupDate)) return false;
  return pickupDate >= DEC2026_PROMO.pickupFrom && pickupDate <= DEC2026_PROMO.pickupTo;
}

/**
 * Homepage popup gate. `now` is an absolute instant; the window is stored
 * with an explicit Hong Kong offset.
 */
export function popupActive(now: Date = new Date()): boolean {
  const t = now.getTime();
  if (!Number.isFinite(t)) return false;
  const start = Date.parse(DEC2026_PROMO.popup.startsAt);
  const end = Date.parse(DEC2026_PROMO.popup.endsAt);
  return t >= start && t < end;
}

/**
 * 12% of `eligible` HKD, rounded to the nearest whole dollar.
 * Halves round away from zero. Returns 0 when there is nothing to discount.
 * The result is clamped so the credit cannot exceed the eligible subtotal.
 */
export function discountAmount(
  eligible: number,
  percentOff: number = DEC2026_PROMO.percentOff,
): number {
  if (!(eligible > 0) || !(percentOff > 0)) return 0;
  const cents = Math.round(eligible * 100);
  const num = cents * percentOff;
  const den = 100 * 100;
  const q = Math.floor(num / den);
  const rem = num % den;
  const rounded = rem * 2 >= den ? q + 1 : q;
  const cap = Math.round(eligible);
  return Math.min(rounded, Math.max(0, cap));
}

export interface PromoLineDraft {
  description: string;
  qty: number;
  unit_price: number;
  amount: number;
}

/** The negative invoice row, or null when this pick-up is not discounted. */
export function decemberPromoLine(
  eligible: number,
  pickupDate: string | null | undefined,
): PromoLineDraft | null {
  if (!pickupEligible(pickupDate)) return null;
  const discount = discountAmount(eligible);
  if (discount <= 0) return null;
  return {
    description: DEC2026_PROMO.invoiceDescription,
    qty: 1,
    unit_price: -discount,
    amount: -discount,
  };
}

/**
 * Append the promotional credit once. `groupOf` classifies each existing row
 * (catalog group). Rows already carrying the promo description are left alone.
 */
export function applyDecemberPromo<T extends { description: string; amount: number }>(
  items: T[],
  pickupDate: string | null | undefined,
  groupOf: (item: T) => string | undefined,
): Array<T | PromoLineDraft> {
  if (items.some((it) => it.description === DEC2026_PROMO.invoiceDescription)) return items;
  const eligible = items.reduce((sum, it) => {
    return isEligibleGroup(groupOf(it)) ? sum + (Number(it.amount) || 0) : sum;
  }, 0);
  const line = decemberPromoLine(eligible, pickupDate);
  return line ? [...items, line] : items;
}

export interface PromoPrice {
  code: string;
  unit_price: number;
}

export type QuoteAddonKey = "helmet" | "topcase" | "sidebag" | "pannier" | "mamoride" | "cardo";

export interface RentalQuote {
  /** False when the class or a required list price is missing — do not display. */
  ok: boolean;
  applies: boolean;
  days: number;
  grade: number | null;
  bike: number;
  insurance: number;
  /** Bike rent + damage protection, before the discount. */
  eligible: number;
  /** Whole HKD taken off. 0 when the pick-up is outside December 2026. */
  discount: number;
  discountedEligible: number;
  addons: { key: QuoteAddonKey; amount: number }[];
  /** Accessories and add-ons, full price. */
  equipment: number;
  totalBefore: number;
  totalAfter: number;
}

const EMPTY_QUOTE: RentalQuote = {
  ok: false,
  applies: false,
  days: 0,
  grade: null,
  bike: 0,
  insurance: 0,
  eligible: 0,
  discount: 0,
  discountedEligible: 0,
  addons: [],
  equipment: 0,
  totalBefore: 0,
  totalAfter: 0,
};

/** "P-4", "P4", "… / P-4" → 4. No class → null. "P12" is not class 1. */
export function gradeFromBikePref(text: string | null | undefined): number | null {
  const m = (text ?? "").match(/P\s*-?\s*([1-7])(?!\d)/i);
  return m ? Number(m[1]) : null;
}

function cents(n: number): number {
  return Math.round(n * 100) / 100;
}

function unitPrice(prices: PromoPrice[], code: string): number | null {
  const row = prices.find((p) => p.code === code);
  if (!row || !Number.isFinite(Number(row.unit_price))) return null;
  return Number(row.unit_price);
}

/** First day plus each extra day. Null when either list price is missing. */
function daySpan(prices: PromoPrice[], base: string, days: number, qty = 1): number | null {
  if (qty <= 0) return 0;
  const first = unitPrice(prices, `${base}-1D`);
  if (first == null) return null;
  const extra = Math.max(0, days - 1);
  if (!extra) return cents(first * qty);
  const next = unitPrice(prices, `${base}-2D`);
  if (next == null) return null;
  return cents(first * qty + next * qty * extra);
}

function insGroup(grade: number): string {
  return grade <= 2 ? "P1P2" : `P${grade}`;
}

function mamoGroup(grade: number): string {
  if (grade <= 2) return "P1P2";
  if (grade === 4 || grade === 5) return "P4P5";
  return `P${grade}`;
}

/**
 * Reference quote for the booking form. Same codes and day split as
 * `defaultInvoiceItems`. CARDO is included here (the customer ticked it) even
 * though the Japan rental invoice seeds it separately.
 */
export function quoteRental(input: {
  pickupDate: string | null | undefined;
  days: number;
  grade: number | null;
  prices: PromoPrice[];
  helmets?: number;
  topcase?: boolean;
  sidebag?: boolean;
  pannier?: boolean;
  mamoride?: boolean;
  cardo?: boolean;
}): RentalQuote {
  const days = Math.max(1, Math.floor(input.days) || 1);
  const grade = input.grade;
  if (grade == null || grade < 1 || grade > 7) return { ...EMPTY_QUOTE, days };
  const bike = daySpan(input.prices, `RT819-P${grade}`, days);
  const insurance = daySpan(input.prices, `RT819-INS-${insGroup(grade)}`, days);
  if (bike == null || insurance == null) return { ...EMPTY_QUOTE, days, grade };

  const addons: RentalQuote["addons"] = [];
  const push = (key: QuoteAddonKey, amount: number | null, wanted: boolean) => {
    if (!wanted) return true;
    if (amount == null) return false;
    if (amount !== 0) addons.push({ key, amount });
    return true;
  };
  const helmets = Math.max(0, Math.floor(input.helmets || 0));
  const gearOk =
    push("helmet", daySpan(input.prices, "RT819-HM", days, helmets), helmets > 0) &&
    push("topcase", daySpan(input.prices, "RT819-TC", days), !!input.topcase) &&
    push("sidebag", daySpan(input.prices, "RT819-SB", days), !!input.sidebag) &&
    push("pannier", daySpan(input.prices, "RT819-SC", days), !!input.pannier) &&
    push("mamoride", daySpan(input.prices, `RT819-MAMO-${mamoGroup(grade)}`, days), !!input.mamoride) &&
    push("cardo", unitPrice(input.prices, "HK-CARDO"), !!input.cardo);
  if (!gearOk) return { ...EMPTY_QUOTE, days, grade, bike, insurance };

  const eligible = cents(bike + insurance);
  const applies = pickupEligible(input.pickupDate);
  const discount = applies ? discountAmount(eligible) : 0;
  const equipment = cents(addons.reduce((sum, a) => sum + a.amount, 0));
  const totalBefore = cents(eligible + equipment);
  return {
    ok: true,
    applies,
    days,
    grade,
    bike,
    insurance,
    eligible,
    discount,
    discountedEligible: cents(eligible - discount),
    addons,
    equipment,
    totalBefore,
    totalAfter: cents(totalBefore - discount),
  };
}
