// Status set mirrors the master Excel 狀態 dropdown (data-validation list) exactly.
export type ReservationStatus =
  | "new" // 未處理
  | "notified_jp" // 已通知日本
  | "awaiting_si" // 待SI
  | "awaiting_payment" // 待付款
  | "confirmed" // 已確認預定
  | "change_pending" // 變更溝通中
  | "cancelled"; // 顧客無反應/已取消

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
  { key: "new", zh: "未處理", en: "New", tone: "bg-slate-100 text-slate-700" },
  { key: "notified_jp", zh: "已通知日本", en: "Notified Japan", tone: "bg-amber-100 text-amber-800" },
  { key: "awaiting_si", zh: "待SI", en: "Awaiting SI", tone: "bg-indigo-100 text-indigo-800" },
  { key: "awaiting_payment", zh: "待付款", en: "Awaiting payment", tone: "bg-orange-100 text-orange-800" },
  { key: "confirmed", zh: "已確認預定", en: "Confirmed", tone: "bg-emerald-100 text-emerald-800" },
];

export const TERMINAL_STATUS: {
  key: ReservationStatus;
  zh: string;
  en: string;
  tone: string;
}[] = [
  { key: "change_pending", zh: "變更溝通中", en: "Change pending", tone: "bg-violet-100 text-violet-800" },
  { key: "cancelled", zh: "顧客無反應/已取消", en: "No response / cancelled", tone: "bg-rose-100 text-rose-700" },
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
