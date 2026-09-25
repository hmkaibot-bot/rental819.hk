"use client";

import { useEffect } from "react";
import { ATTR_KEY, trackEvent, type Attribution } from "@/lib/track";
import { bookingDraftKey, readStored, writeStored } from "@/lib/storage";
import { locales } from "@/lib/i18n";

function hostOf(url: string): string | null {
  try {
    return url ? new URL(url).hostname : null;
  } catch {
    return null;
  }
}

function fileOf(pathname: string): string {
  const last = pathname.split("/").pop() ?? "";
  try {
    return decodeURIComponent(last);
  } catch {
    return last;
  }
}

/** Records first-touch attribution and turns CTA clicks into conversion events. */
export default function ConversionTracker() {
  useEffect(() => {
    // Reading an expired entry deletes it, so a booking-form trip draft older
    // than 24 hours is removed on the next visit to any page, not only /booking.
    for (const l of locales) readStored(bookingDraftKey(l));
    try {
      if (!readStored(ATTR_KEY)) {
        const params = new URLSearchParams(window.location.search);
        const utm = (k: string) => params.get(k)?.slice(0, 100) || null;
        const attr: Attribution = {
          landing: window.location.pathname,
          ref: hostOf(document.referrer),
          utm_source: utm("utm_source"),
          utm_medium: utm("utm_medium"),
          utm_campaign: utm("utm_campaign"),
          gclid: !!params.get("gclid"),
          fbclid: !!params.get("fbclid"),
        };
        writeStored(ATTR_KEY, attr);
      }
    } catch {
      // Attribution is best-effort.
    }

    function onClick(e: MouseEvent) {
      const a = e.target instanceof Element ? e.target.closest("a") : null;
      if (!a) return;
      let url: URL;
      try {
        url = new URL(a.href);
      } catch {
        return;
      }
      const path = window.location.pathname;
      const placement = a.closest<HTMLElement>("[data-cta]")?.dataset.cta ?? "other";
      if (url.hostname === "wa.me") {
        trackEvent("whatsapp_click", { path, placement });
      } else if (url.hostname === "26adventure.com" || url.hostname.endsWith(".26adventure.com")) {
        trackEvent("outbound_26adventure", { path, href: url.href });
      } else if (url.pathname.toLowerCase().endsWith(".pdf")) {
        trackEvent("leaflet_download", { file: fileOf(url.pathname) });
      } else if (url.protocol === "tel:" || url.protocol === "mailto:") {
        trackEvent("contact_click", { path, kind: url.protocol.slice(0, -1) });
      } else if (url.origin === window.location.origin && url.pathname.endsWith("/booking")) {
        trackEvent("book_cta_click", { path, placement });
      }
    }

    // Capture phase, so the click is seen even when a handler stops propagation.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
