/**
 * Admin-only i18n. The public site is zh-hk / en; the back office is used by
 * the Hong Kong team and by Japanese-speaking staff, so it switches between
 * 中文 and 日本語 instead.
 *
 * This module is deliberately free of `next/headers` so client islands can
 * import the types; the cookie is read in `lib/admin/lang.ts` (server-only) and
 * the resolved dictionary is passed down as a prop.
 */

export type AdminLang = "zh" | "ja";

export const ADMIN_LANG_COOKIE = "admin_lang";

export const ADMIN_LANGS: { key: AdminLang; label: string }[] = [
  { key: "zh", label: "中文" },
  { key: "ja", label: "日本語" },
];

export function isAdminLang(v: unknown): v is AdminLang {
  return v === "zh" || v === "ja";
}

/** Text around a single interpolated value: `${pre}${value}${post}`. */
export interface Parts {
  pre: string;
  post: string;
}
/** Text around two interpolated values: `${pre}${a}${mid}${b}${post}`. */
export interface Parts3 {
  pre: string;
  mid: string;
  post: string;
}

/** Reservation field labels — shared by the detail page and the new-booking form. */
interface FieldLabels {
  bookingRef: string;
  requestDate: string;
  status: string;
  promo: string;
  source: string;
  nameZh: string;
  nameEn: string;
  gender: string;
  male: string;
  female: string;
  dob: string;
  email: string;
  hkPhone: string;
  japaneseAbility: string;
  englishAbility: string;
  hkAddress: string;
  jpAddress: string;
  jpPhone: string;
  emergencyContact: string;
  emergencyPhone: string;
  shop: string;
  confirmedBike: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  bikePref1: string;
  bikePref2: string;
  bikePref3: string;
  fullHelmetQty: string;
  openHelmetQty: string;
  notes: string;
}

export interface AdminDict {
  nav: {
    badge: string;
    reservations: string;
    accounting: string;
    feeItems: string;
    logout: string;
    demo: string;
    langAria: string;
    viewerBadge: string;
    viewerNotice: string;
  };
  common: {
    save: string;
    saving: string;
    saved: string;
    update: string;
    cancel: string;
    all: string;
    dash: string;
    yes: string;
    no: string;
    backToList: string;
    print: string;
  };
  login: {
    subtitle: string;
    account: string;
    accountHint: string;
    error: string;
    password: string;
    submit: string;
  };
  dashboard: {
    title: string;
    // Interpolation is done with string parts rather than functions: several of
    // these dictionaries are handed to client components, and functions cannot
    // cross the server→client boundary.
    total: Parts;
    searched: Parts3;
    filtered: Parts3;
    searchPlaceholder: string;
    search: string;
    clear: string;
    newBooking: string;
    empty: string;
    statusFilterAria: string;
    paidDateRequired: string;
  };
  fields: FieldLabels;
  detail: {
    sectionBooking: string;
    refTaken: string;
    paidDateRequired: string;
    refRequired: string;
    dateRequired: string;
    sectionCustomer: string;
    sectionRental: string;
    sectionAddons: string;
    sectionNotes: string;
    sectionFlow: string;
    sectionNext: string;
    sectionBilling: string;
    existingSuffix: string;
    jpEmail: string;
    customerEmail: string;
    invoice: string;
    jpConfirmTitle: string;
    bikePlaceholder: string;
    grade: string;
    confirmAddons: string;
    cardoTitle: string;
    cardoCheck: string;
    printCardo: string;
    billingTitle: string;
    siNumber: string;
    costPerItem: string;
    costTotalNow: string;
    rebateLine: string;
    netPay: string;
    costHint: string;
    saveSiCost: string;
    customerPaidDate: string;
    settlementMoved: string;
    accountingModule: string;
    settlementMovedTail: string;
    costJpy: string;
    rebateJpy: string;
    netCostJpy: string;
    customerPaidOn: string;
    supplierPaidOn: string;
    paidToSupplier: string;
  };
  accounting: {
    title: string;
    toReservations: string;
    cardRevenue: string;
    cardCost: string;
    cardProfit: string;
    cardOutstanding: string;
    period: string;
    allYears: string;
    allMonths: string;
    monthSuffix: string;
    showing: Parts;
    resetFilters: string;
    selectAllAria: string;
    filterPlaceholder: string;
    filterAll: string;
    paid: string;
    unpaid: string;
    empty: string;
    totalRow: Parts;
    batch: Parts;
    supplierPayDate: string;
    markPaid: string;
    markUnpaid: string;
    updating: string;
    cols: {
      booking: string;
      customer: string;
      si: string;
      pickup: string;
      return: string;
      revenue: string;
      rebate: string;
      costJpy: string;
      costHkd: string;
      profit: string;
      supplier: string;
    };
  };
  items: {
    title: string;
    intro: string;
    toAccounting: string;
    colItem: string;
    colPrice: string;
    colCost: string;
    colYen: string;
    colMargin: string;
    dirty: Parts;
    hint: string;
    saveChanges: string;
    saving: string;
    savedOk: string;
  };
  invoice: {
    backTo: string;
    title: string;
    intro: string;
    siNo: string;
    date: string;
    paymentDate: string;
    deposit: string;
    fromCatalog: string;
    pickItem: string;
    colDesc: string;
    colUnitPrice: string;
    colQty: string;
    colAmount: string;
    deleteAria: string;
    addRow: string;
    total: string;
    saveAndInvoice: string;
    saveOnly: string;
    saving: string;
    savedOk: string;
    print: string;
  };
  email: {
    jpTitle: string;
    customerTitle: string;
    jpIntro: string;
    customerIntro: string;
    subject: string;
    body: string;
    copy: string;
    copyAll: string;
    copied: string;
    copyRichHint: string;
    to: string;
    cc: string;
    bcc: string;
    send: string;
    confirmSend: string;
    confirmHint: string;
    sending: string;
    sent: string;
    failed: string;
    notConfigured: string;
    noRecipient: string;
    readOnlyNotice: string;
    staffNameLabel: string;
    staffNamePlaceholder: string;
    staffNameRequired: string;
    statusAdvanced: string;
  };
  newBooking: {
    title: string;
    intro: string;
    bookingRefField: string;
    bookingRefPlaceholder: string;
    notesPlaceholder: string;
    create: string;
  };
  cardo: {
    backTo: string;
  };
}

const zh: AdminDict = {
  nav: {
    badge: "租車後台",
    reservations: "預約",
    accounting: "會計",
    feeItems: "收費項目",
    logout: "登出",
    demo: "示範模式（未連接資料庫）— 顯示的是範例資料，任何修改不會儲存。設定 Supabase 後即可正式使用。",
    langAria: "介面語言",
    viewerBadge: "檢視模式",
    viewerNotice: "此帳戶只可查看資料，不能修改或發送。",
  },
  common: {
    save: "儲存",
    saving: "儲存中…",
    saved: "已儲存 ✓",
    update: "更新",
    cancel: "取消",
    all: "全部",
    dash: "—",
    yes: "是",
    no: "否",
    backToList: "← 返回列表",
    print: "列印 / 儲存為 PDF",
  },
  login: {
    subtitle: "租車管理後台",
    account: "帳戶（管理員可留空）",
    accountHint: "inquiry@mototoursjapan.com",
    error: "密碼錯誤，請再試。",
    password: "管理密碼",
    submit: "登入",
  },
  dashboard: {
    title: "租車預約",
    total: { pre: "共 ", post: " 張預約" },
    searched: { pre: " · 搜尋「", mid: "」（", post: "）" },
    filtered: { pre: " · 篩選：", mid: "（", post: "）" },
    searchPlaceholder: "搜尋 編號／姓名／電郵／電話…",
    search: "搜尋",
    clear: "清除 ✕",
    newBooking: "＋ 新增預約",
    empty: "沒有符合的預約。",
    statusFilterAria: "篩選狀態",
    paidDateRequired: "要先填客人付款日期",
  },
  fields: {
    bookingRef: "預約編號",
    requestDate: "提交日期",
    status: "狀態",
    promo: "優惠",
    source: "來源",
    nameZh: "中文姓名",
    nameEn: "英文姓名",
    gender: "性別",
    male: "男性",
    female: "女性",
    dob: "出生年月日",
    email: "電郵",
    hkPhone: "香港聯絡電話",
    japaneseAbility: "日語能力",
    englishAbility: "英語能力",
    hkAddress: "原國籍居住地址",
    jpAddress: "日本住宿地址",
    jpPhone: "日本手提電話",
    emergencyContact: "緊急聯絡人",
    emergencyPhone: "緊急聯絡人號碼",
    shop: "出發店",
    confirmedBike: "確認車款",
    pickupDate: "取車日期",
    pickupTime: "取車時間",
    returnDate: "還車日期",
    returnTime: "還車時間",
    bikePref1: "首選車款",
    bikePref2: "次選車款",
    bikePref3: "第三選車款",
    fullHelmetQty: "全盔數量",
    openHelmetQty: "開面盔數量",
    notes: "備註",
  },
  detail: {
    sectionBooking: "預約",
    refTaken: "此預約編號已被其他預約使用，未有儲存。請改用另一個編號。",
    paidDateRequired: "要先填寫「客人付款日期」，先可以將狀態改為「已確認預定」。未有儲存。",
    refRequired: "預約編號不可留空，未有儲存。",
    dateRequired: "提交日期不可留空，未有儲存。",
    sectionCustomer: "客人資料",
    sectionRental: "租車詳情",
    sectionAddons: "配件及加購",
    sectionNotes: "備註",
    sectionFlow: "流程",
    sectionNext: "下一步",
    sectionBilling: "單據與月結",
    existingSuffix: "（現有）",
    jpEmail: "✉️ 生成日本預約信",
    customerEmail: "✉️ 生成客人確認信",
    invoice: "🧾 開單 / 生成 PDF",
    jpConfirmTitle: "日本確認（回覆後）",
    bikePlaceholder: "例：Rebel 1100 (2023) / ID：334",
    grade: "級別",
    confirmAddons: "確認配件及加購",
    cardoTitle: "CARDO 對講機（香港增值服務）",
    cardoCheck: "客人租用 CARDO（HK$200，開單自動加項）",
    printCardo: "列印 CARDO 租賃條款",
    billingTitle: "開單",
    siNumber: "單號 (SI)",
    costPerItem: "日元成本（逐項填寫）",
    costTotalNow: "成本合計（現時）",
    rebateLine: "回贈（基本車租 10%）",
    netPay: "實付",
    costHint: "合計及回贈由各項自動計算，毋須手動輸入；回贈固定為基本車租的 10%。",
    saveSiCost: "儲存單號及成本",
    customerPaidDate: "客人付款日期",
    settlementMoved: "月結（向日本供應商付款）已移至",
    accountingModule: "會計模組",
    settlementMovedTail: "，可一次過剔選多個預約記錄付款。",
    costJpy: "成本 (¥)",
    rebateJpy: "日本回贈 (¥)",
    netCostJpy: "實付成本 (¥)",
    customerPaidOn: "客人付款日",
    supplierPaidOn: "供應商付款日",
    paidToSupplier: "已向供應商付款",
  },
  accounting: {
    title: "會計 / 月結",
    toReservations: "預約列表 →",
    cardRevenue: "總收入 Revenue",
    cardCost: "總成本 Cost",
    cardProfit: "總利潤 Profit",
    cardOutstanding: "未付供應商 Outstanding",
    period: "統計期間（依取車日期）",
    allYears: "全部年份",
    allMonths: "全部月份",
    monthSuffix: " 月",
    showing: { pre: "顯示 ", post: " 張" },
    resetFilters: "重設篩選",
    selectAllAria: "全選",
    filterPlaceholder: "篩選…",
    filterAll: "全部",
    paid: "已付",
    unpaid: "未付",
    empty: "未有符合的預約。",
    totalRow: { pre: "總計（", post: " 張）" },
    batch: { pre: "月結：已選", post: "張" },
    supplierPayDate: "向供應商付款日期",
    markPaid: "標記已付款",
    markUnpaid: "標記未付款",
    updating: "更新中…",
    cols: {
      booking: "預約",
      customer: "客人",
      si: "單號 SI",
      pickup: "取車日期",
      return: "還車日期",
      revenue: "收入",
      rebate: "回贈 (¥)",
      costJpy: "成本 (¥)",
      costHkd: "成本 (HK$)",
      profit: "利潤",
      supplier: "供應商付款",
    },
  },
  items: {
    title: "收費項目",
    intro: "每個項目的售價（向客人收費）同成本，可即時修改；儲存後會套用到之後開的發票。",
    toAccounting: "會計 →",
    colItem: "項目 Item",
    colPrice: "售價 HK$",
    colCost: "成本 HK$",
    colYen: "成本 ¥",
    colMargin: "毛利 Margin",
    dirty: { pre: "", post: " 個項目已修改" },
    hint: "改動售價 / 成本後儲存，會即時套用到之後的發票",
    saveChanges: "儲存變更",
    saving: "儲存中…",
    savedOk: "已儲存 ✓",
  },
  invoice: {
    backTo: "← 返回預約",
    title: "開單",
    intro: "填入項目與金額，儲存後可列印或儲存為 PDF 發給客人。",
    siNo: "單號 (SI No.)",
    date: "單據日期 Date",
    paymentDate: "付款日期 Payment date",
    deposit: "訂金 Deposit (HK$)",
    fromCatalog: "由 RT819 項目表加入",
    pickItem: "＋ 選擇項目加入單據…",
    colDesc: "項目說明 Description",
    colUnitPrice: "單價 (HK$)",
    colQty: "數量",
    colAmount: "金額",
    deleteAria: "刪除",
    addRow: "+ 自訂一行",
    total: "總額",
    saveAndInvoice: "儲存並標記已開單",
    saveOnly: "只儲存",
    saving: "儲存中…",
    savedOk: "已儲存 ✓",
    print: "列印 / 儲存為 PDF",
  },
  email: {
    jpTitle: "日本 Rental819 預約信",
    customerTitle: "客人確認信",
    jpIntro: "由公司信箱直接發送給日本 Rental819（步驟 4），並副本給香港同事。",
    customerIntro: "揀語言後直接發送給客人；香港同事會收到密件副本。",
    subject: "主旨 Subject",
    body: "內容 Body",
    copy: "複製",
    copyAll: "複製全文",
    copied: "已複製 ✓",
    copyRichHint: "「複製全文」會複製保留格式版本：貼上 Gmail／Outlook 有齊表格框線同對齊。",
    to: "收件人",
    cc: "副本 Cc",
    bcc: "密件副本 Bcc",
    send: "直接發送",
    confirmSend: "確認發送",
    confirmHint: "再撳一次即會即時寄出。",
    sending: "發送中…",
    sent: "已發送 ✓",
    failed: "發送失敗，請重試。",
    notConfigured: "（設定 Gmail API 後可由後台直接發送。見 .env.example）",
    noRecipient: "此預約未有客人電郵地址，請先在客人資料填寫。",
    readOnlyNotice: "（檢視模式：此帳戶不能發送郵件）",
    staffNameLabel: "負責同事",
    staffNamePlaceholder: "輸入姓名",
    staffNameRequired: "請先輸入負責同事姓名",
    statusAdvanced: "（狀態已更新為「已通知日本」）",
  },
  newBooking: {
    title: "新增預約",
    intro: "直接喺後台建立一張預約。建立後狀態為「未處理」，可再喺詳情頁跟進。",
    bookingRefField: "預約編號（可留空後補）",
    bookingRefPlaceholder: "例：2026-050 / P-2025-010",
    notesPlaceholder: "內部備註…",
    create: "建立預約",
  },
  cardo: {
    backTo: "← 返回預約",
  },
};

const ja: AdminDict = {
  nav: {
    badge: "レンタル管理",
    reservations: "予約",
    accounting: "会計",
    feeItems: "料金項目",
    logout: "ログアウト",
    demo: "デモモード（データベース未接続）— 表示されているのはサンプルデータで、変更は保存されません。Supabase を設定すると本番運用できます。",
    langAria: "表示言語",
    viewerBadge: "閲覧モード",
    viewerNotice: "このアカウントは閲覧のみです。変更や送信はできません。",
  },
  common: {
    save: "保存",
    saving: "保存中…",
    saved: "保存しました ✓",
    update: "更新",
    cancel: "キャンセル",
    all: "すべて",
    dash: "—",
    yes: "はい",
    no: "いいえ",
    backToList: "← 一覧に戻る",
    print: "印刷 / PDF 保存",
  },
  login: {
    subtitle: "レンタル管理画面",
    account: "アカウント（管理者は空欄可）",
    accountHint: "inquiry@mototoursjapan.com",
    error: "パスワードが違います。もう一度お試しください。",
    password: "管理パスワード",
    submit: "ログイン",
  },
  dashboard: {
    title: "レンタル予約",
    total: { pre: "全 ", post: " 件の予約" },
    searched: { pre: " · 検索「", mid: "」（", post: " 件）" },
    filtered: { pre: " · 絞り込み：", mid: "（", post: " 件）" },
    searchPlaceholder: "予約番号・氏名・メール・電話を検索…",
    search: "検索",
    clear: "クリア ✕",
    newBooking: "＋ 予約を追加",
    empty: "該当する予約はありません。",
    statusFilterAria: "状態で絞り込み",
    paidDateRequired: "先にお客様の入金日を入力",
  },
  fields: {
    bookingRef: "予約番号",
    requestDate: "申込日",
    status: "状態",
    promo: "割引",
    source: "経路",
    nameZh: "中国語名",
    nameEn: "英語名",
    gender: "性別",
    male: "男性",
    female: "女性",
    dob: "生年月日",
    email: "メール",
    hkPhone: "連絡先番号",
    japaneseAbility: "日本語能力",
    englishAbility: "英語力",
    hkAddress: "香港住所",
    jpAddress: "日本の宿泊先",
    jpPhone: "日本の携帯番号",
    emergencyContact: "緊急連絡先",
    emergencyPhone: "緊急連絡先番号",
    shop: "店舗",
    confirmedBike: "確定車種",
    pickupDate: "レンタル日",
    pickupTime: "レンタル時間",
    returnDate: "返却日",
    returnTime: "返却時間",
    bikePref1: "第一希望車種",
    bikePref2: "第二希望車種",
    bikePref3: "第三希望車種",
    fullHelmetQty: "フルフェイス数量",
    openHelmetQty: "ジェット数量",
    notes: "備考",
  },
  detail: {
    sectionBooking: "予約",
    refTaken: "この予約番号は他の予約で使用中のため、保存されていません。別の番号をご使用ください。",
    paidDateRequired: "「お客様の入金日」を入力しないと、状態を「予約確定」に変更できません。保存されていません。",
    refRequired: "予約番号は空欄にできません。保存されていません。",
    dateRequired: "申込日は空欄にできません。保存されていません。",
    sectionCustomer: "お客様情報",
    sectionRental: "レンタル詳細",
    sectionAddons: "オプション・追加",
    sectionNotes: "備考",
    sectionFlow: "進行状況",
    sectionNext: "次のステップ",
    sectionBilling: "請求と月次精算",
    existingSuffix: "（現行）",
    jpEmail: "✉️ 日本向け予約メール",
    customerEmail: "✉️ お客様確認メール",
    invoice: "🧾 請求書作成 / PDF",
    jpConfirmTitle: "日本からの回答（確定内容）",
    bikePlaceholder: "例：Rebel 1100 (2023) / ID：334",
    grade: "グレード",
    confirmAddons: "オプションの確定",
    cardoTitle: "CARDO インカム（香港側の付加サービス）",
    cardoCheck: "お客様が CARDO をレンタル（HK$200・請求書に自動追加）",
    printCardo: "CARDO 貸出規約を印刷",
    billingTitle: "請求",
    siNumber: "SI 番号",
    costPerItem: "円建て原価（項目ごとに入力）",
    costTotalNow: "原価合計（現在）",
    rebateLine: "リベート（基本車両料金の 10%）",
    netPay: "実支払",
    costHint: "合計とリベートは各項目から自動計算されるため、手入力は不要です。リベートは基本車両料金の 10% で固定です。",
    saveSiCost: "SI 番号と原価を保存",
    customerPaidDate: "お客様の入金日",
    settlementMoved: "月次精算（日本の仕入先への支払）は",
    accountingModule: "会計モジュール",
    settlementMovedTail: "に移動しました。複数の予約をまとめて選び、支払処理ができます。",
    costJpy: "原価 (¥)",
    rebateJpy: "日本リベート (¥)",
    netCostJpy: "実支払原価 (¥)",
    customerPaidOn: "お客様入金日",
    supplierPaidOn: "仕入先支払日",
    paidToSupplier: "仕入先へ支払済",
  },
  accounting: {
    title: "会計 / 月次精算",
    toReservations: "予約一覧 →",
    cardRevenue: "総売上 Revenue",
    cardCost: "総原価 Cost",
    cardProfit: "総利益 Profit",
    cardOutstanding: "仕入先未払 Outstanding",
    period: "集計期間（レンタル日基準）",
    allYears: "すべての年",
    allMonths: "すべての月",
    monthSuffix: " 月",
    showing: { pre: "", post: " 件表示" },
    resetFilters: "絞り込みをリセット",
    selectAllAria: "すべて選択",
    filterPlaceholder: "絞り込み…",
    filterAll: "すべて",
    paid: "支払済",
    unpaid: "未払",
    empty: "該当する予約はありません。",
    totalRow: { pre: "合計（", post: " 件）" },
    batch: { pre: "月次精算：", post: "件を選択中" },
    supplierPayDate: "仕入先への支払日",
    markPaid: "支払済にする",
    markUnpaid: "未払に戻す",
    updating: "更新中…",
    cols: {
      booking: "予約",
      customer: "お客様",
      si: "SI 番号",
      pickup: "レンタル日",
      return: "返却日",
      revenue: "売上",
      rebate: "リベート (¥)",
      costJpy: "原価 (¥)",
      costHkd: "原価 (HK$)",
      profit: "利益",
      supplier: "仕入先支払",
    },
  },
  items: {
    title: "料金項目",
    intro: "各項目の販売価格（お客様への請求額）と原価をその場で変更できます。保存すると、以降に作成する請求書に反映されます。",
    toAccounting: "会計 →",
    colItem: "項目 Item",
    colPrice: "販売価格 HK$",
    colCost: "原価 HK$",
    colYen: "原価 ¥",
    colMargin: "粗利 Margin",
    dirty: { pre: "", post: " 件の項目を変更しました" },
    hint: "販売価格・原価を変更して保存すると、以降の請求書に反映されます",
    saveChanges: "変更を保存",
    saving: "保存中…",
    savedOk: "保存しました ✓",
  },
  invoice: {
    backTo: "← 予約に戻る",
    title: "請求書作成",
    intro: "項目と金額を入力し、保存後に印刷または PDF として保存してお客様へ送付できます。",
    siNo: "SI 番号 (SI No.)",
    date: "発行日 Date",
    paymentDate: "入金日 Payment date",
    deposit: "手付金 Deposit (HK$)",
    fromCatalog: "RT819 項目表から追加",
    pickItem: "＋ 項目を選んで追加…",
    colDesc: "項目説明 Description",
    colUnitPrice: "単価 (HK$)",
    colQty: "数量",
    colAmount: "金額",
    deleteAria: "削除",
    addRow: "+ 行を追加",
    total: "合計",
    saveAndInvoice: "保存して請求済にする",
    saveOnly: "保存のみ",
    saving: "保存中…",
    savedOk: "保存しました ✓",
    print: "印刷 / PDF 保存",
  },
  email: {
    jpTitle: "日本 Rental819 宛 予約メール",
    customerTitle: "お客様確認メール",
    jpIntro: "会社のメールアドレスから日本の Rental819 へ直接送信します（ステップ 4）。香港チームには Cc されます。",
    customerIntro: "言語を選んでお客様へ直接送信します。香港チームには Bcc で控えが届きます。",
    subject: "件名 Subject",
    body: "本文 Body",
    copy: "コピー",
    copyAll: "全文をコピー",
    copied: "コピーしました ✓",
    copyRichHint: "「全文をコピー」は書式付きでコピーされます。Gmail・Outlook に貼り付けると表の枠線と桁揃えが保持されます。",
    to: "宛先",
    cc: "Cc",
    bcc: "Bcc",
    send: "直接送信",
    confirmSend: "送信を確定",
    confirmHint: "もう一度押すとすぐに送信されます。",
    sending: "送信中…",
    sent: "送信しました ✓",
    failed: "送信に失敗しました。もう一度お試しください。",
    notConfigured: "（Gmail API を設定すると管理画面から直接送信できます。.env.example を参照）",
    noRecipient: "この予約にはお客様のメールアドレスがありません。先にお客様情報へ入力してください。",
    readOnlyNotice: "（閲覧モード：このアカウントはメールを送信できません）",
    staffNameLabel: "担当者",
    staffNamePlaceholder: "氏名を入力",
    staffNameRequired: "先に担当者名を入力してください",
    statusAdvanced: "（状態を「日本へ連絡済」に更新しました）",
  },
  newBooking: {
    title: "予約を追加",
    intro: "管理画面から予約を新規作成します。作成直後の状態は「未対応」で、詳細ページから続けて対応できます。",
    bookingRefField: "予約番号（空欄のまま後で入力可）",
    bookingRefPlaceholder: "例：2026-050 / P-2025-010",
    notesPlaceholder: "社内メモ…",
    create: "予約を作成",
  },
  cardo: {
    backTo: "← 予約に戻る",
  },
};

export const ADMIN_STRINGS: Record<AdminLang, AdminDict> = { zh, ja };

export function adminDict(lang: AdminLang): AdminDict {
  return ADMIN_STRINGS[lang] ?? ADMIN_STRINGS.zh;
}
