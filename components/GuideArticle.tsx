import Link from "next/link";
import type { Block } from "@/lib/content/blocks";

function renderBlock(block: Block, i: number) {
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
  }
}

export default function GuideArticle({ blocks }: { blocks: Block[] }) {
  return <div className="prose-r819 max-w-3xl">{blocks.map(renderBlock)}</div>;
}
