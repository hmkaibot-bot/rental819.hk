import type { Locale } from "@/lib/i18n";
import { site } from "@/lib/site";

export interface Tour {
  id: string;
  date: string; // ISO departure date, "" for on-request
  dateLabel: string;
  region: string;
  title: string;
  duration: string;
  priceFrom: number | null; // HK$, null = enquire
  image: string;
  description: string;
  upcoming: boolean;
}

export interface Package {
  id: string;
  title: string;
  region: string;
  tiers: string;
  priceFrom: number;
  blurb: string;
  /** Roads and places on this route, all named elsewhere in the repo (roads.ts / tours). */
  highlights: string[];
}

/**
 * The printed leaflet for each package — day-by-day itinerary, the full P3–P7
 * bike and price table (both with and without the travel component) and the
 * booking terms. Keyed by package id so both locales share one set of files.
 *
 * Served from /public rather than linked to Drive, so the download keeps
 * working if the Drive sharing changes and is never gated behind a Google
 * sign-in. The size is part of the data because it is shown before the tap:
 * these are 4–8 MB files and that matters on mobile data.
 */
export const packageLeaflets: Record<string, { file: string; mb: number }> = {
  "osaka-shoryudo": { file: "/packages/osaka-shoryudo.pdf", mb: 4.5 },
  "kyushu-aso": { file: "/packages/kyushu-aso.pdf", mb: 5.9 },
  "okinawa-island": { file: "/packages/okinawa-island.pdf", mb: 5.1 },
  "tokyo-initiald": { file: "/packages/tokyo-initiald.pdf", mb: 7.7 },
};

/**
 * Who actually organises and sells the tour products. Required disclosure under
 * the HK Travel Agents Ordinance; the licensee and licence number come from
 * site.travelAgent so there is a single source of truth.
 */
export const providerNote: Record<Locale, string> = {
  "zh-hk": `以下電單車旅行團由 ${site.travelAgent.name}（旅行代理商牌照號碼 ${site.travelAgent.licence}）主辦，並於 26adventure.com 接受報名；RENTAL819 香港負責租車安排及港澳團友支援。`,
  en: `These tours are organised by ${site.travelAgent.name} (HK Travel Agent Licence No. ${site.travelAgent.licence}) and booked on 26adventure.com. RENTAL819 Hong Kong arranges the motorcycles and supports Hong Kong and Macau riders.`,
};

// Departure dates relative to the site's reference date (2026-07-19).
export const tours: Record<Locale, Tour[]> = {
  "zh-hk": [
    {
      id: "hokkaido-2026-07-30",
      date: "2026-07-30",
      dateLabel: "2026年7月30日",
      region: "北海道",
      title: "北海道・極點探索之旅",
      duration: "8日7夜",
      priceFrom: 19800,
      image: "/images/tours/hokkaido-2026-07-30.jpg",
      description:
        "為期 8 天的電單車行程，前往日本極北點，沿途欣賞壯麗海岸線。騎行至四季彩之丘的花田、以清澈水流聞名的白鬚瀑布、如畫的美瑛丘陵，以及神秘的摩周湖與知床峠展望台。",
      upcoming: true,
    },
    {
      id: "fuji-izu-2026-08-23",
      date: "2026-08-23",
      dateLabel: "2026年8月23日",
      region: "富士山・伊豆",
      title: "富士山伊豆・花火大會之旅",
      duration: "4日3夜",
      priceFrom: 13800,
      image:
        "",
      description:
        "熱海海上花火大會自 1952 年起舉辦，是熱海的名物活動。銀色花火填滿夜空，如白晝般明亮，配合富士山與伊豆半島的壯麗景色，感動保證。",
      upcoming: true,
    },
    {
      id: "tohoku-2026-09-20",
      date: "2026-09-20",
      dateLabel: "2026年9月20日",
      region: "東北",
      title: "東北・三陸海岸線",
      duration: "5日4夜",
      priceFrom: 15800,
      image: "/images/tours/tohoku-2026-09-20.jpg",
      description:
        "行程包括四季皆美的十和田湖、擁有瀑布與蜿蜒小道的奧入瀨溪流、日本三大靈場之一的恐山，以及見證東日本大地震的奇蹟一本松。自然之美與深厚文化歷史並存。",
      upcoming: true,
    },
    {
      id: "kanto-koyo-2026-10-24",
      date: "2026-10-24",
      dateLabel: "2026年10月24日",
      region: "關東",
      title: "關東・紅葉追楓團",
      duration: "5日4夜",
      priceFrom: 14800,
      image: "/images/tours/kanto-koyo-2026-10-24.jpg",
      description:
        "專為電單車愛好者設計的秋季旅程。於蘆之湖畔欣賞秀麗美景，騎行景觀山道維納斯公路，途中造訪古色古香的赤城神社與箱根神社，享受靜謐氛圍。",
      upcoming: true,
    },
    {
      id: "custom-group",
      date: "",
      dateLabel: "自訂出發日期",
      region: "全日本",
      title: "車會／團體／公司包團服務",
      duration: "彈性",
      priceFrom: null,
      image: "/images/tours/custom-group.jpg",
      description:
        "專為小組／團體／公司而設的獨立包團服務。多條參考路線靈活修訂、經驗豐富領航員專業解說、後勤車全程接載行李及緊急支援。憑自駕遊發票更可享頭盔王門市裝備低至 7 折。建議 6 人起。",
      upcoming: true,
    },
    {
      id: "kansai-sakura-2026-04-08",
      date: "2026-04-08",
      dateLabel: "2026年4月8日",
      region: "關西",
      title: "關西白川鄉・二輪賞櫻之旅",
      duration: "5日4夜",
      priceFrom: 13800,
      image:
        "/images/tours/kansai-sakura-2026-04-08.jpg",
      description:
        "前往比叡山與伊吹山蜿蜒山道，沿琵琶湖、海津大崎與千里濱凪沙道路在沙灘上馳騁，於白川鄉體驗古色古香，再到兼六園欣賞日本庭園之雅緻。",
      upcoming: false,
    },
    {
      id: "shikoku-2026-07-01",
      date: "2026-07-01",
      dateLabel: "2026年7月1日",
      region: "四國",
      title: "四國・秀峰清流團",
      duration: "6日5夜",
      priceFrom: 15800,
      image: "/images/tours/shikoku-2026-07-01.jpg",
      description:
        "深入四國壯麗風光：大步危峽谷、四萬十川河畔、足摺 skyline 景觀山道，以及古色古香的祖谷藤蔓橋，海岸線美景完美收官。",
      upcoming: false,
    },
    {
      id: "kyushu-aso-2026-04-30",
      date: "2026-04-30",
      dateLabel: "2026年4月30日",
      region: "九州",
      title: "九州・阿蘇山之旅",
      duration: "5日4夜",
      priceFrom: 13800,
      image: "/images/tours/kyushu-aso-2026-04-30.jpg",
      description:
        "結合自然景觀與文化體驗的旅程。由福岡出發，穿越祐德稻荷神社、雲仙地獄與阿蘇牛奶之路，並到訪太宰府天滿宮感受傳統日本文化。",
      upcoming: false,
    },
  ],
  en: [
    {
      id: "hokkaido-2026-07-30",
      date: "2026-07-30",
      dateLabel: "30 Jul 2026",
      region: "Hokkaido",
      title: "Hokkaido · Northernmost Point Expedition",
      duration: "8 days / 7 nights",
      priceFrom: 19800,
      image: "/images/tours/hokkaido-2026-07-30.jpg",
      description:
        "An 8-day ride to Japan's northernmost point along magnificent coastlines — the flower fields of Shikisai-no-oka, Shirahige Falls, the painterly Biei hills, mysterious Lake Mashu and the Shiretoko Pass lookout.",
      upcoming: true,
    },
    {
      id: "fuji-izu-2026-08-23",
      date: "2026-08-23",
      dateLabel: "23 Aug 2026",
      region: "Mt. Fuji · Izu",
      title: "Mt. Fuji & Izu · Fireworks Festival Ride",
      duration: "4 days / 3 nights",
      priceFrom: 13800,
      image:
        "",
      description:
        "The Atami seaside fireworks festival, running since 1952, lights the night sky as bright as day — paired with the sweeping scenery of Mt. Fuji and the Izu Peninsula.",
      upcoming: true,
    },
    {
      id: "tohoku-2026-09-20",
      date: "2026-09-20",
      dateLabel: "20 Sep 2026",
      region: "Tohoku",
      title: "Tohoku · Sanriku Coastline",
      duration: "5 days / 4 nights",
      priceFrom: 15800,
      image: "/images/tours/tohoku-2026-09-20.jpg",
      description:
        "Lake Towada in every season, the waterfalls and trails of the Oirase stream, Mt. Osore — one of Japan's three great sacred sites — and the 'miracle lone pine' that survived the 2011 earthquake.",
      upcoming: true,
    },
    {
      id: "kanto-koyo-2026-10-24",
      date: "2026-10-24",
      dateLabel: "24 Oct 2026",
      region: "Kanto",
      title: "Kanto · Autumn Foliage Chase",
      duration: "5 days / 4 nights",
      priceFrom: 14800,
      image: "/images/tours/kanto-koyo-2026-10-24.jpg",
      description:
        "An autumn ride built for enthusiasts — lakeside views at Lake Ashi, the scenic Venus Line, and the tranquil Akagi and Hakone shrines amid peak foliage.",
      upcoming: true,
    },
    {
      id: "custom-group",
      date: "",
      dateLabel: "On-request dates",
      region: "Nationwide",
      title: "Club / Group / Corporate Private Tours",
      duration: "Flexible",
      priceFrom: null,
      image: "/images/tours/custom-group.jpg",
      description:
        "Private group tours for clubs, groups and companies. Flexible routes, experienced lead riders, a support vehicle carrying luggage and providing assistance throughout — plus up to 30% off gear at Helmet King with your tour invoice. Minimum 6 riders.",
      upcoming: true,
    },
    {
      id: "kansai-sakura-2026-04-08",
      date: "2026-04-08",
      dateLabel: "8 Apr 2026",
      region: "Kansai",
      title: "Kansai & Shirakawa-go · Cherry Blossom Ride",
      duration: "5 days / 4 nights",
      priceFrom: 13800,
      image:
        "/images/tours/kansai-sakura-2026-04-08.jpg",
      description:
        "Winding roads over Mt. Hiei and Mt. Ibuki, sand-riding along the Chirihama coast by Lake Biwa, the historic charm of Shirakawa-go and the elegant gardens of Kenroku-en.",
      upcoming: false,
    },
    {
      id: "shikoku-2026-07-01",
      date: "2026-07-01",
      dateLabel: "1 Jul 2026",
      region: "Shikoku",
      title: "Shikoku · Peaks & Clear Streams",
      duration: "6 days / 5 nights",
      priceFrom: 15800,
      image: "/images/tours/shikoku-2026-07-01.jpg",
      description:
        "Deep into Shikoku's scenery — the Oboke gorge, the Shimanto river, the Ashizuri Skyline mountain road and the traditional Iya vine bridge, finishing along a dramatic coastline.",
      upcoming: false,
    },
    {
      id: "kyushu-aso-2026-04-30",
      date: "2026-04-30",
      dateLabel: "30 Apr 2026",
      region: "Kyushu",
      title: "Kyushu · Mt. Aso Ride",
      duration: "5 days / 4 nights",
      priceFrom: 13800,
      image: "/images/tours/kyushu-aso-2026-04-30.jpg",
      description:
        "Nature and culture from Fukuoka — Yutoku Inari Shrine, Unzen Jigoku, the Aso Milk Road and Dazaifu Tenmangu, all on freewheeling open roads.",
      upcoming: false,
    },
  ],
};

export const packages: Record<Locale, Package[]> = {
  "zh-hk": [
    {
      id: "osaka-shoryudo",
      title: "大阪・昇龍道 二輪自駕套票",
      region: "大阪／中部",
      tiers: "3日 / 4日 / 5日",
      priceFrom: 5680,
      blurb: "由大阪出發走昇龍道，租車連住宿一次過搞掂，自由編排行程。",
      highlights: ["大阪", "白川鄉", "千里濱沙灘公路", "兼六園"],
    },
    {
      id: "kyushu-aso",
      title: "九州・阿蘇山 二輪自駕套票",
      region: "九州",
      tiers: "3日 / 4日 / 5日",
      priceFrom: 4480,
      blurb: "阿蘇火山與牛奶之路的經典九州路線，租車＋住宿套票最抵玩。",
      highlights: ["阿蘇牛奶之路", "阿蘇 Panorama Line", "山並 Highway", "福岡"],
    },
    {
      id: "okinawa-island",
      title: "沖繩・海島 二輪自駕套票",
      region: "沖繩",
      tiers: "3日 / 4日",
      priceFrom: 4880,
      blurb: "環繞碧海藍天的沖繩海島騎旅，輕鬆寫意的入門自駕之選。",
      highlights: ["沖繩本島", "沖繩海中道路"],
    },
    {
      id: "tokyo-initiald",
      title: "東京・頭文字D 二輪自駕套票",
      region: "東京／關東",
      tiers: "3日 / 4日 / 5日",
      priceFrom: 5480,
      blurb: "朝聖《頭文字D》經典山路，暢遊關東名所的租車住宿組合。",
      highlights: ["榛名山（秋名山）", "赤城山", "碓冰峠", "伊呂波坂"],
    },
  ],
  en: [
    {
      id: "osaka-shoryudo",
      title: "Osaka · Shoryudo Self-Drive Package",
      region: "Osaka / Chubu",
      tiers: "3 / 4 / 5 days",
      priceFrom: 5680,
      blurb: "Ride the Shoryudo route from Osaka — bike and accommodation bundled, itinerary your call.",
      highlights: ["Osaka", "Shirakawa-go", "Chirihama Nagisa Driveway", "Kenroku-en"],
    },
    {
      id: "kyushu-aso",
      title: "Kyushu · Mt. Aso Self-Drive Package",
      region: "Kyushu",
      tiers: "3 / 4 / 5 days",
      priceFrom: 4480,
      blurb: "The classic Kyushu loop past Aso's volcano and Milk Road — the best-value bike + stay bundle.",
      highlights: ["Aso Milk Road", "Aso Panorama Line", "Yamanami Highway", "Fukuoka"],
    },
    {
      id: "okinawa-island",
      title: "Okinawa · Island Self-Drive Package",
      region: "Okinawa",
      tiers: "3 / 4 days",
      priceFrom: 4880,
      blurb: "An easy-going island ride under Okinawa's blue skies — a great first self-drive.",
      highlights: ["Okinawa main island", "Okinawa Kaichu Road"],
    },
    {
      id: "tokyo-initiald",
      title: "Tokyo · Initial D Self-Drive Package",
      region: "Tokyo / Kanto",
      tiers: "3 / 4 / 5 days",
      priceFrom: 5480,
      blurb: "Chase the Initial D mountain passes and Kanto highlights with a bike + stay combo.",
      highlights: ["Mt. Haruna (Akina)", "Mt. Akagi", "Usui Pass", "Irohazaka"],
    },
  ],
};
