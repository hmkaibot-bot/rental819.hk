/** HK$ reference rents — the single source for the /guide/fees rate table and the "from" price on the CTAs. */
export const RENT_TABLE = [
  { cls: "P-1", h4: 220, h8: 245, d1: 295, dayN: 195, late: 50 },
  { cls: "P-2", h4: 330, h8: 365, d1: 440, dayN: 295, late: 75 },
  { cls: "P-3", h4: 605, h8: 675, d1: 810, dayN: 540, late: 135 },
  { cls: "P-4", h4: 770, h8: 855, d1: 1030, dayN: 685, late: 170 },
  { cls: "P-5", h4: 880, h8: 980, d1: 1175, dayN: 785, late: 195 },
  { cls: "P-6", h4: 990, h8: 1100, d1: 1320, dayN: 880, late: 220 },
  { cls: "P-7", h4: 1320, h8: 1470, d1: 1765, dayN: 1175, late: 295 },
] as const;
export const RENT_FROM_HKD = Math.min(...RENT_TABLE.map((r) => r.d1)); // 295
export const RENT_TO_HKD = Math.max(...RENT_TABLE.map((r) => r.d1)); // 1765
export const hkd = (n: number) => `HK$${n.toLocaleString("en-US")}`;

/** Rows for the /guide/fees rate table; its column heads already say 港元 / HK$, so cells are "$220". */
export const RENT_TABLE_ROWS: string[][] = RENT_TABLE.map((r) => [
  r.cls,
  ...[r.h4, r.h8, r.d1, r.dayN, r.late].map((n) => `$${n.toLocaleString("en-US")}`),
]);
