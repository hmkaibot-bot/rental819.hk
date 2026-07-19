export const locales = ["zh-hk", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "zh-hk";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Human label for the locale switcher. */
export const localeNames: Record<Locale, string> = {
  "zh-hk": "繁體中文",
  en: "English",
};

/** The short toggle label shown for the *other* language. */
export const localeToggleLabel: Record<Locale, string> = {
  "zh-hk": "EN",
  en: "繁",
};

/** `<html lang>` value per locale. */
export const htmlLang: Record<Locale, string> = {
  "zh-hk": "zh-Hant-HK",
  en: "en",
};

/** Build a locale-prefixed path, e.g. localePath("en", "/rental"). */
export function localePath(locale: Locale, path = "/"): string {
  const clean = path === "/" ? "" : path.replace(/^\/+/, "/");
  return `/${locale}${clean}`;
}
