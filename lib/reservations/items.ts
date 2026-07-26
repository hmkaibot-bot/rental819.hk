/**
 * RENTAL819 invoice item catalog (from RT819_ITEM.xlsx).
 * Invoice line items are chosen from this list — description + unit price come
 * straight from here so pricing stays consistent with the master sheet.
 */

export interface Rt819Item {
  code: string; // e.g. RT819-INS-P4-1D
  desc_en: string; // English description
  desc_zh: string; // Chinese description (首天費用 / 第二天或以後每天費用 / 4小時 / 8小時)
  yen_cost: number; // supplier cost in JPY
  hkd_cost: number; // cost in HKD
  unit_price: number; // customer unit price in HKD (used on the invoice)
  group: "bike" | "insurance" | "mamoride" | "helmet" | "case" | "hk" | "other";
}

/** JPY→HKD exchange rate and Kizuki rebate used in the master sheet's costing. */
export const RT819_EXCHANGE_RATE = 0.05;
export const RT819_KIZUKI_REBATE = 0.9;

export const RT819_ITEMS: Rt819Item[] = [
  // Helmet
  { code: "RT819-HM-1D", desc_en: "RENTAL 819 HELMET RENT 1ST DAY", desc_zh: "首天費用", yen_cost: 1100, hkd_cost: 55, unit_price: 60, group: "helmet" },
  { code: "RT819-HM-2D", desc_en: "RENTAL 819 HELMET RENT DAY", desc_zh: "第二天或以後每天費用", yen_cost: 220, hkd_cost: 11, unit_price: 10, group: "helmet" },
  // Insurance (vehicle damage compensation)
  { code: "RT819-INS-P1P2-1D", desc_en: "RENTAL 819 INSURANCE P1 P2 CLASS 1ST DAY", desc_zh: "首天費用", yen_cost: 1540, hkd_cost: 77, unit_price: 85, group: "insurance" },
  { code: "RT819-INS-P1P2-2D", desc_en: "RENTAL 819 INSURANCE P1 P2 CLASS DAY", desc_zh: "第二天或以後每天費用", yen_cost: 880, hkd_cost: 44, unit_price: 50, group: "insurance" },
  { code: "RT819-INS-P3-1D", desc_en: "RENTAL 819 INSURANCE P3 CLASS 1ST DAY", desc_zh: "首天費用", yen_cost: 2530, hkd_cost: 126.5, unit_price: 140, group: "insurance" },
  { code: "RT819-INS-P3-2D", desc_en: "RENTAL 819 INSURANCE P3 CLASS DAY", desc_zh: "第二天或以後每天費用", yen_cost: 1320, hkd_cost: 66, unit_price: 75, group: "insurance" },
  { code: "RT819-INS-P4-1D", desc_en: "RENTAL 819 INSURANCE P4 CLASS 1ST DAY", desc_zh: "首天費用", yen_cost: 3520, hkd_cost: 176, unit_price: 195, group: "insurance" },
  { code: "RT819-INS-P4-2D", desc_en: "RENTAL 819 INSURANCE P4 CLASS DAY", desc_zh: "第二天或以後每天費用", yen_cost: 1870, hkd_cost: 93.5, unit_price: 105, group: "insurance" },
  { code: "RT819-INS-P5-1D", desc_en: "RENTAL 819 INSURANCE P5 CLASS 1ST DAY", desc_zh: "首天費用", yen_cost: 3520, hkd_cost: 176, unit_price: 195, group: "insurance" },
  { code: "RT819-INS-P5-2D", desc_en: "RENTAL 819 INSURANCE P5 CLASS DAY", desc_zh: "第二天或以後每天費用", yen_cost: 1870, hkd_cost: 93.5, unit_price: 105, group: "insurance" },
  { code: "RT819-INS-P6-1D", desc_en: "RENTAL 819 INSURANCE P6 CLASS 1ST DAY", desc_zh: "首天費用", yen_cost: 3850, hkd_cost: 192.5, unit_price: 215, group: "insurance" },
  { code: "RT819-INS-P6-2D", desc_en: "RENTAL 819 INSURANCE P6 CLASS DAY", desc_zh: "第二天或以後每天費用", yen_cost: 2090, hkd_cost: 104.5, unit_price: 115, group: "insurance" },
  { code: "RT819-INS-P7-1D", desc_en: "RENTAL 819 INSURANCE P7 CLASS 1ST DAY", desc_zh: "首天費用", yen_cost: 4400, hkd_cost: 220, unit_price: 245, group: "insurance" },
  { code: "RT819-INS-P7-2D", desc_en: "RENTAL 819 INSURANCE P7 CLASS DAY", desc_zh: "第二天或以後每天費用", yen_cost: 2310, hkd_cost: 115.5, unit_price: 130, group: "insurance" },
  // MamoRide
  { code: "RT819-MAMO-P1P2-1D", desc_en: "RENTAL 819 MAMO RIDE P1P2 CLASS 1ST DAY", desc_zh: "首天費用", yen_cost: 2000, hkd_cost: 100, unit_price: 110, group: "mamoride" },
  { code: "RT819-MAMO-P1P2-2D", desc_en: "RENTAL 819 MAMO RIDE P1P2 CLASS DAY", desc_zh: "第二天或以後每天費用", yen_cost: 650, hkd_cost: 32.5, unit_price: 40, group: "mamoride" },
  { code: "RT819-MAMO-P3-1D", desc_en: "RENTAL 819 MAMO RIDE P3 CLASS 1ST DAY", desc_zh: "首天費用", yen_cost: 2700, hkd_cost: 135, unit_price: 150, group: "mamoride" },
  { code: "RT819-MAMO-P3-2D", desc_en: "RENTAL 819 MAMO RIDE P3 CLASS DAY", desc_zh: "第二天或以後每天費用", yen_cost: 1000, hkd_cost: 50, unit_price: 55, group: "mamoride" },
  { code: "RT819-MAMO-P4P5-1D", desc_en: "RENTAL 819 MAMO RIDE P4P5 CLASS 1ST DAY", desc_zh: "首天費用", yen_cost: 2900, hkd_cost: 145, unit_price: 160, group: "mamoride" },
  { code: "RT819-MAMO-P4P5-2D", desc_en: "RENTAL 819 MAMO RIDE P4P5 CLASS DAY", desc_zh: "第二天或以後每天費用", yen_cost: 1100, hkd_cost: 55, unit_price: 65, group: "mamoride" },
  { code: "RT819-MAMO-P6-1D", desc_en: "RENTAL 819 MAMO RIDE P6 CLASS 1ST DAY", desc_zh: "首天費用", yen_cost: 3100, hkd_cost: 155, unit_price: 175, group: "mamoride" },
  { code: "RT819-MAMO-P6-2D", desc_en: "RENTAL 819 MAMO RIDE P6 CLASS DAY", desc_zh: "第二天或以後每天費用", yen_cost: 1200, hkd_cost: 60, unit_price: 70, group: "mamoride" },
  { code: "RT819-MAMO-P7-1D", desc_en: "RENTAL 819 MAMO RIDE P7 CLASS 1ST DAY", desc_zh: "首天費用", yen_cost: 3300, hkd_cost: 165, unit_price: 185, group: "mamoride" },
  { code: "RT819-MAMO-P7-2D", desc_en: "RENTAL 819 MAMO RIDE P7 CLASS DAY", desc_zh: "第二天或以後每天費用", yen_cost: 1300, hkd_cost: 65, unit_price: 75, group: "mamoride" },
  // Bike rent
  { code: "RT819-P1-1D", desc_en: "RENTAL 819 BIKE RENT P1 CLASS 1ST DAY", desc_zh: "首天費用", yen_cost: 5280, hkd_cost: 237.6, unit_price: 295, group: "bike" },
  { code: "RT819-P1-2D", desc_en: "RENTAL 819 BIKE RENT P1 CLASS DAY", desc_zh: "第二天或以後每天費用", yen_cost: 3520, hkd_cost: 158.4, unit_price: 195, group: "bike" },
  { code: "RT819-P1-4H", desc_en: "RENTAL 819 BIKE RENT P1 CLASS 4 HOURS", desc_zh: "4小時", yen_cost: 3960, hkd_cost: 178.2, unit_price: 220, group: "bike" },
  { code: "RT819-P1-8H", desc_en: "RENTAL 819 BIKE RENT P1 CLASS 8 HOURS", desc_zh: "8小時", yen_cost: 4400, hkd_cost: 198, unit_price: 245, group: "bike" },
  { code: "RT819-P2-1D", desc_en: "RENTAL 819 BIKE RENT P2 CLASS 1ST DAY", desc_zh: "首天費用", yen_cost: 7920, hkd_cost: 356.4, unit_price: 440, group: "bike" },
  { code: "RT819-P2-2D", desc_en: "RENTAL 819 BIKE RENT P2 CLASS DAY", desc_zh: "第二天或以後每天費用", yen_cost: 5280, hkd_cost: 237.6, unit_price: 295, group: "bike" },
  { code: "RT819-P2-4H", desc_en: "RENTAL 819 BIKE RENT P2 CLASS 4 HOURS", desc_zh: "4小時", yen_cost: 5940, hkd_cost: 267.3, unit_price: 330, group: "bike" },
  { code: "RT819-P2-8H", desc_en: "RENTAL 819 BIKE RENT P2 CLASS 8 HOURS", desc_zh: "8小時", yen_cost: 6600, hkd_cost: 297, unit_price: 365, group: "bike" },
  { code: "RT819-P3-1D", desc_en: "RENTAL 819 BIKE RENT P3 CLASS 1ST DAY", desc_zh: "首天費用", yen_cost: 14520, hkd_cost: 653.4, unit_price: 810, group: "bike" },
  { code: "RT819-P3-2D", desc_en: "RENTAL 819 BIKE RENT P3 CLASS DAY", desc_zh: "第二天或以後每天費用", yen_cost: 9680, hkd_cost: 435.6, unit_price: 540, group: "bike" },
  { code: "RT819-P3-4H", desc_en: "RENTAL 819 BIKE RENT P3 CLASS 4 HOURS", desc_zh: "4小時", yen_cost: 10890, hkd_cost: 490.05, unit_price: 605, group: "bike" },
  { code: "RT819-P3-8H", desc_en: "RENTAL 819 BIKE RENT P3 CLASS 8 HOURS", desc_zh: "8小時", yen_cost: 12100, hkd_cost: 544.5, unit_price: 675, group: "bike" },
  { code: "RT819-P4-1D", desc_en: "RENTAL 819 BIKE RENT P4 CLASS 1ST DAY", desc_zh: "首天費用", yen_cost: 18480, hkd_cost: 831.6, unit_price: 1030, group: "bike" },
  { code: "RT819-P4-2D", desc_en: "RENTAL 819 BIKE RENT P4 CLASS DAY", desc_zh: "第二天或以後每天費用", yen_cost: 12320, hkd_cost: 554.4, unit_price: 685, group: "bike" },
  { code: "RT819-P4-4H", desc_en: "RENTAL 819 BIKE RENT P4 CLASS 4 HOURS", desc_zh: "4小時", yen_cost: 13860, hkd_cost: 623.7, unit_price: 770, group: "bike" },
  { code: "RT819-P4-8H", desc_en: "RENTAL 819 BIKE RENT P4 CLASS 8 HOURS", desc_zh: "8小時", yen_cost: 15400, hkd_cost: 693, unit_price: 855, group: "bike" },
  { code: "RT819-P5-1D", desc_en: "RENTAL 819 BIKE RENT P5 CLASS 1ST DAY", desc_zh: "首天費用", yen_cost: 21120, hkd_cost: 950.4, unit_price: 1175, group: "bike" },
  { code: "RT819-P5-2D", desc_en: "RENTAL 819 BIKE RENT P5 CLASS DAY", desc_zh: "第二天或以後每天費用", yen_cost: 14080, hkd_cost: 633.6, unit_price: 785, group: "bike" },
  { code: "RT819-P5-4H", desc_en: "RENTAL 819 BIKE RENT P5 CLASS 4 HOURS", desc_zh: "4小時", yen_cost: 15840, hkd_cost: 712.8, unit_price: 880, group: "bike" },
  { code: "RT819-P5-8H", desc_en: "RENTAL 819 BIKE RENT P5 CLASS 8 HOURS", desc_zh: "8小時", yen_cost: 17600, hkd_cost: 792, unit_price: 980, group: "bike" },
  { code: "RT819-P6-1D", desc_en: "RENTAL 819 BIKE RENT P6 CLASS 1ST DAY", desc_zh: "首天費用", yen_cost: 23760, hkd_cost: 1069.2, unit_price: 1320, group: "bike" },
  { code: "RT819-P6-2D", desc_en: "RENTAL 819 BIKE RENT P6 CLASS DAY", desc_zh: "第二天或以後每天費用", yen_cost: 15840, hkd_cost: 712.8, unit_price: 880, group: "bike" },
  { code: "RT819-P6-4H", desc_en: "RENTAL 819 BIKE RENT P6 CLASS 4 HOURS", desc_zh: "4小時", yen_cost: 17820, hkd_cost: 801.9, unit_price: 990, group: "bike" },
  { code: "RT819-P6-8H", desc_en: "RENTAL 819 BIKE RENT P6 CLASS 8 HOURS", desc_zh: "8小時", yen_cost: 19800, hkd_cost: 891, unit_price: 1100, group: "bike" },
  { code: "RT819-P7-1D", desc_en: "RENTAL 819 BIKE RENT P7 CLASS 1ST DAY", desc_zh: "首天費用", yen_cost: 31680, hkd_cost: 1425.6, unit_price: 1765, group: "bike" },
  { code: "RT819-P7-2D", desc_en: "RENTAL 819 BIKE RENT P7 CLASS DAY", desc_zh: "第二天或以後每天費用", yen_cost: 21120, hkd_cost: 950.4, unit_price: 1175, group: "bike" },
  { code: "RT819-P7-4H", desc_en: "RENTAL 819 BIKE RENT P7 CLASS 4 HOURS", desc_zh: "4小時", yen_cost: 23760, hkd_cost: 1069.2, unit_price: 1320, group: "bike" },
  { code: "RT819-P7-8H", desc_en: "RENTAL 819 BIKE RENT P7 CLASS 8 HOURS", desc_zh: "8小時", yen_cost: 26400, hkd_cost: 1188, unit_price: 1470, group: "bike" },
  // Other equipment
  { code: "RT819-PH", desc_en: "RENTAL 819 PHONE MOUNT RENT", desc_zh: "", yen_cost: 0, hkd_cost: 0, unit_price: 0, group: "other" },
  { code: "RT819-SB-1D", desc_en: "RENTAL 819 SIDE BAG RENT 1ST DAY", desc_zh: "首天費用", yen_cost: 1100, hkd_cost: 55, unit_price: 60, group: "case" },
  { code: "RT819-SB-2D", desc_en: "RENTAL 819 SIDE BAG RENT DAY", desc_zh: "第二天或以後每天費用", yen_cost: 220, hkd_cost: 11, unit_price: 10, group: "case" },
  { code: "RT819-SC-1D", desc_en: "RENTAL 819 SIDE CASE RENT 1ST DAY", desc_zh: "首天費用", yen_cost: 1650, hkd_cost: 82.5, unit_price: 90, group: "case" },
  { code: "RT819-SC-2D", desc_en: "RENTAL 819 SIDE CASE RENT DAY", desc_zh: "第二天或以後每天費用", yen_cost: 330, hkd_cost: 16.5, unit_price: 20, group: "case" },
  { code: "RT819-TC-1D", desc_en: "RENTAL 819 TOP CASE RENT 1ST DAY", desc_zh: "首天費用", yen_cost: 1650, hkd_cost: 82.5, unit_price: 90, group: "case" },
  { code: "RT819-TC-2D", desc_en: "RENTAL 819 TOP CASE RENT DAY", desc_zh: "第二天或以後每天費用", yen_cost: 330, hkd_cost: 16.5, unit_price: 20, group: "case" },
  // Hong Kong value-add services (billed by Helmet King, not confirmed with Japan)
  { code: "HK-CARDO", desc_en: "CARDO PACKTALK BOLD INTERCOM RENTAL", desc_zh: "對講機租賃", yen_cost: 0, hkd_cost: 0, unit_price: 200, group: "hk" },
];

export const RT819_GROUP_LABELS: Record<Rt819Item["group"], string> = {
  bike: "車租 Bike rent",
  insurance: "車輛保險 Insurance",
  mamoride: "MamoRide 補償",
  helmet: "頭盔 Helmet",
  case: "箱／袋 Case & bag",
  hk: "香港增值服務 HK add-on",
  other: "其他 Other",
};

/** Full invoice-line label as shown on the SI template: "<EN> <ZH>". */
export function rt819Label(item: Rt819Item): string {
  return item.desc_zh ? `${item.desc_en} ${item.desc_zh}` : item.desc_en;
}
