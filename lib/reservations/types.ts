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

/**
 * Supplier cost broken down per line item (JPY), mirroring the master Excel's
 * cost columns. cost_jpy is the gross total of these; the rebate is always 10%
 * of base_rental and is tracked separately in rebate_jpy.
 */
export interface CostItems {
  base_rental?: number; // 基本車租
  insurance?: number; // 保險
  mamoride?: number; // MAMO RIDE 保險
  helmet?: number; // 頭盔
  topcase?: number; // 尾箱
  sidebag?: number; // 側袋
  pannier?: number; // 側箱
  etc?: number; // ETC
}

/** Ordered cost lines for the 開單 form, in the master Excel's column order. */
export const COST_ITEM_LABELS: { key: keyof CostItems; zh: string; ja: string }[] = [
  { key: "base_rental", zh: "基本車租", ja: "基本車両料金" },
  { key: "insurance", zh: "保險", ja: "保険" },
  { key: "mamoride", zh: "MAMO RIDE 保險", ja: "MAMO RIDE 保険" },
  { key: "helmet", zh: "頭盔", ja: "ヘルメット" },
  { key: "topcase", zh: "尾箱", ja: "トップケース" },
  { key: "sidebag", zh: "側袋", ja: "サイドバッグ" },
  { key: "pannier", zh: "側箱", ja: "サイドケース" },
  { key: "etc", zh: "ETC", ja: "ETC" },
];

/** Japan rebates 10% of the base bike rental. */
export const REBATE_RATE = 0.1;

export function costItemsTotal(c: CostItems | null | undefined): number {
  if (!c) return 0;
  return COST_ITEM_LABELS.reduce((sum, l) => sum + (Number(c[l.key]) || 0), 0);
}

export function rebateFromCostItems(c: CostItems | null | undefined): number {
  return Math.round((Number(c?.base_rental) || 0) * REBATE_RATE);
}

export interface InvoiceItem {
  description: string;
  qty: number;
  unit_price: number; // HKD
  /**
   * Per-line discount, in percent off the list unit price. Optional: every
   * invoice written before this field existed simply has no discount, and
   * `lineAmount` treats undefined as 0.
   */
  discount_pct?: number;
  amount: number; // HKD — already net of discount_pct
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
  // 收款渠道 the customer paid through (LIVI / AW / BOC MAC).
  payment_channel: string | null;
  paid_to_supplier: boolean;
  supplier_paid_date: string | null;
  cost_jpy: number | null; // gross supplier cost (¥), before the Japan rebate
  /**
   * Japan rebates 10% of the base bike rental back to us, so the net supplier
   * cost is cost_jpy − rebate_jpy. Stored as a positive figure (the master
   * Excel carries it as its own negative column, e.g. 基本車租 ¥55,440 → −¥5,544).
   */
  rebate_jpy?: number | null;
  /** Per-item supplier cost (¥). cost_jpy is the gross total of these lines. */
  cost_items?: CostItems | null;
  revenue_hkd?: number | null; // 單價（港幣） customer price (imported)
  cost_hkd?: number | null; // 單價成本（港元） gross HK$ cost (imported, pre-rebate)
  settlement: Record<string, unknown>;

  notes: string | null;
  // Nullable in the schema, and staff may now clear it from the 預約 card.
  source: string | null;
  created_at: string;
  updated_at: string;
}

/** Ordered pipeline with labels + colour token. */
export const STATUS_FLOW: {
  key: ReservationStatus;
  zh: string;
  en: string;
  ja: string;
  tone: string;
}[] = [
  { key: "new", zh: "未處理", en: "New", ja: "未対応", tone: "bg-slate-100 text-slate-700" },
  { key: "notified_jp", zh: "已通知日本", en: "Notified Japan", ja: "日本へ連絡済", tone: "bg-amber-100 text-amber-800" },
  { key: "awaiting_si", zh: "待SI", en: "Awaiting SI", ja: "SI 待ち", tone: "bg-indigo-100 text-indigo-800" },
  { key: "awaiting_payment", zh: "待付款", en: "Awaiting payment", ja: "入金待ち", tone: "bg-orange-100 text-orange-800" },
  { key: "confirmed", zh: "已確認預定", en: "Confirmed", ja: "予約確定", tone: "bg-emerald-100 text-emerald-800" },
];

export const TERMINAL_STATUS: {
  key: ReservationStatus;
  zh: string;
  en: string;
  ja: string;
  tone: string;
}[] = [
  { key: "change_pending", zh: "變更溝通中", en: "Change pending", ja: "変更調整中", tone: "bg-violet-100 text-violet-800" },
  { key: "cancelled", zh: "顧客無反應/已取消", en: "No response / cancelled", ja: "連絡なし／キャンセル", tone: "bg-rose-100 text-rose-700" },
];

/**
 * 已確認預定 is the point the booking is treated as money-in, so it may only be
 * set once 客人付款日期 is on record. Both places staff can move a status — the
 * 預約 card and the dashboard's inline dropdown — run this one rule so the two
 * can never drift apart.
 */
export function confirmNeedsPaidDate(
  nextStatus: string,
  customerPaidDate: string | null | undefined,
): boolean {
  return nextStatus === "confirmed" && !String(customerPaidDate ?? "").trim();
}

/**
 * Sending the Japan email marks the booking 已通知日本 — but only ever forwards.
 * Re-sending a mail for a booking that is already at 待SI or beyond must not
 * drag it back down the pipeline, and a cancelled/變更溝通中 booking (neither is
 * in STATUS_FLOW) keeps the status staff deliberately set.
 */
export function statusAfterJpEmail(current: string): ReservationStatus | null {
  const target = STATUS_FLOW.findIndex((s) => s.key === "notified_jp");
  const now = STATUS_FLOW.findIndex((s) => s.key === current);
  return now >= 0 && now < target ? "notified_jp" : null;
}

/**
 * Sending the customer confirmation email marks the booking 已確認預定 — but,
 * like statusAfterJpEmail, only ever forwards: a booking already confirmed
 * stays put on a re-send, and cancelled/變更溝通中 (not in STATUS_FLOW) keep
 * whatever staff set. The caller still applies confirmNeedsPaidDate — the
 * confirmation email does not get to skip the 客人付款日期 gate.
 */
export function statusAfterCustomerEmail(current: string): ReservationStatus | null {
  const target = STATUS_FLOW.findIndex((s) => s.key === "confirmed");
  const now = STATUS_FLOW.findIndex((s) => s.key === current);
  return now >= 0 && now < target ? "confirmed" : null;
}

/** 收款渠道 options for the customer payment dropdown. */
export const PAYMENT_CHANNELS = ["LIVI", "AW", "BOC MAC", "HSB"] as const;

const ALL = [...STATUS_FLOW, ...TERMINAL_STATUS];

export function statusMeta(status: ReservationStatus) {
  return ALL.find((s) => s.key === status) ?? STATUS_FLOW[0];
}

/**
 * Language-ability answers. These are a fixed list, not free text: the value is
 * passed on to Rental819 Japan verbatim, and it is the shop's cue for whether
 * staff can brief the rider at hand-over — so it has to be one of the phrases
 * they already read, not whatever the customer types.
 *
 * `value` is the master Excel's own wording and is what gets stored, whichever
 * language the form was filled in. (Bookings taken on /en used to store English
 * variants like "Able to communicate in English (Fluent)", which meant the same
 * answer arrived in Japan two different ways.) `zh` / `en` / `ja` are labels
 * only.
 */
export interface AbilityOption {
  value: string;
  zh: string;
  en: string;
  ja: string;
}

export const JP_ABILITY_OPTIONS: AbilityOption[] = [
  {
    value: "無（日本語話せない）",
    zh: "不懂日語",
    en: "None",
    ja: "日本語は話せない",
  },
  {
    value: "可簡易日語溝通（簡単な日本語会話が出来る）",
    zh: "可簡單日語溝通",
    en: "Basic — simple conversation",
    ja: "簡単な日本語会話が出来る",
  },
  {
    value: "可日語溝通（日本語会話が出来る）",
    zh: "可日語溝通",
    en: "Conversational",
    ja: "日本語会話が出来る",
  },
];

export const EN_ABILITY_OPTIONS: AbilityOption[] = [
  {
    value: "無（Low/None）",
    zh: "不懂英語",
    en: "None",
    ja: "英語は話せない",
  },
  {
    value: "可簡易英語溝通（Daily Conversation）",
    zh: "可簡單英語溝通",
    en: "Daily conversation",
    ja: "簡単な英会話が出来る",
  },
  {
    value: "可英語溝通（Fluent）",
    zh: "可流利英語溝通",
    en: "Fluent",
    ja: "英語で会話が出来る",
  },
];

/** Addon labels for display. `ja` is used by the admin's Japanese mode. */
export const ADDON_LABELS: {
  key: keyof ReservationAddons;
  zh: string;
  en: string;
  ja: string;
}[] = [
  { key: "cardo", zh: "CARDO 對講機", en: "CARDO intercom", ja: "CARDO インカム" },
  { key: "topcase", zh: "尾箱", en: "Top case", ja: "トップケース" },
  { key: "sidebag", zh: "側袋", en: "Side bag", ja: "サイドバッグ" },
  { key: "pannier", zh: "側箱", en: "Pannier", ja: "パニアケース" },
  // Short forms matching the master Excel's own column headers, so the label is
  // the same here and in the reservation table.
  { key: "full_face", zh: "全盔", en: "Full-face helmet", ja: "フルフェイス" },
  { key: "open_face", zh: "開面盔", en: "Open-face helmet", ja: "オープンフェイス" },
  { key: "mamoride", zh: "MamoRide 保險", en: "MamoRide insurance", ja: "MamoRide 保険" },
  { key: "etc", zh: "ETC", en: "ETC card", ja: "ETC カード" },
  { key: "shuttle_bus", zh: "穿梭巴士", en: "Shuttle bus", ja: "送迎バス" },
  { key: "luggage_storage", zh: "行李寄存", en: "Luggage storage", ja: "荷物預かり" },
];

/**
 * Rental819 pick-up branches — the full network of 99 stores across Japan,
 * grouped by region. Source: https://rental819.com/store/ (official store list).
 */
export const SHOP_AREAS: { area: string; shops: string[] }[] = [
  {
    area: "北海道",
    shops: [
      "千歳パーク店",
      "函館店",
      "札幌清田店",
      "新千歳空港店",
      "札幌白石店",
      "札幌店",
      "北見店",
    ],
  },
  {
    area: "東北",
    shops: [
      "岩手紫波店",
      "仙台泉店",
      "仙台店",
      "H-D宮城店",
      "秋田店",
      "山形店",
      "いわき店",
    ],
  },
  {
    area: "関東",
    shops: [
      "イオンつくば店",
      "竜ヶ崎店",
      "H-D塚原店",
      "宇都宮竹林店",
      "伊勢崎店",
      "北軽井沢店(2026年4月移転)",
      "BMW Motorrad 越谷店",
      "鳩ケ谷店",
      "Ducati埼玉南店",
      "H-D埼玉花園店",
      "和光店",
      "H-Dメガ松戸店",
      "茂原店",
      "柏店",
      "柏沼南店",
      "市川店",
      "池袋店",
      "三鷹店",
      "東村山店",
      "東府中店",
      "羽田店",
      "落合南長崎駅前店",
      "高円寺店",
      "八王子長沼店",
      "吉祥寺店",
      "八王子大塚店",
      "八王子駅前店",
      "阿佐ヶ谷店",
      "葛飾店",
      "お台場店",
      "大田中央店",
      "駒沢店",
      "大田店",
      "上野店",
      "世田谷代田店",
      "板橋店",
      "東名横浜店",
      "新山下店",
      "横浜店",
      "高津店",
    ],
  },
  {
    area: "甲信越",
    shops: ["新潟店", "長野店", "長野駅前店", "飯田店", "上田店"],
  },
  {
    area: "北陸",
    shops: ["福井店"],
  },
  {
    area: "東海",
    shops: [
      "南箱根店",
      "知立店",
      "イオンモール豊川店",
      "豊田店",
      "豊橋店",
      "中川店",
      "桑名店",
      "伊勢店",
    ],
  },
  {
    area: "近畿",
    shops: [
      "大津店",
      "京都十条店",
      "京都宝ヶ池店",
      "京都中央店",
      "京都伏見店",
      "京都山科店",
      "大阪国際空港店(伊丹空港)",
      "門真店",
      "関西国際空港店(関西空港)",
      "茨木彩都店",
      "東大阪店",
      "H-D須磨店",
      "西宮店",
    ],
  },
  {
    area: "四国",
    shops: ["松山店"],
  },
  {
    area: "九州",
    shops: [
      "福岡空港店",
      "福岡空港国内ターミナル店",
      "博多店",
      "小倉南店",
      "福岡城南店",
      "福岡南店",
      "佐世保店",
      "長崎道ノ尾店",
      "諫早店",
      "熊本空港店",
      "熊本店",
      "大分店",
      "鹿児島空港店",
      "鹿児島東谷山店",
    ],
  },
  {
    area: "沖縄",
    shops: ["H-D沖縄店", "沖縄とよみ店", "那覇空港店"],
  },
];

/** Flat list of every branch name (for validation / lookups). */
export const SHOPS = SHOP_AREAS.flatMap((a) => a.shops);
