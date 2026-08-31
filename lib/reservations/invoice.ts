import type { InvoiceItem, Reservation } from "./types";
import { RT819_ITEMS, rt819Label, type Rt819Item } from "./items";
import { rentalDays } from "./duration";

/** Invoice issuer — matches the SI-24 template (Helmet King / MOTOBLOG). */
export const ISSUER = {
  logo: "/helmetking-logo.jpg",
  name: "HELMET KING 頭盔王",
  addressLines: [
    "Shop 1, G/F, Po Hang Building,",
    "2-8 Dundas Street, Mong Kok, Hong Kong",
    "香港旺角登打士街2-8號寶亨大廈地下一號鋪",
  ],
  email: "Info@helmetking.com",
} as const;

/** Payment instruction bank accounts (HK + Macau), as on the SI template. */
export const BANKS = {
  hk: {
    label: "1) HONG KONG 香港入賬",
    lines: [
      ["Account Name 帳戶名稱", "MOTOBLOG LIMITED"],
      ["Account Number 帳戶號碼", "789-681970-883"],
      ["Bank 銀行", "Hang Seng Bank Limited 恆生銀行有限公司"],
      ["Bank Code 銀行代號", "024"],
      ["FPS 轉數快登記電話", "63858830"],
    ],
  },
  macau: {
    label: "2) MACAU 澳門入賬",
    lines: [
      ["Account Name 帳戶名稱", "LO KING YIP"],
      ["Account Number 帳戶號碼", "182-111104571-082"],
      ["Bank 銀行", "Bank of China (Macau) 中國銀行澳門"],
    ],
  },
} as const;

export function invoiceTotal(items: InvoiceItem[]): number {
  return items.reduce((sum, it) => sum + (Number(it.amount) || 0), 0);
}

export function fmtAmount(n: number): string {
  return (Number(n) || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function fmtHKD(n: number): string {
  return `HK$${fmtAmount(n)}`;
}

/**
 * Invoice discount modes. "打折" means a different number to different people,
 * so the agent picks which one they are typing rather than us guessing:
 *   percent — 10  → 10% off                     (subtotal x 10/100 deducted)
 *   rate    — 9   → 9折, the HK/JP convention   (subtotal x (10-9)/10 deducted)
 *   amount  — 300 → a flat HK$300 off
 */
export const DISCOUNT_MODES = ["percent", "rate", "amount"] as const;
export type DiscountMode = (typeof DISCOUNT_MODES)[number];

export interface InvoiceDiscount {
  mode: DiscountMode;
  value: number;
}

const isDiscountMode = (v: unknown): v is DiscountMode =>
  typeof v === "string" && (DISCOUNT_MODES as readonly string[]).includes(v);

/**
 * Read the discount off a settlement blob. It lives there — not as a line item —
 * so re-editing the rate never means hunting for a magic negative row, and so
 * the printed invoice can show it in the totals block beside the deposit rather
 * than among the goods. Every pre-discount booking reads back as "no discount".
 */
export function readInvoiceDiscount(
  settlement: Record<string, unknown> | null | undefined,
): InvoiceDiscount {
  const s = settlement ?? {};
  const mode = isDiscountMode(s.invoice_discount_mode)
    ? s.invoice_discount_mode
    : "percent";
  const value = Number(s.invoice_discount_value);
  return { mode, value: Number.isFinite(value) && value > 0 ? value : 0 };
}

/**
 * HK$ taken off the subtotal, always clamped to [0, subtotal]: a mistyped 120%
 * or a flat HK$9,999 off a HK$3,095 invoice must not flip the balance negative
 * and hand the customer a refund. A rate of 10 or more (10折 = full price) and
 * any non-positive value both mean no discount.
 */
export function invoiceDiscountAmount(
  subtotal: number,
  d: InvoiceDiscount,
): number {
  const base = Number(subtotal) || 0;
  const value = Number(d?.value) || 0;
  if (base <= 0 || value <= 0) return 0;
  const raw =
    d.mode === "amount"
      ? value
      : d.mode === "rate"
        ? (base * (10 - Math.min(value, 10))) / 10
        : (base * value) / 100;
  return Number(Math.min(Math.max(raw, 0), base).toFixed(2));
}

/** Badge for the printed DISCOUNT row: "9折" / "-10%" / "" for a flat sum. */
export function invoiceDiscountBadge(d: InvoiceDiscount): string {
  const value = Number(d?.value) || 0;
  if (value <= 0) return "";
  if (d.mode === "rate") {
    const rate = Math.min(value, 10);
    return rate >= 10 ? "" : `${trimNumber(rate)}折`;
  }
  if (d.mode === "percent") return `-${trimNumber(Math.min(value, 100))}%`;
  return "";
}

/** 9.5 -> "9.5", 9.00 -> "9" — no trailing zeros on a rate badge. */
function trimNumber(n: number): string {
  return String(Number(n.toFixed(2)));
}

/**
 * What the customer is actually billed: line items less the discount. This — not
 * `invoiceTotal` — is the figure the accounting module must count as revenue,
 * otherwise a discounted booking reports the undiscounted price as income.
 * (The deposit is deliberately NOT deducted: it is money already received, not
 * a reduction in price.)
 */
export function invoiceNetTotal(
  items: InvoiceItem[],
  settlement: Record<string, unknown> | null | undefined,
): number {
  const subtotal = invoiceTotal(items);
  const off = invoiceDiscountAmount(subtotal, readInvoiceDiscount(settlement));
  return Number((subtotal - off).toFixed(2));
}

function fmtDateTime(date?: string | null, time?: string | null): string {
  if (!date) return "";
  const [y, m, d] = date.split("-");
  const ymd = y && m && d ? `${y}/${Number(m)}/${Number(d)}` : date;
  const hm = time ? time.slice(0, 5) : "";
  return hm ? `${ymd} ${hm}` : ymd;
}

/**
 * Description-only rows shown under the priced line items on the SI invoice
 * (booking ref, departure window, rental description, confirmed bike, shop).
 */
export function invoiceInfoRows(r: Reservation): string[] {
  const rows: string[] = [];
  if (r.booking_ref) rows.push(`預約編號: ${r.booking_ref}`);
  const from = fmtDateTime(r.pickup_date, r.pickup_time);
  const to = fmtDateTime(r.return_date, r.return_time);
  if (from || to) rows.push(`出發日期：${from} - ${to}`);
  rows.push("電單車租賃：RENTAL819 優質電單車租賃、強制保險及車輛損傷補償保險");
  if (r.confirmed_bike) rows.push(`車型：${r.confirmed_bike}`);
  if (r.shop) rows.push(`RENTAL819 ${r.shop}`);
  return rows;
}

function lineFromCode(
  catalog: Rt819Item[],
  code: string,
  qty: number,
): InvoiceItem | null {
  const it = catalog.find((x) => x.code === code);
  if (!it || qty <= 0) return null;
  return {
    description: rt819Label(it),
    qty,
    unit_price: it.unit_price,
    amount: Number((qty * it.unit_price).toFixed(2)),
  };
}

/** Suggested SI number for a reservation: SI-<booking ref>. */
export function autoSiNumber(r: Reservation): string {
  return r.si_number ?? (r.booking_ref ? `SI-${r.booking_ref}` : "");
}

/**
 * Seed invoice line items from everything Japan confirmed — grade + duration
 * (bike rent + insurance), plus each confirmed add-on (MamoRide, helmets,
 * cases) and the HK-side CARDO value-add — mirroring the master sheet's
 * 1st-day + subsequent-day billing. The agent can adjust before saving.
 */
export function defaultInvoiceItems(
  r: Reservation,
  catalog: Rt819Item[] = RT819_ITEMS,
): InvoiceItem[] {
  const grade = gradeFromReservation(r); // "P1".."P7" or null
  const days = rentalDays(r);
  const extra = Math.max(0, days - 1);
  const a = r.addons ?? {};
  const items: InvoiceItem[] = [];
  const L = (code: string, qty: number) => lineFromCode(catalog, code, qty);

  if (grade) {
    const g = grade.replace("P", "");
    // Bike rent
    push(items, L(`RT819-${grade}-1D`, 1));
    if (extra) push(items, L(`RT819-${grade}-2D`, extra));
    // Insurance (vehicle damage compensation)
    const insGroup = ["1", "2"].includes(g) ? "P1P2" : `P${g}`;
    push(items, L(`RT819-INS-${insGroup}-1D`, 1));
    if (extra) push(items, L(`RT819-INS-${insGroup}-2D`, extra));
    // MamoRide (optional add-on)
    if (a.mamoride) {
      const mamoGroup = ["1", "2"].includes(g)
        ? "P1P2"
        : ["4", "5"].includes(g)
          ? "P4P5"
          : `P${g}`;
      push(items, L(`RT819-MAMO-${mamoGroup}-1D`, 1));
      if (extra) push(items, L(`RT819-MAMO-${mamoGroup}-2D`, extra));
    }
  }

  // Helmets (full-face + open-face counts)
  const helmets = (Number(a.full_face) || 0) + (Number(a.open_face) || 0);
  if (helmets > 0) {
    push(items, L("RT819-HM-1D", helmets));
    if (extra) push(items, L("RT819-HM-2D", helmets * extra));
  }
  // Cases / bags
  if (a.topcase) {
    push(items, L("RT819-TC-1D", 1));
    if (extra) push(items, L("RT819-TC-2D", extra));
  }
  if (a.sidebag) {
    push(items, L("RT819-SB-1D", 1));
    if (extra) push(items, L("RT819-SB-2D", extra));
  }
  if (a.pannier) {
    push(items, L("RT819-SC-1D", 1));
    if (extra) push(items, L("RT819-SC-2D", extra));
  }
  // CARDO — HK-side value-add, flat HK$200
  if (a.cardo) push(items, L("HK-CARDO", 1));

  if (!items.length) {
    // The invoice quotes the bike Japan finally confirmed (後台「確認車款」),
    // never the customer's form preference — before Japan replies the line
    // reads 待確認 so a mere preference cannot end up on an invoice.
    const bike = r.confirmed_bike ?? "（待日本確認）";
    items.push({ description: `日本電單車租賃 — ${bike}`, qty: days, unit_price: 0, amount: 0 });
  }
  return items;
}

function push(arr: InvoiceItem[], it: InvoiceItem | null) {
  if (it) arr.push(it);
}

/**
 * P-grade (P1..P7): use the grade confirmed in settlement first, otherwise read
 * it from the confirmed bike / preference text (e.g. "… P-4クラス").
 */
function gradeFromReservation(r: Reservation): string | null {
  const s = (r.settlement ?? {}) as Record<string, unknown>;
  const stored = typeof s.grade === "string" ? s.grade : "";
  if (/^P[1-7]$/.test(stored)) return stored;
  const text = `${r.confirmed_bike ?? ""} ${r.bike_pref_1 ?? ""}`;
  const m = text.match(/P\s*-?\s*([1-7])/i);
  return m ? `P${m[1]}` : null;
}
