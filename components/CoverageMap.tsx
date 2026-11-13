import Image from "next/image";
import Link from "next/link";
import { coverageRegions } from "@/lib/content/coverage";
import { localePath, type Locale } from "@/lib/i18n";

/**
 * Nationwide branch coverage: the Japan region map with a clickable label over
 * each region, plus a region/prefecture list. Each region opens our catalogue
 * with that area's branches available to choose from.
 */
export default function CoverageMap({ locale }: { locale: Locale }) {
  const isEn = locale === "en";
  const areaHref = (a: number) => localePath(locale, `/rental?area=${a}#catalogue`);

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,460px)_1fr] lg:gap-12">
      {/* Map with clickable region labels overlaid on each region */}
      <figure className="m-0">
        <div className="mx-auto max-w-[460px] rounded-2xl bg-white p-2 shadow-card">
          <div className="relative">
            <Image
              src="/images/japan-regions-map.png"
              alt={isEn ? "Map of Rental819 regions in Japan" : "全日本 Rental819 取車地區地圖"}
              width={920}
              height={920}
              className="h-auto w-full select-none"
              sizes="(min-width: 1024px) 460px, 100vw"
            />
            {coverageRegions.map((r) => (
              <Link
                key={r.area}
                href={areaHref(r.area)}
                title={isEn ? r.en : r.zh}
                className="group absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${r.px}%`, top: `${r.py}%` }}
              >
                <span
                  className="whitespace-nowrap rounded-full border border-white/80 px-2 py-0.5 text-[11px] font-bold text-slate-800 shadow-sm ring-brand-600/0 transition group-hover:ring-2 group-hover:ring-brand-600/70 sm:text-xs"
                  style={{ backgroundColor: r.color }}
                >
                  {isEn ? r.en : r.zhShort}
                </span>
              </Link>
            ))}
          </div>
        </div>
        <figcaption className="mt-3 text-center text-xs text-ink-muted">
          {isEn ? "Choose a region, then select a branch to see its bikes" : "點選地區，再選擇分店查看車款"}
        </figcaption>
      </figure>

      {/* Linked region + prefecture list */}
      <ul className="grid gap-3 sm:grid-cols-2">
        {coverageRegions.map((r) => (
          <li key={r.area} className="rounded-xl border border-slate-100 bg-white p-4">
            <Link
              href={areaHref(r.area)}
              className="inline-flex items-center gap-1 font-bold text-brand-700 hover:underline"
            >
              <span
                aria-hidden
                className="mr-1 inline-block h-2.5 w-2.5 rounded-full align-middle"
                style={{ backgroundColor: r.color }}
              />
              {isEn ? r.en : r.zh}
            </Link>
            <p className="mt-1.5 text-sm leading-6 text-ink-muted">
              {r.prefectures.join(isEn ? " · " : "、")}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
