import { track } from "@vercel/analytics";

type EventProps = Record<string, string | number | boolean | null>;

/** Vendor-neutral conversion event: Vercel Web Analytics, plus GA4 once a gtag is on the page. */
export function trackEvent(name: string, props?: EventProps) {
  try {
    track(name, props);
  } catch {}
  try {
    (window as Window & { gtag?: (...args: unknown[]) => void }).gtag?.("event", name, props);
  } catch {}
}

/** First-touch attribution, stored by ConversionTracker and sent with the booking form. */
export const ATTR_KEY = "r819_attr";

export interface Attribution {
  landing: string;
  /** Referrer hostname only, never the full URL. */
  ref: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  gclid: boolean;
  fbclid: boolean;
}
