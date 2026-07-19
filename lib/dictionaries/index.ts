import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "./types";
import zhHk from "./zh-hk";
import en from "./en";

const dictionaries: Record<Locale, Dictionary> = {
  "zh-hk": zhHk,
  en,
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries["zh-hk"];
}

export type { Dictionary } from "./types";
