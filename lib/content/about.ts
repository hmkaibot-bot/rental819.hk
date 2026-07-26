import type { Locale } from "@/lib/i18n";

export interface AboutContent {
  hero: { eyebrow: string; title: string; intro: string };
  storyEyebrow: string;
  storyTitle: string;
  brands: { name: string; year: string; body: string }[];
  roleTitle: string;
  roles: { title: string; body: string }[];
  stats: { value: string; label: string }[];
  wordTitle: string;
  word: string;
}

export const aboutContent: Record<Locale, AboutContent> = {
  "zh-hk": {
    hero: {
      eyebrow: "關於我們",
      title: "你最可靠的電單車旅行代理人",
      intro:
        "RENTAL819 香港是日本最大電單車租賃公司 Rental819 的指定香港及澳門區代理，隸屬頭盔王集團。我們為港澳車友提供一條龍式租車自駕遊旅行團、租車住宿自由行套票等服務。",
    },
    storyEyebrow: "OUR STORY",
    storyTitle: "品牌故事",
    brands: [
      {
        name: "頭盔王",
        year: "2014 年成立",
        body: "香港大型電單車用品網上購物與實體店平台；多個國際品牌指定香港區代理。由頭盔、騎士裝備、電單車改裝部件等產品一應俱全，款色數量多達數以萬計。",
      },
      {
        name: "RENTAL819 香港",
        year: "2017 年成立",
        body: "日本最大電單車租賃公司 Rental819 的指定香港及澳門區代理。我們為香港 / 澳門車友提供一條龍式租車、自駕遊旅行團、租車住宿自由行套票等服務。",
      },
      {
        name: "26KING",
        year: "2023 年成立",
        body: "26KING 為頭盔王附屬公司，除了為日歐品牌官方指定全新行貨車經銷商，另設資深車房團隊，提供星級電單車保養維修及改裝服務。由維修、改裝到車輛買賣，服務一應俱全！",
      },
      {
        name: "RentalBike.HK",
        year: "2024 年成立",
        body: "全港唯一合法旅客電單車租賃平台。專為訪港旅客及本地車手而設，全車隊均為 2024—2026 年最新型號，並提供 24/7 路面支援與 Premium Go CDW 保障，讓你以最安心方式探索香港。",
      },
    ],
    roleTitle: "我們為你安排的一切",
    roles: [
      {
        title: "日本電單車旅行團",
        body: "2017 年起已舉辦逾 20 次日本自駕遊旅行團，參與港澳團友達 500 人。所有旅行團設資深廣東話領隊、後勤車全程隨團支援，為你編排大小事務，讓你無憂無慮享受電單車旅行樂趣。",
      },
      {
        title: "電單車自駕遊套票",
        body: "Rental819 香港區指定代理、日本酒店集團協作伙伴。為港澳車友提供最優惠的自駕遊租車／住宿套票，同時提供最新、最齊全的自駕遊路線編排、建議及緊急支援服務。",
      },
      {
        title: "租車獨家優惠",
        body: "Rental819 獨家優惠；頭盔王會員獎分或禮劵回贈、同行優惠等不能盡錄，以最抵價錢享受最完滿旅程。",
      },
    ],
    stats: [
      { value: "2017", label: "成為港澳代理" },
      { value: "20+", label: "已舉辦旅行團" },
      { value: "500+", label: "港澳團友" },
      { value: "99", label: "全日本分店" },
    ],
    wordTitle: "頭盔王的話",
    word: "我們成立於 2014 年，憑著熱誠、優質服務與以客為本的精神，在競爭激烈的香港電單車市場打響名氣、建立口碑。我們都是熱愛電單車的香港車友，嚮往冒險、騎車探索未知的自由感覺——一個彈丸之地根本無法滿足我們。2017 年，我們成為 Rental819 港澳代理，致力拓展電單車旅行團業務，希望好好運用我們的經驗、知識與人脈，與大家一起衝出香港。",
  },
  en: {
    hero: {
      eyebrow: "About us",
      title: "Your most trusted motorcycle travel agent",
      intro:
        "RENTAL819 Hong Kong is the official Hong Kong & Macau agent for Rental819, Japan's largest motorcycle rental company, and part of the Helmet King group. We offer end-to-end rental self-drive tours and rental-plus-accommodation packages for riders from Hong Kong and Macau.",
    },
    storyEyebrow: "OUR STORY",
    storyTitle: "Our story",
    brands: [
      {
        name: "Helmet King",
        year: "Est. 2014",
        body: "A major Hong Kong online and in-store retailer of motorcycle gear, and official HK distributor for many international brands — helmets, riding gear and custom parts by the tens of thousands.",
      },
      {
        name: "RENTAL819 Hong Kong",
        year: "Est. 2017",
        body: "The official Hong Kong & Macau agent for Rental819, Japan's largest motorcycle rental company. We offer HK/Macau riders end-to-end rentals, self-drive tours and rental-plus-accommodation packages.",
      },
      {
        name: "26KING",
        year: "Est. 2023",
        body: "A Helmet King subsidiary and official new-vehicle dealer for Japanese and European brands, with an experienced workshop team offering premium maintenance, repairs and customisation — from servicing and mods to buying and selling bikes.",
      },
      {
        name: "RentalBike.HK",
        year: "Est. 2024",
        body: "Hong Kong's only licensed motorcycle rental platform for visitors. Built for tourists and local riders, with a fleet of 2024–2026 models, 24/7 roadside support and Premium Go CDW cover so you can explore Hong Kong with total peace of mind.",
      },
    ],
    roleTitle: "Everything we arrange for you",
    roles: [
      {
        title: "Japan motorcycle tours",
        body: "Since 2017 we've run 20+ self-drive tours for 500+ Hong Kong & Macau riders. Every tour has an experienced Cantonese-speaking leader and a support vehicle throughout, handling the details so you can simply enjoy the ride.",
      },
      {
        title: "Self-drive packages",
        body: "As Rental819's HK agent and a partner of Japanese hotel groups, we offer the best-value rental/accommodation packages, plus up-to-date route planning, advice and emergency support.",
      },
      {
        title: "Exclusive rental deals",
        body: "Exclusive Rental819 offers, Helmet King member points and voucher rebates, group discounts and more — the best value for the most complete trip.",
      },
    ],
    stats: [
      { value: "2017", label: "became HK/Macau agent" },
      { value: "20+", label: "tours run" },
      { value: "500+", label: "HK/Macau riders" },
      { value: "99", label: "branches in Japan" },
    ],
    wordTitle: "A word from Helmet King",
    word: "Founded in 2014, we built our name in Hong Kong's competitive motorcycle market on passion, quality service and a customer-first spirit. We're Hong Kong riders ourselves — drawn to adventure and the freedom of exploring on two wheels, something a small city can never quite satisfy. In 2017 we became Rental819's HK/Macau agent to grow our motorcycle-tour business, putting our experience, knowledge and connections to work so we can all break out of Hong Kong together.",
  },
};
