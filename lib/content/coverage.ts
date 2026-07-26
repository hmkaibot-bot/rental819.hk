// Rental819 nationwide branch coverage, grouped by the same 11 regions as the
// master site. Region headers link to the Japanese Rental819 store list, anchored
// to that region (…/shop/shopList#area_N).

export const JAPAN_SHOPLIST = "https://www.rental819.com/shop/shopList";

export interface CoverageRegion {
  area: number; // rental819.com shopList area anchor
  zh: string; // 關東區
  zhShort: string; // 關東  (map tile)
  en: string; // Kanto
  prefectures: string[]; // Japanese prefecture names
  color: string; // map tile fill
  x: number; // schematic map position (viewBox 0 0 400 520)
  y: number;
}

export const coverageRegions: CoverageRegion[] = [
  { area: 1, zh: "北海道區", zhShort: "北海道", en: "Hokkaido", prefectures: ["北海道"], color: "#8fbfe0", x: 285, y: 18 },
  { area: 2, zh: "東北區", zhShort: "東北", en: "Tohoku", prefectures: ["秋田県", "岩手県", "福島県", "宮城県", "山形県"], color: "#8288c6", x: 262, y: 104 },
  { area: 4, zh: "甲信越區", zhShort: "甲信越", en: "Koshinetsu", prefectures: ["長野県", "新潟県"], color: "#a7c66b", x: 188, y: 150 },
  { area: 5, zh: "北陸區", zhShort: "北陸", en: "Hokuriku", prefectures: ["福井県", "石川県"], color: "#c2ad84", x: 90, y: 152 },
  { area: 3, zh: "關東區", zhShort: "關東", en: "Kanto", prefectures: ["東京都", "神奈川県", "千葉県", "茨城県", "栃木県", "埼玉県", "群馬県"], color: "#e4cf62", x: 288, y: 190 },
  { area: 6, zh: "東海區", zhShort: "東海", en: "Tokai", prefectures: ["静岡県", "愛知県", "三重県"], color: "#6ba3c2", x: 200, y: 230 },
  { area: 7, zh: "近畿區", zhShort: "近畿", en: "Kinki", prefectures: ["滋賀県", "大阪府", "京都府"], color: "#86bd68", x: 120, y: 260 },
  { area: 8, zh: "中国區", zhShort: "中国", en: "Chugoku", prefectures: ["岡山県", "広島県", "山口県"], color: "#cbbf76", x: 22, y: 252 },
  { area: 9, zh: "四国區", zhShort: "四国", en: "Shikoku", prefectures: ["愛媛県"], color: "#e0805f", x: 110, y: 340 },
  { area: 10, zh: "九州區", zhShort: "九州", en: "Kyushu", prefectures: ["福岡県", "長崎県", "熊本県", "大分県", "鹿児島県"], color: "#e79aa6", x: 8, y: 342 },
  { area: 11, zh: "沖繩區", zhShort: "沖繩", en: "Okinawa", prefectures: ["沖縄県"], color: "#a89a86", x: 8, y: 452 },
];
