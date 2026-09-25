/** Global, language-independent site configuration. */
export const site = {
  name: "RENTAL819",
  domain: "rental819.hk",
  url: "https://rental819.hk",
  phone: "+852 9868 6569",
  phoneRaw: "85298686569",
  whatsapp: "https://wa.me/85298686569",
  email: "info@helmetking.com",
  maps: null as string | null, // restore once the owner confirms the Google Maps place link (see needsUser)
  /** Guided tours & self-drive packages are handled on 26adventure.com. */
  adventureUrl: "https://26adventure.com",
  social: {
    facebook: "https://www.facebook.com/rental819hk",
    instagram: "https://www.instagram.com/rental819_hk/",
  },
  parent: {
    name: "Rental819 Japan",
    url: "https://rental819.com",
    branches: 99,
  },
  /** Sister brands under the Helmet King group. */
  sisters: [
    { name: "Helmet King 頭盔王", url: "https://www.helmetking.com" },
    { name: "RentalBike.hk", url: "https://rentalbike.hk" },
    { name: "26King 二碌王", url: "https://26king.hk" },
  ],
  /**
   * Licensed travel agent for the guided-tour & self-drive-package products
   * (booking handed off to 26adventure.com). Disclosure is required under the
   * HK Travel Agents Ordinance wherever those travel products are advertised.
   */
  travelAgent: {
    name: "Go Asia Plus Travel & Tours Co Ltd",
    licence: "354367",
  },
  /** @deprecated use travelAgent.licence */
  travelLicence: "354367",
} as const;

/** Pre-filled WhatsApp enquiry link. */
export function whatsappLink(message?: string): string {
  const base = site.whatsapp;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export type WaTopic = "rental" | "tours" | "packages" | "general";
const WA_TOPIC = {
  "zh-hk": { rental: "日本租電單車", tours: "電單車旅行團", packages: "自駕套票", general: "" },
  en: { rental: "renting a motorcycle in Japan", tours: "your guided motorcycle tours", packages: "a self-drive package", general: "" },
} as const;

/** Pre-filled WhatsApp opener that names the topic and the page the visitor was on. */
export function waEnquiry(locale: string, topic: WaTopic, from?: string): string {
  const en = locale === "en";
  const t = WA_TOPIC[en ? "en" : "zh-hk"][topic];
  const base = en ? (t ? `Hi, I'd like to ask about ${t}.` : "Hi, I have a question.") : t ? `你好，我想查詢${t}。` : "你好，我想查詢。";
  const src = from ? (en ? ` (from: ${from})` : `（來自：${from}）`) : "";
  return whatsappLink(base + src);
}

/** waEnquiry for site-wide buttons: the topic follows the section of `pathname`, the source is the path itself. */
export function waEnquiryForPath(locale: string, pathname: string): string {
  const topic: WaTopic = pathname.includes("/tours")
    ? "tours"
    : pathname.includes("/packages")
      ? "packages"
      : "rental";
  let from = pathname;
  try {
    from = decodeURIComponent(pathname);
  } catch {
    // A malformed escape: keep the raw path.
  }
  return waEnquiry(locale, topic, from);
}
