export type ReservationStatus =
  | "new"
  | "sent_to_jp"
  | "confirmed"
  | "invoiced"
  | "paid"
  | "customer_confirmed"
  | "settled"
  | "cancelled"
  | "no_response";

export interface ReservationAddons {
  cardo?: boolean; // CARDO 對講機
  topcase?: boolean; // 尾箱
  sidebag?: boolean; // 側袋
  pannier?: boolean; // 側箱
  full_face?: number; // 全盔 (數量)
  open_face?: number; // 開面盔 (數量)
  mamoride?: boolean; // MamoRide 保險
  etc?: boolean; // ETC
  shuttle_bus?: boolean; // 穿梭巴士
  luggage_storage?: boolean; // 行李寄存
}

export interface InvoiceItem {
  description: string;
  qty: number;
  unit_price: number; // HKD
  amount: number; // HKD
}

export interface Reservation {
  id: string;
  booking_ref: string | null;
  status: ReservationStatus;
  request_date: string; // ISO date

  name_zh: string | null;
  name_en: string | null;
  gender: string | null;
  dob: string | null;
  email: string | null;
  hk_phone: string | null;
  hk_address: string | null;
  jp_address: string | null;
  jp_phone: string | null;
  japanese_ability: string | null;
  english_ability: string | null;
  emergency_contact: string | null;
  emergency_phone: string | null;

  shop: string | null;
  bike_pref_1: string | null;
  bike_pref_2: string | null;
  bike_pref_3: string | null;
  confirmed_bike: string | null;
  pickup_date: string | null;
  pickup_time: string | null;
  return_date: string | null;
  return_time: string | null;
  addons: ReservationAddons;
  promo: string | null;

  si_number: string | null;
  invoice_date: string | null;
  invoice_items: InvoiceItem[];
  customer_paid_date: string | null;
  paid_to_supplier: boolean;
  supplier_paid_date: string | null;
  cost_jpy: number | null;
  revenue_hkd?: number | null; // 單價（港幣） customer price (imported)
  cost_hkd?: number | null; // 單價成本（港元） real HK$ cost (imported)
  settlement: Record<string, unknown>;

  notes: string | null;
  source: string;
  created_at: string;
  updated_at: string;
}

/** Ordered pipeline with labels + colour token. */
export const STATUS_FLOW: {
  key: ReservationStatus;
  zh: string;
  en: string;
  tone: string;
}[] = [
  { key: "new", zh: "新預約", en: "New", tone: "bg-accent-100 text-accent-800" },
  { key: "sent_to_jp", zh: "已向日本確認", en: "Sent to JP", tone: "bg-amber-100 text-amber-800" },
  { key: "confirmed", zh: "日本已確認", en: "Confirmed", tone: "bg-sky-100 text-sky-800" },
  { key: "invoiced", zh: "已開單", en: "Invoiced", tone: "bg-indigo-100 text-indigo-800" },
  { key: "paid", zh: "客人已付款", en: "Paid", tone: "bg-emerald-100 text-emerald-800" },
  { key: "customer_confirmed", zh: "已發確認信", en: "Customer confirmed", tone: "bg-teal-100 text-teal-800" },
  { key: "settled", zh: "月結已對帳", en: "Settled", tone: "bg-slate-200 text-slate-700" },
];

export const TERMINAL_STATUS: {
  key: ReservationStatus;
  zh: string;
  en: string;
  tone: string;
}[] = [
  { key: "cancelled", zh: "已取消", en: "Cancelled", tone: "bg-rose-100 text-rose-700" },
  { key: "no_response", zh: "客人無反應", en: "No response", tone: "bg-slate-200 text-slate-600" },
];

const ALL = [...STATUS_FLOW, ...TERMINAL_STATUS];

export function statusMeta(status: ReservationStatus) {
  return ALL.find((s) => s.key === status) ?? STATUS_FLOW[0];
}

/** Addon labels for display. */
export const ADDON_LABELS: { key: keyof ReservationAddons; zh: string }[] = [
  { key: "cardo", zh: "CARDO 對講機" },
  { key: "topcase", zh: "尾箱" },
  { key: "sidebag", zh: "側袋" },
  { key: "pannier", zh: "側箱" },
  { key: "full_face", zh: "全盔" },
  { key: "open_face", zh: "開面盔" },
  { key: "mamoride", zh: "MamoRide 保險" },
  { key: "etc", zh: "ETC" },
  { key: "shuttle_bus", zh: "穿梭巴士" },
  { key: "luggage_storage", zh: "行李寄存" },
];

/** Rental819 pick-up branches seen in operations (extend as needed). */
export const SHOPS = [
  "大阪伊丹空港店",
  "お台場店 (東京)",
  "福岡空港店",
  "那覇空港店",
  "新千歳空港店 (北海道)",
  "仙台店",
  "名古屋店",
  "京都店",
  "廣島店",
  "松山店 (四國)",
];
