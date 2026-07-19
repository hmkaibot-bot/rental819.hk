/** Portable content-block model shared by long-form guide pages. */
export type Block =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "note"; text: string }
  | { type: "table"; head: string[]; rows: string[][] };

export interface GuideDoc {
  slug: string; // path under /guide, e.g. "insurance"
  title: string;
  intro?: string;
  blocks: Block[];
}
