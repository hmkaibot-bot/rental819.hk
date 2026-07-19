import type { Locale } from "@/lib/i18n";

export interface BikeCategory {
  name: string;
  cc: string;
  note: string;
}
export interface Region {
  name: string;
  prefectures: string;
}
export interface RentalContent {
  hero: { eyebrow: string; title: string; intro: string };
  categoriesHead: string;
  categoriesIntro: string;
  categories: BikeCategory[];
  coverageHead: string;
  coverageIntro: string;
  regions: Region[];
  howHead: string;
  howIntro: string;
  ctaTitle: string;
  ctaSubtitle: string;
}

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
    regions: [
      { name: "北海道", prefectures: "北海道全域" },
      { name: "東北", prefectures: "秋田・岩手・福島・宮城・山形" },
      { name: "關東", prefectures: "東京・神奈川・千葉・茨城・栃木・埼玉・群馬" },
      { name: "甲信越", prefectures: "長野・新潟" },
      { name: "北陸", prefectures: "福井・石川" },
      { name: "東海", prefectures: "静岡・愛知・三重" },
      { name: "近畿", prefectures: "滋賀・大阪・京都" },
      { name: "中国", prefectures: "岡山・広島・山口" },
      { name: "四国", prefectures: "愛媛" },
      { name: "九州", prefectures: "福岡・長崎・熊本・大分・鹿児島" },
      { name: "沖繩", prefectures: "沖繩本島・機場" },
    ],
    howHead: "租車流程",
    howIntro: "由確認證件到取車，共 7 個簡單步驟。",
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
    regions: [
      { name: "Hokkaido", prefectures: "All of Hokkaido" },
      { name: "Tohoku", prefectures: "Akita · Iwate · Fukushima · Miyagi · Yamagata" },
      { name: "Kanto", prefectures: "Tokyo · Kanagawa · Chiba · Ibaraki · Tochigi · Saitama · Gunma" },
      { name: "Koshinetsu", prefectures: "Nagano · Niigata" },
      { name: "Hokuriku", prefectures: "Fukui · Ishikawa" },
      { name: "Tokai", prefectures: "Shizuoka · Aichi · Mie" },
      { name: "Kinki", prefectures: "Shiga · Osaka · Kyoto" },
      { name: "Chugoku", prefectures: "Okayama · Hiroshima · Yamaguchi" },
      { name: "Shikoku", prefectures: "Ehime" },
      { name: "Kyushu", prefectures: "Fukuoka · Nagasaki · Kumamoto · Oita · Kagoshima" },
      { name: "Okinawa", prefectures: "Okinawa main island · airport" },
    ],
    howHead: "The rental process",
    howIntro: "Seven simple steps from checking your documents to riding away.",
    ctaTitle: "Picked your bike? Book it",
    ctaSubtitle: "Send the booking form or WhatsApp us — the Hong Kong team confirms everything for you.",
  },
};
