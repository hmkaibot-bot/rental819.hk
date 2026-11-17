"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { localePath, type Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import { DEC2026_PROMO, popupActive } from "@/lib/promo/dec2026";
import { CloseIcon, WhatsAppIcon } from "./icons";

/**
 * December 2026 homepage poster. Shown once per browser session, and only
 * while Hong Kong time is inside the window in `DEC2026_PROMO.popup`.
 * The date check runs on the client so a statically built homepage still
 * stops showing the poster at 2027-01-01 00:00 HKT without a redeploy.
 */
export default function PromoPopup({ locale }: { locale: Locale }) {
  const isEn = locale === "en";
  const titleId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!popupActive(new Date())) return;
    try {
      if (sessionStorage.getItem(DEC2026_PROMO.popup.sessionKey)) return;
    } catch {
      // Private mode with no storage: show it this once.
    }
    setOpen(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    closeRef.current?.focus();
    // Mark it seen after paint. A zero delay survives React strict mode's
    // setup/cleanup/setup replay, which would otherwise forget the flag and
    // also lets a refresh during the same session stay quiet.
    const seen = window.setTimeout(() => {
      try {
        sessionStorage.setItem(DEC2026_PROMO.popup.sessionKey, "1");
      } catch {
        // Ignore — the poster simply may appear again next view.
      }
    }, 0);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(seen);
      document.body.style.overflow = prevOverflow;
      if (dialog?.open) dialog.close();
    };
  }, [open]);

  const close = () => {
    dialogRef.current?.close();
    setOpen(false);
  };

  const bookHref = localePath(locale, "/booking");
  const alt = isEn
    ? "December 2026 riding offer. 12% off — pay 88% of bike rent plus damage protection. Accessories are extra. Applies to pick-ups during December 2026 at any Japan branch."
    : "12月冬日騎行優惠。車租加車損保障現價減 12%（88折），配件另計。適用於 2026 年 12 月內起租、全日本分店。";
  const closeLabel = isEn ? "Close promotion" : "關閉優惠";

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      data-promo="dec2026"
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      className="m-auto w-fit max-w-[90vw] border-0 bg-transparent p-0 open:flex backdrop:bg-slate-950/70"
    >
      {open && (
      <div className="relative flex max-h-[80vh] max-w-[90vw] flex-col overflow-hidden rounded-2xl bg-white shadow-card">
        <h2 id={titleId} className="sr-only">
          {isEn ? "December 2026 promotion" : "2026年12月優惠"}
        </h2>
        <button
          ref={closeRef}
          type="button"
          onClick={close}
          aria-label={closeLabel}
          className="absolute right-2 top-2 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-ink shadow-card hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
        >
          <CloseIcon className="h-5 w-5" />
        </button>
        <Link
          href={bookHref}
          data-cta="promo-image"
          className="block min-h-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-600"
          onClick={close}
        >
          <picture>
            <source media="(max-width: 639px)" srcSet={DEC2026_PROMO.popup.portrait} />
            {/* Two crops of one poster: portrait on a phone, square otherwise. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={DEC2026_PROMO.popup.square}
              alt={alt}
              width={1080}
              height={1080}
              className="h-auto max-h-[calc(80vh-4.75rem)] w-auto max-w-[90vw] object-contain"
            />
          </picture>
        </Link>
        <div className="flex shrink-0 flex-col gap-2 p-3 sm:flex-row">
          <Link
            href={bookHref}
            data-cta="promo-book"
            onClick={close}
            className="btn-primary flex-1"
          >
            {isEn ? "Book now" : "立即預約"}
          </Link>
          <a
            href={site.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            data-cta="promo-wa"
            className="btn flex-1 bg-[#25D366] text-white hover:brightness-95"
          >
            <WhatsAppIcon className="h-5 w-5" />
            {isEn ? "WhatsApp enquiry" : "WhatsApp 查詢"}
          </a>
        </div>
      </div>
      )}
    </dialog>
  );
}
