/** Global, language-independent site configuration. */
export const site = {
  name: "RENTAL819",
  domain: "rental819.hk",
  url: "https://rental819.hk",
  phone: "+852 9868 6569",
  phoneRaw: "85298686569",
  whatsapp: "https://wa.me/85298686569",
  email: "info@helmetking.com",
  maps: "https://maps.app.goo.gl/w9DNWSusHhF5W6RB9",
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
    { name: "Helmet King 頭盔王", url: "https://helmetking.com" },
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
