/** A link out of a guide article, used by the `link` block. */
export interface BlockLink {
  href: string; // locale-prefixed path, e.g. "/zh-hk/guide/route"
  label: string; // anchor text
  text?: string; // one-line summary shown after the link
}

/** Portable content-block model shared by long-form guide pages. */
export type Block =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  // An ordered list of links — used to point a hub page at its sibling docs.
  | { type: "link"; items: BlockLink[] }
  | { type: "note"; text: string }
  | { type: "table"; head: string[]; rows: string[][] };

export interface GuideDoc {
  slug: string; // path under /guide, e.g. "insurance"
  title: string; // the on-page h1
  intro?: string;
  /** Title tag when it should differ from `title` (keyword + geography, ~60 chars). */
  seoTitle?: string;
  /** Meta description when the intro is too short for the SERP snippet. */
  seoDescription?: string;
  /** ISO date of the last substantive edit — sitemap lastmod / Article dateModified. */
  updated?: string;
  blocks: Block[];
}
