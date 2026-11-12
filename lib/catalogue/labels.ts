import type { Locale } from "@/lib/i18n";

/** Official maker names → the label we show. Booking values stay in Japanese. */
const MAKERS: Record<string, Record<Locale, string>> = {
  ホンダ: { "zh-hk": "本田", en: "Honda" },
  ヤマハ: { "zh-hk": "山葉", en: "Yamaha" },
  スズキ: { "zh-hk": "鈴木", en: "Suzuki" },
  カワサキ: { "zh-hk": "川崎", en: "Kawasaki" },
  ハーレーダビッドソン: { "zh-hk": "哈雷", en: "Harley-Davidson" },
  ハーレー: { "zh-hk": "哈雷", en: "Harley-Davidson" },
  BMW: { "zh-hk": "BMW", en: "BMW" },
  ドゥカティ: { "zh-hk": "杜卡迪", en: "Ducati" },
  トライアンフ: { "zh-hk": "凱旋", en: "Triumph" },
  KTM: { "zh-hk": "KTM", en: "KTM" },
  アプリリア: { "zh-hk": "阿普利亞", en: "Aprilia" },
  ロイヤルエンフィールド: { "zh-hk": "皇家恩菲爾德", en: "Royal Enfield" },
  ベスパ: { "zh-hk": "偉士牌", en: "Vespa" },
  ピアッジオ: { "zh-hk": "比亞喬", en: "Piaggio" },
};

const TYPES: Record<string, Record<Locale, string>> = {
  スクーター: { "zh-hk": "綿羊", en: "Scooter" },
  "ビッグスクーター": { "zh-hk": "大型綿羊", en: "Big scooter" },
  ネイキッド: { "zh-hk": "街車", en: "Naked" },
  スーパースポーツ: { "zh-hk": "仿賽", en: "Supersport" },
  "アドベンチャー・ツアラー": { "zh-hk": "越野旅行", en: "Adventure tourer" },
  ツアラー: { "zh-hk": "旅行", en: "Tourer" },
  "アメリカン・クルーザー": { "zh-hk": "美式巡航", en: "Cruiser" },
  "ミニバイク・カブ": { "zh-hk": "小型綿羊・Cub", en: "Mini / Cub" },
  オフロード: { "zh-hk": "越野", en: "Off-road" },
  モタード: { "zh-hk": "越野街車", en: "Motard" },
};

const COLOURS: Record<string, Record<Locale, string>> = {
  黒: { "zh-hk": "黑", en: "Black" },
  白: { "zh-hk": "白", en: "White" },
  赤: { "zh-hk": "紅", en: "Red" },
  青: { "zh-hk": "藍", en: "Blue" },
  銀: { "zh-hk": "銀", en: "Silver" },
  シルバー: { "zh-hk": "銀", en: "Silver" },
  グレー: { "zh-hk": "灰", en: "Grey" },
  灰: { "zh-hk": "灰", en: "Grey" },
  緑: { "zh-hk": "綠", en: "Green" },
  黃: { "zh-hk": "黃", en: "Yellow" },
  黄: { "zh-hk": "黃", en: "Yellow" },
  オレンジ: { "zh-hk": "橙", en: "Orange" },
  金: { "zh-hk": "金", en: "Gold" },
  茶: { "zh-hk": "啡", en: "Brown" },
  ピンク: { "zh-hk": "粉紅", en: "Pink" },
  紫: { "zh-hk": "紫", en: "Purple" },
};

export function makerLabel(maker: string, locale: Locale): string {
  return MAKERS[maker]?.[locale] ?? maker;
}

export function typeLabel(type: string, locale: Locale): string {
  return TYPES[type]?.[locale] ?? type;
}

export function colourLabel(colour: string, locale: Locale): string {
  return COLOURS[colour]?.[locale] ?? colour;
}

/** Value stored on the booking as bike preference #1. Japanese, as the branch list is. */
export function bikePrefValue(bike: {
  maker: string;
  model: string;
  modelYear: number | null;
  bikeClass: string | null;
}): string {
  const year = bike.modelYear ? ` (${bike.modelYear})` : "";
  const cls = bike.bikeClass ? ` / ${bike.bikeClass}` : "";
  return `${bike.maker} ${bike.model}${year}${cls}`.slice(0, 160);
}
