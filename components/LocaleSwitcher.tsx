"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, localeToggleLabel, type Locale } from "@/lib/i18n";

export default function LocaleSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const other = locales.find((l) => l !== locale) ?? locale;

  // Swap the leading locale segment, preserving the rest of the path.
  const rest = pathname.replace(new RegExp(`^/${locale}`), "") || "/";
  const target = `/${other}${rest === "/" ? "" : rest}`;

  return (
    <Link
      href={target}
      className="inline-flex h-9 min-w-[2.5rem] items-center justify-center rounded-full border border-brand-200 px-3 text-sm font-semibold text-brand-700 transition hover:border-brand-400 hover:bg-brand-50"
      aria-label="Switch language"
    >
      {localeToggleLabel[locale]}
    </Link>
  );
}
