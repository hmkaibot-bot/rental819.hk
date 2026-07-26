// Rental819 nationwide branch coverage, grouped by the same 11 regions as the
// master site. Region headers link to the Japanese Rental819 store list, anchored
// to that region (…/shop/shopList#area_N).

export const JAPAN_SHOPLIST = "https://www.rental819.com/shop/shopList";

export interface CoverageRegion {
  area: number; // rental819.com shopList area anchor
  zh: string; // 關東區
  zhShort: string; // 關東  (map label)
  en: string; // Kanto
  prefectures: string[]; // Japanese prefecture names
  color: string; // region colour (matches the map)
  px: number; // label position over the map image, % of width
  py: number; // label position over the map image, % of height
}

// px/py are the label anchor over public/images/japan-regions-map.png (a square
// 2048×2048 image), expressed as a percentage so they stay aligned at any size.
export const coverageRegions: CoverageRegion[] = [
  { area: 1, zh: "北海道區", zhShort: "北海道", en: "Hokkaido", prefectures: ["北海道"], color: "#8fbfe0", px: 81, py: 15 },
  { area: 2, zh: "東北區", zhShort: "東北", en: "Tohoku", prefectures: ["秋田県", "岩手県", "福島県", "宮城県", "山形県"], color: "#8288c6", px: 67, py: 44 },
  { area: 4, zh: "甲信越區", zhShort: "甲信越", en: "Koshinetsu", prefectures: ["長野県", "新潟県"], color: "#a7c66b", px: 55, py: 61 },
  { area: 5, zh: "北陸區", zhShort: "北陸", en: "Hokuriku", prefectures: ["福井県", "石川県"], color: "#c2ad84", px: 45, py: 62 },
  { area: 3, zh: "關東區", zhShort: "關東", en: "Kanto", prefectures: ["東京都", "神奈川県", "千葉県", "茨城県", "栃木県", "埼玉県", "群馬県"], color: "#e4cf62", px: 66, py: 67 },
  { area: 6, zh: "東海區", zhShort: "東海", en: "Tokai", prefectures: ["静岡県", "愛知県", "三重県"], color: "#6ba3c2", px: 52, py: 73 },
  { area: 7, zh: "近畿區", zhShort: "近畿", en: "Kinki", prefectures: ["滋賀県", "大阪府", "京都府"], color: "#86bd68", px: 43, py: 76 },
  { area: 8, zh: "中国區", zhShort: "中国", en: "Chugoku", prefectures: ["岡山県", "広島県", "山口県"], color: "#cbbf76", px: 29, py: 72 },
  { area: 9, zh: "四国區", zhShort: "四国", en: "Shikoku", prefectures: ["愛媛県"], color: "#e0805f", px: 30, py: 83 },
  { area: 10, zh: "九州區", zhShort: "九州", en: "Kyushu", prefectures: ["福岡県", "長崎県", "熊本県", "大分県", "鹿児島県"], color: "#e79aa6", px: 15, py: 86 },
  { area: 11, zh: "沖繩區", zhShort: "沖繩", en: "Okinawa", prefectures: ["沖縄県"], color: "#a89a86", px: 20, py: 40 },
];
