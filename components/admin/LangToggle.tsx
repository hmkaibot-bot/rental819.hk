"use client";

import { useRouter } from "next/navigation";
import { ADMIN_LANG_COOKIE, ADMIN_LANGS, type AdminLang } from "@/lib/admin/i18n";

/**
 * 中文 / 日本語 switch for the back office. The choice is a plain (non-httpOnly)
 * cookie so it can be written here and read by every server component on the
 * next render — `router.refresh()` re-renders the tree with the new language.
 */
export default function LangToggle({ lang, ariaLabel }: { lang: AdminLang; ariaLabel: string }) {
  const router = useRouter();

  const pick = (next: AdminLang) => {
    if (next === lang) return;
    document.cookie = `${ADMIN_LANG_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  };

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="inline-flex overflow-hidden rounded-lg border border-slate-200 text-xs font-medium"
    >
      {ADMIN_LANGS.map((l) => (
        <button
          key={l.key}
          type="button"
          onClick={() => pick(l.key)}
          aria-pressed={lang === l.key}
          className={`px-2 py-1 ${
            lang === l.key ? "bg-brand-600 text-white" : "bg-white text-ink-muted hover:bg-slate-50"
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
