import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";
import { RENT_FROM_HKD, hkd } from "@/lib/content/prices";
import { CheckIcon } from "./icons";

/** Price + "same rent as Japan" + lead-time line shown under the rental CTAs. */
export default function TrustLine({
  locale,
  dict,
  tone,
  className = "",
}: {
  locale: Locale;
  dict: Dictionary;
  tone: "dark" | "light";
  className?: string;
}) {
  const dark = tone === "dark";
  const text = dark ? "text-brand-100" : "text-ink-muted";
  const icon = `h-4 w-4 shrink-0 ${dark ? "text-accent-400" : "text-brand-600"}`;
  return (
    <ul className={`mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs ${text} ${className}`}>
      <li className="flex items-start gap-1.5">
        <CheckIcon className={icon} />
        <Link
          href={localePath(locale, "/guide/fees")}
          className={`underline decoration-1 underline-offset-2 ${
            dark ? "text-white decoration-white/40 hover:decoration-white" : "text-brand-700 decoration-brand-300 hover:text-brand-800"
          }`}
          data-cta="trust-price"
        >
          {dict.trust.price.replace("{price}", hkd(RENT_FROM_HKD))}
        </Link>
      </li>
      <li className="flex items-start gap-1.5">
        <CheckIcon className={icon} />
        {dict.trust.same}
      </li>
      <li className="flex items-start gap-1.5">
        <CheckIcon className={icon} />
        {dict.trust.lead}
      </li>
    </ul>
  );
}
