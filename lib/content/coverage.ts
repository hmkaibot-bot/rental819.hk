// Rental819 nationwide branch coverage, grouped by the same 11 regions as the
// master site. Region headers link to the Japanese Rental819 store list, anchored
// to that region (…/shop/shopList#area_N).

export const JAPAN_SHOPLIST = "https://www.rental819.com/shop/shopList";

export interface CoverageRegion {
  area: number; // rental819.com shopList area anchor
  zh: string; // 關東區
  zhShort: string; // 關東  (map label)
  en: string; // Kanto
  // Prefecture names in the Traditional Chinese form HK/Macau riders actually
  // search for (靜岡, 廣島) rather than the Japanese script (静岡県, 広島県).
  prefectures: string[];
  color: string; // region colour (matches the map)
  px: number; // label position over the map image, % of width
  py: number; // label position over the map image, % of height
}

// px/py are the label anchor over public/images/japan-regions-map.png (a square
// 2048×2048 image), expressed as a percentage so they stay aligned at any size.
export const coverageRegions: CoverageRegion[] = [
  { area: 1, zh: "北海道區", zhShort: "北海道", en: "Hokkaido", prefectures: ["北海道"], color: "#8fbfe0", px: 81, py: 15 },
  { area: 2, zh: "東北區", zhShort: "東北", en: "Tohoku", prefectures: ["秋田", "岩手", "福島", "宮城", "山形"], color: "#8288c6", px: 67, py: 44 },
  { area: 4, zh: "甲信越區", zhShort: "甲信越", en: "Koshinetsu", prefectures: ["長野", "新潟"], color: "#a7c66b", px: 55, py: 61 },
  { area: 5, zh: "北陸區", zhShort: "北陸", en: "Hokuriku", prefectures: ["福井", "石川"], color: "#c2ad84", px: 45, py: 62 },
  { area: 3, zh: "關東區", zhShort: "關東", en: "Kanto", prefectures: ["東京", "神奈川", "千葉", "茨城", "栃木", "埼玉", "群馬"], color: "#e4cf62", px: 66, py: 67 },
  { area: 6, zh: "東海區", zhShort: "東海", en: "Tokai", prefectures: ["靜岡", "愛知", "三重"], color: "#6ba3c2", px: 52, py: 73 },
  { area: 7, zh: "近畿區", zhShort: "近畿", en: "Kinki", prefectures: ["滋賀", "大阪", "京都"], color: "#86bd68", px: 43, py: 76 },
  { area: 8, zh: "中國區", zhShort: "中國", en: "Chugoku", prefectures: ["岡山", "廣島", "山口"], color: "#cbbf76", px: 29, py: 72 },
  { area: 9, zh: "四國區", zhShort: "四國", en: "Shikoku", prefectures: ["愛媛"], color: "#e0805f", px: 30, py: 83 },
  { area: 10, zh: "九州區", zhShort: "九州", en: "Kyushu", prefectures: ["福岡", "長崎", "熊本", "大分", "鹿兒島"], color: "#e79aa6", px: 15, py: 86 },
  { area: 11, zh: "沖繩區", zhShort: "沖繩", en: "Okinawa", prefectures: ["沖繩"], color: "#a89a86", px: 20, py: 40 },
];
