import type { InvoiceItem, Reservation } from "./types";

/** Invoice issuer (the HK/Macau agent). Adjust to your registered details. */
export const ISSUER = {
  name: "頭盔王 Helmet King",
  brand: "RENTAL819.HK",
  addressLines: ["香港", ""],
  phone: "+852 9868 6569",
  email: "info@helmetking.com",
  website: "rental819.hk",
} as const;

export function invoiceTotal(items: InvoiceItem[]): number {
  return items.reduce((sum, it) => sum + (Number(it.amount) || 0), 0);
}

export function fmtHKD(n: number): string {
  return `HK$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** Seed a first line item from the reservation so the agent isn't starting blank. */
export function defaultInvoiceItems(r: Reservation): InvoiceItem[] {
  const bike = r.confirmed_bike ?? r.bike_pref_1 ?? "電單車租賃";
  const days =
    r.pickup_date && r.return_date
      ? Math.max(
          1,
          Math.round(
            (new Date(r.return_date).getTime() - new Date(r.pickup_date).getTime()) /
              86400000,
          ),
        )
      : 1;
  return [
    {
      description: `日本電單車租賃 — ${bike}（${r.shop ?? ""}）`,
      qty: days,
      unit_price: 0,
      amount: 0,
    },
  ];
}
