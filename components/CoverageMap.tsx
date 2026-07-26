import { coverageRegions, JAPAN_SHOPLIST } from "@/lib/content/coverage";
import type { Locale } from "@/lib/i18n";

const TILE_W = 94;
const TILE_H = 38;

/**
 * Nationwide branch coverage: a clickable schematic Japan map + a linked region
 * list. Each region opens the Rental819 store list anchored to that area.
 */
export default function CoverageMap({ locale }: { locale: Locale }) {
  const isEn = locale === "en";
  const areaHref = (a: number) => `${JAPAN_SHOPLIST}#area_${a}`;

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-12">
      {/* Schematic clickable map */}
      <figure className="m-0">
        <svg
          viewBox="0 0 400 512"
          role="img"
          aria-label={isEn ? "Map of Rental819 regions in Japan" : "全日本 Rental819 取車地區地圖"}
          className="mx-auto w-full max-w-[380px]"
        >
          {coverageRegions.map((r) => (
            <a
              key={r.area}
              href={areaHref(r.area)}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <title>{isEn ? r.en : r.zh}</title>
              <rect
                x={r.x}
                y={r.y}
                width={TILE_W}
                height={TILE_H}
                rx="9"
                fill={r.color}
                stroke="#ffffff"
                strokeWidth="2"
                className="transition-opacity group-hover:opacity-75"
              />
              <text
                x={r.x + TILE_W / 2}
                y={r.y + TILE_H / 2 + 4}
                textAnchor="middle"
                className="pointer-events-none fill-slate-800 font-semibold"
                style={{ fontSize: "12.5px" }}
              >
                {isEn ? r.en : r.zhShort}
              </text>
            </a>
          ))}
        </svg>
        <figcaption className="mt-3 text-center text-xs text-ink-muted">
          {isEn
            ? "Tap a region to see its Rental819 branches"
            : "點選地區，查看該區 Rental819 分店"}
        </figcaption>
      </figure>

      {/* Linked region + prefecture list */}
      <ul className="grid gap-3 sm:grid-cols-2">
        {coverageRegions.map((r) => (
          <li key={r.area} className="rounded-xl border border-slate-100 bg-white p-4">
            <a
              href={areaHref(r.area)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-bold text-brand-700 hover:underline"
            >
              <span
                aria-hidden
                className="mr-1 inline-block h-2.5 w-2.5 rounded-full align-middle"
                style={{ backgroundColor: r.color }}
              />
              {isEn ? r.en : r.zh}
              <span aria-hidden className="text-xs">↗</span>
            </a>
            <p className="mt-1.5 text-sm leading-6 text-ink-muted">
              {r.prefectures.join(isEn ? " · " : "、")}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
