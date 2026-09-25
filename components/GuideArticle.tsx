import Link from "next/link";
import type { Block } from "@/lib/content/blocks";
import { localePath, type Locale } from "@/lib/i18n";

function renderBlock(block: Block, i: number, locale: Locale, waHref: string) {
  const en = locale === "en";
  switch (block.type) {
    case "h":
      return <h2 key={i}>{block.text}</h2>;
    case "h3":
      return <h3 key={i}>{block.text}</h3>;
    case "p":
      return <p key={i}>{block.text}</p>;
    case "ul":
      return (
        <ul key={i}>
          {block.items.map((it, j) => (
            <li key={j}>{it}</li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol key={i}>
          {block.items.map((it, j) => (
            <li key={j}>{it}</li>
          ))}
        </ol>
      );
    // Hrefs are stored locale-prefixed in the content, so the article stays
    // locale-agnostic and needs no extra prop from the page.
    case "link":
      return (
        <ol key={i}>
          {block.items.map((it, j) => (
            <li key={j}>
              <Link href={it.href}>{it.label}</Link>
              {it.text ? ` — ${it.text}` : null}
            </li>
          ))}
        </ol>
      );
    case "note":
      return (
        <div
          key={i}
          className="my-6 rounded-xl border-l-4 border-accent-500 bg-accent-50/60 px-5 py-4 text-sm text-ink-soft"
        >
          {block.text}
        </div>
      );
    case "table":
      return (
        <div key={i} className="my-6 overflow-x-auto">
          <table>
            <thead>
              <tr>
                {block.head.map((h, j) => (
                  <th key={j}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) => (
                    <td key={c}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "cta":
      return (
        <div
          key={i}
          className="not-prose my-8 rounded-2xl border border-brand-100 bg-brand-50 p-5 sm:flex sm:items-center sm:justify-between sm:gap-4"
        >
          <p className="text-sm font-medium text-ink">{block.text}</p>
          <div className="mt-3 flex flex-wrap gap-2 sm:mt-0">
            <Link
              href={localePath(locale, "/booking")}
              className="btn-primary px-4 py-2 text-sm"
              data-cta="guide-inline-book"
            >
              {en ? "Get a quote" : "填表索取報價"}
            </Link>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline px-4 py-2 text-sm"
              data-cta="guide-inline-wa"
            >
              {en ? "Ask on WhatsApp" : "WhatsApp 查詢"}
            </a>
          </div>
        </div>
      );
  }
}

export default function GuideArticle({
  blocks,
  locale,
  waHref,
}: {
  blocks: Block[];
  locale: Locale;
  waHref: string;
}) {
  return (
    <div className="prose-r819 max-w-3xl">
      {blocks.map((b, i) => renderBlock(b, i, locale, waHref))}
    </div>
  );
}
