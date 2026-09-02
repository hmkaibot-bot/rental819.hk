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
 * A line's billed amount: quantity x list unit price, less that line's own
 * discount. The percentage is clamped to [0, 100] so a mistyped 120 or -5 can
 * never turn a charge into a credit, and the result is rounded to cents once,
 * here, so the editor, the printed invoice and the accounting page can never
 * disagree about a line by a rounding step.
 */
export function lineAmount(
  qty: number,
  unitPrice: number,
  discountPct?: number,
): number {
  const gross = (Number(qty) || 0) * (Number(unitPrice) || 0);
  const pct = Math.min(Math.max(Number(discountPct) || 0, 0), 100);
  return Number((gross * (1 - pct / 100)).toFixed(2));
}

/** Normalised discount for a line — 0 when absent, mistyped or out of range. */
export function lineDiscountPct(item: InvoiceItem): number {
  return Math.min(Math.max(Number(item.discount_pct) || 0, 0), 100);
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
  // A CARDO-only rental has no Japan trip: the dates are the device's rental
  // period and the Japan bike/shop lines would be false statements on a tax
  // document, so they are replaced rather than merely blanked.
  if (r.cardo_only) {
    if (from || to) rows.push(`租借日期：${from} - ${to}`);
    rows.push("CARDO Packtalk Bold 對講機租賃（頭盔王 Helmet King）");
    return rows;
  }
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
  // A CARDO-only rental bills exactly the intercom — never the bike
  // placeholder, even if someone unticked the CARDO box on the detail page.
  if (r.cardo_only) {
    const it = lineFromCode(catalog, "HK-CARDO", 1);
    return it
      ? [it]
      : [{ description: "CARDO PACKTALK BOLD INTERCOM RENTAL 對講機租賃", qty: 1, unit_price: 200, amount: 200 }];
  }
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
