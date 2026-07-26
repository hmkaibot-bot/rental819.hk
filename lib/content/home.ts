import type { Locale } from "@/lib/i18n";

export interface Feature {
  title: string;
  body: string;
  icon: "fleet" | "support" | "shield" | "gear" | "map" | "clock";
}

export interface Step {
  title: string;
  body: string;
}

export interface OfferCard {
  title: string;
  body: string;
  href: string;
  cta: string;
  image: string;
}

export interface HomeContent {
  hero: {
    badge: string;
    title: string;
    highlight: string;
    tagline: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    stats: { value: string; label: string }[];
  };
  featuresHead: { eyebrow: string; title: string; intro: string };
  features: Feature[];
  offersHead: { eyebrow: string; title: string; intro: string };
  offers: OfferCard[];
  stepsHead: { eyebrow: string; title: string; intro: string };
  steps: Step[];
  regionsHead: { eyebrow: string; title: string; intro: string };
  regions: { name: string; note: string }[];
  guideHead: { eyebrow: string; title: string; intro: string; cta: string };
  ctaBand: { title: string; subtitle: string };
}

export const homeContent: Record<Locale, HomeContent> = {
  "zh-hk": {
    hero: {
      badge: "頭盔王 × Rental819 官方合作夥伴",
      title: "在日本，親手駕馭你的",
      highlight: "電單車自駕遊",
      tagline: "體驗日本道路之美，感受日本二輪文化",
      subtitle:
        "由香港直接以中文預約，於全日本 99 間分店取車。由 125cc 到大型旅行電單車、Harley、越野車一應俱全，連保險、ETC、頭盔裝備一次過安排妥當。",
      primaryCta: "立即預約租車",
      secondaryCta: "WhatsApp 免費查詢",
      stats: [
        { value: "99", label: "全日本分店" },
        { value: "125cc–1800cc", label: "車款選擇" },
        { value: "中／粵語", label: "貼心支援" },
      ],
    },
    featuresHead: {
      eyebrow: "為何選擇 RENTAL819",
      title: "全日本最大電單車租賃網絡，港澳騎士專屬支援",
      intro:
        "由選車、預約到取車，全程以你熟悉的語言處理。無論你是首次挑戰日本自駕，還是資深騎士，都能輕鬆上路。",
    },
    features: [
      {
        icon: "fleet",
        title: "全日本最大車隊",
        body: "橫跨北海道至九州 99 間分店，數以千計車款任揀，熱門日子亦有充足選擇。",
      },
      {
        icon: "support",
        title: "中文／粵語支援",
        body: "香港團隊全程跟進，預約、行程、保險、路線一律用中文講清講楚，唔怕語言不通。",
      },
      {
        icon: "shield",
        title: "全面保險保障",
        body: "所有租車均包含基本車輛保險，並可加購免責額補償（NOC）及進階保障，安心上路。",
      },
      {
        icon: "gear",
        title: "裝備一次過安排",
        body: "頭盔、手套、ETC 卡、車架箱、導航等按需要準備，落機即可出發。",
      },
      {
        icon: "clock",
        title: "彈性租期",
        body: "由 4 小時、8 小時、1 天到多日，租期自由組合，短程試玩或長途縱走都啱。",
      },
      {
        icon: "map",
        title: "自駕團＋自由行",
        body: "想有人帶路？參加我們的電單車旅行團；想自由發揮？選自駕套票自己話事。",
      },
    ],
    offersHead: {
      eyebrow: "我們的服務",
      title: "三種方式，玩轉日本",
      intro: "由完全自由的租車，到有領隊帶路的旅行團，總有一種適合你。",
    },
    offers: [
      {
        title: "租車自駕",
        body: "自選車款、日期同取車分店，完全按自己節奏走遍日本。",
        href: "/rental",
        image: "/images/home/way-1.png",
        cta: "了解租車詳情",
      },
      {
        title: "電單車旅行團",
        body: "由經驗領隊帶路，路線、住宿、行程一手包辦，輕鬆享受騎旅。",
        href: "/tours",
        image: "/images/home/way-2.png",
        cta: "查看旅行團",
      },
      {
        title: "自駕套票",
        body: "租車＋住宿＋行程建議一次搞掂，最抵最方便的自由行組合。",
        href: "/packages",
        image: "/images/home/way-3.png",
        cta: "瀏覽套票",
      },
    ],
    stepsHead: {
      eyebrow: "簡單四步",
      title: "由香港到日本上路，就是這麼簡單",
      intro: "無需複雜手續，跟住以下步驟即可展開你的日本騎旅。",
    },
    steps: [
      { title: "選擇車款與日期", body: "揀選心水電單車、取車分店及租用日期。" },
      { title: "網上預約", body: "填寫預約表格，我們會以中文確認細節及報價。" },
      { title: "抵日取車", body: "帶齊駕照文件到分店，簡單手續後即可取車。" },
      { title: "出發自駕", body: "戴好裝備、設定導航，展開屬於你的日本公路旅程。" },
    ],
    regionsHead: {
      eyebrow: "熱門路線",
      title: "由北海道到沖繩，全日本任你馳騁",
      intro: "分店遍佈主要城市及機場，方便你就近取車，直達心儀路線。",
    },
    regions: [
      { name: "北海道", note: "無盡直路與大自然美景" },
      { name: "關東・東京", note: "近郊溫泉與富士山環線" },
      { name: "中部・立山", note: "阿爾卑斯山岳景觀公路" },
      { name: "關西・京阪", note: "古都文化與海岸線" },
      { name: "四國", note: "海岸山道與烏龍麵之旅" },
      { name: "九州", note: "火山、溫泉與環島公路" },
    ],
    guideHead: {
      eyebrow: "自駕攻略",
      title: "第一次日本自駕？由這裡開始",
      intro:
        "由所需證件、交通規則、保險、ETC，到行程與預算規劃，我們整理好一切你需要知道的資訊。",
      cta: "閱讀完整攻略",
    },
    ctaBand: {
      title: "準備好展開你的日本電單車之旅？",
      subtitle: "立即預約，或 WhatsApp 我們，讓香港團隊為你度身規劃。",
    },
  },

  en: {
    hero: {
      badge: "Helmet King × Rental819 — official partner",
      title: "Ride Japan your way on a",
      highlight: "self-drive motorcycle tour",
      tagline: "Experience the beauty of Japan's roads and the spirit of its riding culture",
      subtitle:
        "Book from Hong Kong in your own language and pick up at any of 99 branches across Japan. From 125cc to big tourers, Harleys and off-road machines — with insurance, ETC and gear all sorted for you.",
      primaryCta: "Book a rental",
      secondaryCta: "Free WhatsApp enquiry",
      stats: [
        { value: "99", label: "branches in Japan" },
        { value: "125–1800cc", label: "range of bikes" },
        { value: "中 / 粵 / EN", label: "rider support" },
      ],
    },
    featuresHead: {
      eyebrow: "Why RENTAL819",
      title: "Japan's largest rental network, with support built for Hong Kong & Macau riders",
      intro:
        "From choosing a bike to picking it up, the whole journey is handled in a language you're comfortable with — whether it's your first ride in Japan or your fiftieth.",
    },
    features: [
      {
        icon: "fleet",
        title: "Japan's largest fleet",
        body: "99 branches from Hokkaido to Kyushu with thousands of bikes — real availability, even on peak dates.",
      },
      {
        icon: "support",
        title: "Chinese & Cantonese support",
        body: "A Hong Kong team walks you through booking, routes, insurance and paperwork — no language barrier.",
      },
      {
        icon: "shield",
        title: "Full insurance cover",
        body: "Every rental includes basic vehicle insurance, with optional NOC and premium cover for total peace of mind.",
      },
      {
        icon: "gear",
        title: "Gear sorted for you",
        body: "Helmets, gloves, ETC card, panniers and navigation prepared as needed — land and ride.",
      },
      {
        icon: "clock",
        title: "Flexible rental periods",
        body: "From 4 hours, 8 hours and a full day to multi-day rentals — pick the duration that fits, a quick spin or a long tour.",
      },
      {
        icon: "map",
        title: "Guided tours & self-drive",
        body: "Want a leader? Join a guided tour. Want freedom? Take a self-drive package and set your own pace.",
      },
    ],
    offersHead: {
      eyebrow: "What we offer",
      title: "Three ways to experience Japan",
      intro: "From fully independent rentals to led group tours, there's a fit for every rider.",
    },
    offers: [
      {
        title: "Rent & self-drive",
        body: "Choose your bike, dates and pick-up branch and explore Japan entirely at your own pace.",
        href: "/rental",
        image: "/images/home/way-1.png",
        cta: "Rental details",
      },
      {
        title: "Guided motorcycle tours",
        body: "An experienced leader handles the route, stays and itinerary — you just enjoy the ride.",
        href: "/tours",
        image: "/images/home/way-2.png",
        cta: "See tours",
      },
      {
        title: "Self-drive packages",
        body: "Bike, accommodation and a suggested itinerary bundled together — the easy-value way to go independent.",
        href: "/packages",
        image: "/images/home/way-3.png",
        cta: "Browse packages",
      },
    ],
    stepsHead: {
      eyebrow: "Four simple steps",
      title: "From Hong Kong to the open road in Japan",
      intro: "No complicated process — just follow these steps to start your ride.",
    },
    steps: [
      { title: "Pick a bike & dates", body: "Choose your motorcycle, pick-up branch and rental dates." },
      { title: "Book online", body: "Send the booking form and we confirm the details and price in Chinese or English." },
      { title: "Collect in Japan", body: "Bring your licence documents to the branch and ride away after a quick check-in." },
      { title: "Hit the road", body: "Gear up, set your navigation and start your Japan road trip." },
    ],
    regionsHead: {
      eyebrow: "Popular routes",
      title: "From Hokkaido to Okinawa — Japan is yours to ride",
      intro: "Branches across major cities and airports make it easy to pick up close to your route.",
    },
    regions: [
      { name: "Hokkaido", note: "Endless straights and wide-open nature" },
      { name: "Kanto · Tokyo", note: "Onsen day-trips and the Mt. Fuji loop" },
      { name: "Chubu · Tateyama", note: "Japan Alps mountain roads" },
      { name: "Kansai · Kyoto/Osaka", note: "Old-capital culture and coastline" },
      { name: "Shikoku", note: "Coastal passes and udon country" },
      { name: "Kyushu", note: "Volcanoes, onsen and island loops" },
    ],
    guideHead: {
      eyebrow: "Ride guide",
      title: "First time riding in Japan? Start here",
      intro:
        "Licences and documents, traffic rules, insurance, ETC, plus itinerary and budget planning — everything you need to know, organised.",
      cta: "Read the full guide",
    },
    ctaBand: {
      title: "Ready to start your Japan motorcycle trip?",
      subtitle: "Book now, or WhatsApp us and let the Hong Kong team plan it with you.",
    },
  },
};
