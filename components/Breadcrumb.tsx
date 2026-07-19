import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";

export interface Crumb {
  label: string;
  href?: string; // path WITHOUT locale prefix
}

export default function Breadcrumb({
  locale,
  items,
}: {
  locale: Locale;
  items: Crumb[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-brand-200">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((c, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {c.href ? (
              <Link href={localePath(locale, c.href)} className="hover:text-white">
                {c.label}
              </Link>
            ) : (
              <span className="text-white">{c.label}</span>
            )}
            {i < items.length - 1 && <span aria-hidden>/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
