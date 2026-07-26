import type { InvoiceItem, Reservation } from "./types";
import { RT819_ITEMS, rt819Label } from "./items";

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

/** Number of rental days from the reservation dates (min 1). */
function rentalDays(r: Reservation): number {
  if (!r.pickup_date || !r.return_date) return 1;
  const diff =
    (new Date(r.return_date).getTime() - new Date(r.pickup_date).getTime()) / 86400000;
  return Math.max(1, Math.round(diff));
}

const itemByCode = (code: string) => RT819_ITEMS.find((it) => it.code === code);

function lineFromCode(code: string, qty: number): InvoiceItem | null {
  const it = itemByCode(code);
  if (!it || qty <= 0) return null;
  return {
    description: rt819Label(it),
    qty,
    unit_price: it.unit_price,
    amount: Number((qty * it.unit_price).toFixed(2)),
  };
}

/**
 * Seed invoice line items from the reservation's confirmed grade + duration,
 * mirroring how the master sheet bills (1st day + subsequent days for bike rent
 * and insurance). The agent can then adjust before saving.
 */
export function defaultInvoiceItems(r: Reservation): InvoiceItem[] {
  const grade = gradeFromReservation(r); // "P1".."P7" or null
  const days = rentalDays(r);
  const extraDays = Math.max(0, days - 1);
  const items: InvoiceItem[] = [];

  if (grade) {
    const g = grade.replace("P", "");
    const insGroup = ["1", "2"].includes(g) ? "P1P2" : `P${g}`;
    push(items, lineFromCode(`RT819-INS-${insGroup}-1D`, 1));
    if (extraDays) push(items, lineFromCode(`RT819-INS-${insGroup}-2D`, extraDays));
    push(items, lineFromCode(`RT819-${grade}-1D`, 1));
    if (extraDays) push(items, lineFromCode(`RT819-${grade}-2D`, extraDays));
  }

  if (!items.length) {
    const bike = r.confirmed_bike ?? r.bike_pref_1 ?? "電單車租賃";
    items.push({ description: `日本電單車租賃 — ${bike}`, qty: days, unit_price: 0, amount: 0 });
  }
  return items;
}

function push(arr: InvoiceItem[], it: InvoiceItem | null) {
  if (it) arr.push(it);
}

/** Try to read a P-grade (P1..P7) from the confirmed bike text, e.g. "… P-4クラス". */
function gradeFromReservation(r: Reservation): string | null {
  const text = `${r.confirmed_bike ?? ""} ${r.bike_pref_1 ?? ""}`;
  const m = text.match(/P\s*-?\s*([1-7])/i);
  return m ? `P${m[1]}` : null;
}
