import type { Locale } from "@/lib/i18n";

export interface BikeCategory {
  name: string;
  cc: string;
  note: string;
}
export interface RentalContent {
  hero: { eyebrow: string; title: string; intro: string };
  categoriesHead: string;
  categoriesIntro: string;
  categories: BikeCategory[];
  catalogue: {
    head: string;
    intro: string;
    shop: string;
    shopPlaceholder: string;
    chooseShop: string;
    pickup: string;
    return: string;
    type: string;
    maker: string;
    any: string;
    search: string;
    clear: string;
    results: string;
    available: string;
    unavailable: string;
    pickDates: string;
    book: string;
    reference: string;
    quoteNote: string;
    perDay: string;
    days: string;
    noBikes: string;
    noShops: string;
    emptyFilter: string;
    dateOrder: string;
    datePast: string;
    areaEmpty: string;
    colours: string;
    noPhoto: string;
    footnote: string;
    browse: string;
    freeEquip: string;
    paidEquip: string;
  };
  coverageHead: string;
  coverageIntro: string;
  // The region/prefecture list itself lives in lib/content/coverage.ts, which is
  // what <CoverageMap> renders on /rental.
  priceHead: string;
  /** Column heads for the rate table; the rows come from RENT_TABLE (lib/content/prices.ts). */
  priceCols: [string, string, string];
  priceNote: string;
  priceMore: string;
  docsHead: string;
  docsBody: string;
  docsMore: string;
  howHead: string;
  howIntro: string;
  /** The same steps, in the same order, as STEP 1–7 of /guide/pickup. */
  steps: string[];
  ctaTitle: string;
  ctaSubtitle: string;
}

const stepsZh = ["確認證件", "選擇分店", "選擇電單車", "選擇日期", "填寫租車表格", "租車當日", "還車"];
const stepsEn = [
  "Check your documents",
  "Choose a branch",
  "Choose a motorcycle",
  "Pick your dates",
  "Send the rental form",
  "Pick-up day",
  "Return the bike",
];

export const rentalContent: Record<Locale, RentalContent> = {
  "zh-hk": {
    hero: {
      eyebrow: "租車",
      title: "在日本租電單車自駕遊",
      intro:
        "由 125cc 綿羊到大型旅行電單車、Harley 及越野車，先在本頁揀分店同日期，再由香港團隊以港幣確認報價，落機即可上路。",
    },
    categoriesHead: "車款選擇",
    categoriesIntro: "每間分店可租車款各有不同，填表時列出心儀首三位，我們會按供應情況為你安排。",
    categories: [
      { name: "綿羊 / 輕型", cc: "50–125cc", note: "市區代步輕鬆易駕（125cc 以下不能上高速）" },
      { name: "街車 / Naked", cc: "250–400cc", note: "靈活好玩，適合山路與city ride" },
      { name: "旅行 / Touring", cc: "400–750cc", note: "長途舒適，適合公路旅行" },
      { name: "大型旅行 / Big Tourer", cc: "750cc 以上", note: "GoldWing、大羊等長途首選" },
      { name: "Harley / 美式", cc: "883cc 以上", note: "巡航風格，感受美式騎旅" },
      { name: "越野 / Adventure", cc: "250–1200cc", note: "上山下海，探索林道與郊野" },
    ],
    catalogue: {
      head: "可租車款",
      intro: "揀分店同取還日期，查看該店車款及供應情況。所示為港幣參考價，最終報價由香港團隊確認。",
      shop: "分店",
      shopPlaceholder: "請選擇分店",
      chooseShop: "請先選擇分店並查詢，查看該分店的車款。",
      pickup: "取車日期",
      return: "還車日期",
      type: "類型",
      maker: "廠牌",
      any: "全部",
      search: "查看供應",
      clear: "清除",
      results: "{n} 款",
      available: "所選日期可預約",
      unavailable: "所選日期未能預約",
      pickDates: "選擇日期以查看供應",
      book: "預約",
      reference: "參考價",
      quoteNote: "最終報價於確認後提供",
      perDay: "/ 天",
      days: "{n} 天",
      noBikes: "這間分店暫時未有車款資料。可改選其他分店，或直接填寫預約表格。",
      noShops: "車款目錄尚未同步。你仍可填寫預約表格，香港團隊會為你安排。",
      emptyFilter: "沒有符合篩選的車款。",
      dateOrder: "還車日期必須在取車日期之後。",
      datePast: "取車日期必須是今天或之後。",
      areaEmpty: "這個地區暫時未有分店列入目錄。",
      colours: "顏色",
      noPhoto: "暫無相片",
      footnote: "供應情況每日更新。所選日期未能預約的車款仍可提交表格，香港團隊會再作安排。",
      browse: "瀏覽車款",
      freeEquip: "免費配備",
      paidEquip: "付費配備",
    },
    coverageHead: "全日本取車網絡",
    coverageIntro: "分店遍佈全國主要地區及機場，租還車須於同一分店辦理。",
    priceHead: "租金參考（港元）",
    priceCols: ["等級", "1 天（24 小時）", "第 2 天以後每天"],
    priceNote:
      "已包含強制及任意保險，不包括燃油、高速公路費及泊車；車輛損傷補償及裝備另計。以上為參考價，最終報價以預約確認為準。",
    priceMore: "完整價目表",
    docsHead: "租車需要甚麼證件？",
    docsBody:
      "在日本取車當日須同時出示：香港／澳門正式駕駛執照、國際駕駛執照（IDP）及護照，三者缺一不可；暫準執照（P 牌）恕不受理，租車人須年滿 18 歲。",
    docsMore: "詳情：香港車牌可以租車嗎？",
    howHead: "租車流程",
    howIntro: `由確認證件到還車，共 ${stepsZh.length} 個簡單步驟。`,
    steps: stepsZh,
    ctaTitle: "揀好車款，即刻預約",
    ctaSubtitle: "填寫預約表格或 WhatsApp 我們，香港團隊會以中文為你確認一切。",
  },
  en: {
    hero: {
      eyebrow: "Rent a bike",
      title: "Rent a motorcycle & self-drive Japan",
      intro:
        "From 125cc scooters to big tourers, Harleys and adventure bikes. Choose a branch and your dates here, then our Hong Kong team confirms the HK$ quote before you land and ride.",
    },
    categoriesHead: "Choose your bike",
    categoriesIntro:
      "Each branch stocks different models. List your top three on the form and we'll arrange based on availability.",
    categories: [
      { name: "Scooter / light", cc: "50–125cc", note: "Easy city runabouts (under 125cc can't use expressways)" },
      { name: "Naked / street", cc: "250–400cc", note: "Nimble and fun for mountain and city rides" },
      { name: "Touring", cc: "400–750cc", note: "Comfortable for long road trips" },
      { name: "Big tourer", cc: "750cc+", note: "GoldWing and large tourers for long distances" },
      { name: "Harley / cruiser", cc: "883cc+", note: "Cruiser style — the American road-trip feel" },
      { name: "Adventure", cc: "250–1200cc", note: "On- and off-road exploration of trails and countryside" },
    ],
    catalogue: {
      head: "Bikes you can rent",
      intro:
        "Choose a branch and your dates to see what is free. Prices shown are HK$ reference rates; the Hong Kong team confirms the final quote.",
      shop: "Branch",
      shopPlaceholder: "Select a branch",
      chooseShop: "Select a branch and search to see its bikes.",
      pickup: "Pick-up date",
      return: "Return date",
      type: "Type",
      maker: "Maker",
      any: "Any",
      search: "Check availability",
      clear: "Clear",
      results: "{n} bikes",
      available: "Free for your dates",
      unavailable: "Not free for your dates",
      pickDates: "Choose dates to check availability",
      book: "Book",
      reference: "Reference price",
      quoteNote: "Final quote after confirmation",
      perDay: "/ day",
      days: "{n} days",
      noBikes: "No bikes are listed for this branch yet. Try another branch, or send the booking form.",
      noShops: "The bike catalogue has not been synced yet. You can still send the booking form and the Hong Kong team will arrange it.",
      emptyFilter: "No bikes match these filters.",
      dateOrder: "The return date must be after the pick-up date.",
      datePast: "The pick-up date must be today or later.",
      areaEmpty: "No branches are listed in this region yet.",
      colours: "Colours",
      noPhoto: "No photo",
      footnote:
        "Availability is refreshed daily. You can still send the form for a bike that is not free — the Hong Kong team will follow up.",
      browse: "Browse bikes",
      freeEquip: "Free equipment",
      paidEquip: "Paid equipment",
    },
    coverageHead: "Nationwide pick-up network",
    coverageIntro:
      "Branches across every major region and airport. Pick-up and return must be at the same branch.",
    priceHead: "Reference rates (HK$)",
    priceCols: ["Class", "1 day (24 hrs)", "Each day from day 2"],
    priceNote:
      "Includes compulsory and voluntary insurance; excludes fuel, expressway tolls and parking. Vehicle-damage compensation and gear are charged separately. Reference prices — your final quote is confirmed after you book.",
    priceMore: "Full price list",
    docsHead: "What documents do I need?",
    docsBody:
      "On pick-up day you must show all three: your full Hong Kong/Macau licence, an International Driving Permit (IDP) and your passport. Probationary (P) licences are not accepted, and the renter must be 18 or older.",
    docsMore: "Details",
    howHead: "The rental process",
    howIntro: `${stepsEn.length} simple steps, from checking your documents to returning the bike.`,
    steps: stepsEn,
    ctaTitle: "Picked your bike? Book it",
    ctaSubtitle: "Send the booking form or WhatsApp us — the Hong Kong team confirms everything for you.",
  },
};
