"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";
import type { NavItem } from "@/lib/nav";
import { site, whatsappLink } from "@/lib/site";
import LocaleSwitcher from "./LocaleSwitcher";
import { ChevronDown, WhatsAppIcon, MenuIcon, CloseIcon } from "./icons";

export default function Header({
  locale,
  dict,
  nav,
}: {
  locale: Locale;
  dict: Dictionary;
  nav: NavItem[];
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const pathname = usePathname();

  const lp = (href: string) => localePath(locale, href);
  const isActive = (href: string) => {
    const full = lp(href);
    if (href === "/") return pathname === full;
    return pathname === full || pathname.startsWith(full + "/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between gap-4 lg:h-20">
        {/* Logo */}
        <Link href={lp("/")} className="flex shrink-0 items-center gap-2" aria-label={site.name}>
          <Image
            src="/logo-lg.png"
            alt="RENTAL819"
            width={768}
            height={488}
            priority
            className="h-9 w-auto lg:h-11"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) =>
            item.children ? (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => setGuideOpen(true)}
                onMouseLeave={() => setGuideOpen(false)}
              >
                <Link
                  href={lp(item.href)}
                  className={`flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium transition ${
                    isActive(item.href)
                      ? "text-brand-700"
                      : "text-ink-soft hover:text-brand-700"
                  }`}
                >
                  {item.label}
                  <ChevronDown className="h-3.5 w-3.5" />
                </Link>
                {guideOpen && (
                  <div className="absolute left-1/2 top-full w-64 -translate-x-1/2 pt-2">
                    <div className="card overflow-hidden p-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={lp(child.href)}
                          className="block rounded-lg px-3 py-2 text-sm text-ink-soft transition hover:bg-brand-50 hover:text-brand-700"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.href}
                href={lp(item.href)}
                className={`rounded-full px-3 py-2 text-sm font-medium transition ${
                  isActive(item.href)
                    ? "text-brand-700"
                    : "text-ink-soft hover:text-brand-700"
                }`}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white transition hover:brightness-95 sm:inline-flex"
            aria-label="WhatsApp"
          >
            <WhatsAppIcon className="h-5 w-5" />
          </a>
          <LocaleSwitcher locale={locale} />
          <Link href={lp("/booking")} className="btn-primary hidden sm:inline-flex">
            {dict.nav.book}
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-brand-50 lg:hidden"
            aria-label="Open menu"
          >
            <MenuIcon className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-white shadow-2xl">
            <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5">
              <span className="font-bold text-brand-700">{site.name}</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-brand-50"
                aria-label="Close menu"
              >
                <CloseIcon className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-3 py-4">
              {nav.map((item) => (
                <div key={item.href}>
                  <Link
                    href={lp(item.href)}
                    onClick={() => setMobileOpen(false)}
                    className={`block rounded-lg px-3 py-3 text-base font-medium ${
                      isActive(item.href) ? "text-brand-700" : "text-ink"
                    }`}
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <div className="ml-3 border-l border-slate-100 pl-3">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={lp(child.href)}
                          onClick={() => setMobileOpen(false)}
                          className="block rounded-lg px-3 py-2 text-sm text-ink-muted hover:text-brand-700"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
            <div className="border-t border-slate-100 p-4">
              <Link
                href={lp("/booking")}
                onClick={() => setMobileOpen(false)}
                className="btn-primary w-full"
              >
                {dict.nav.book}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
