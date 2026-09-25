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
        "由 125cc 綿羊到大型旅行電單車、Harley 及越野車，全日本 99 間分店任你就近取車。填表選車、我們以中文確認報價，落機即可上路。",
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
        "From 125cc scooters to big tourers, Harleys and adventure bikes — pick up at any of 99 branches nationwide. Send the form, we confirm your quote, and you ride from the moment you land.",
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
