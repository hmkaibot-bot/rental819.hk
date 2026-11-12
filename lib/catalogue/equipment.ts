import type { Locale } from "@/lib/i18n";
import { matchEquipmentBike as matchEquipmentBikeRaw } from "./match-equipment.mjs";

export interface EquipmentBikeRef {
  shop: string;
  pref: string;
  maker: string;
  model: string;
  /** Paid add-on keys this model offers. Empty means the bike was scraped and offers none. */
  paid: string[];
}

export function matchEquipmentBike(
  shop: string,
  bikeText: string,
  bikes: EquipmentBikeRef[],
): EquipmentBikeRef | null {
  return matchEquipmentBikeRaw(shop, bikeText, bikes);
}

/**
 * Stable codes stored in catalogue_units.free_equipment / paid_equipment.
 * Chinese labels already used on this site win over rental819.com's wording
 * (後箱 → 尾箱, 馬鞍包 → 側袋). Items this site has not named before keep
 * rental819.com's Traditional Chinese.
 */
const LABELS: Record<string, Record<Locale, string>> = {
  topcase: { "zh-hk": "尾箱", en: "Tail box" },
  sidebag: { "zh-hk": "側袋", en: "Side bag" },
  pannier: { "zh-hk": "側箱", en: "Side box" },
  phone_holder: { "zh-hk": "手機架", en: "Phone mount" },
  usb: { "zh-hk": "USB插座", en: "USB socket" },
  usb_c: { "zh-hk": "USB-C插座", en: "USB-C socket" },
  cigarette: { "zh-hk": "點菸器插座", en: "Cigarette-lighter socket" },
  etc_reader: {
    "zh-hk": "ETC讀卡機(不含ETC卡)",
    en: "ETC card reader (ETC card not included)",
  },
};

/** Paid rental819.com equipment that corresponds to a booking-form checkbox. */
export const PAID_FORM_ADDONS = ["topcase", "sidebag", "pannier"] as const;
export type PaidFormAddon = (typeof PAID_FORM_ADDONS)[number];

export function equipmentLabel(code: string, locale: Locale): string {
  if (code.startsWith("raw:")) return code.slice(4);
  return LABELS[code]?.[locale] ?? code;
}

export function paidFormAddons(codes: readonly string[]): PaidFormAddon[] {
  const out: PaidFormAddon[] = [];
  for (const code of codes) {
    if ((PAID_FORM_ADDONS as readonly string[]).includes(code) && !out.includes(code as PaidFormAddon)) {
      out.push(code as PaidFormAddon);
    }
  }
  return out;
}
