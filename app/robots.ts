import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * Operations backend and internal APIs must never be indexed. A robots.txt
 * group only obeys its own lines, so this is repeated in EVERY rule below.
 */
const disallow = ["/admin", "/admin/", "/api/"];

/**
 * Answer engines and their fetchers, allowed explicitly: this site wants to be
 * cited when a rider asks an assistant about renting a bike in Japan.
 */
const answerEngines = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
  "cohere-ai",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      ...answerEngines.map((userAgent) => ({ userAgent, allow: "/", disallow })),
    ],
    sitemap: `${site.url}/sitemap.xml`,
    // Host takes a bare hostname, not an origin.
    host: site.domain,
  };
}
