"use client";

import { useState } from "react";
import type { AdminDict } from "@/lib/admin/i18n";

export default function EmailPreview({
  subject,
  body,
  html,
  t,
}: {
  subject: string;
  body: string;
  html?: string;
  t: AdminDict["email"];
}) {
  const [copied, setCopied] = useState<"none" | "subject" | "body">("none");

  const flash = (which: "subject" | "body") => {
    setCopied(which);
    setTimeout(() => setCopied("none"), 1500);
  };

  const copy = async (text: string, which: "subject" | "body") => {
    try {
      await navigator.clipboard.writeText(text);
      flash(which);
    } catch {
      /* ignore */
    }
  };

  // The body is displayed as plain text (easy to scan in one glance), but the
  // copy carries the formatted HTML version when there is one: pasted into
  // Gmail/Outlook the bordered, aligned tables survive, while plain-text
  // targets still receive the text version. (The plain text aligns its columns
  // with padded spaces, which only line up in a monospace font — pasted into a
  // proportional compose box they go ragged, hence the rich copy.)
  const copyBody = async () => {
    try {
      if (html && typeof ClipboardItem !== "undefined" && navigator.clipboard?.write) {
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/html": new Blob([html], { type: "text/html" }),
            "text/plain": new Blob([body], { type: "text/plain" }),
          }),
        ]);
        flash("body");
        return;
      }
      await navigator.clipboard.writeText(body);
      flash("body");
    } catch {
      // Some browsers reject the rich write without a scoped permission; the
      // plain-text path is far more widely allowed, so fall back to it.
      try {
        await navigator.clipboard.writeText(body);
        flash("body");
      } catch {
        /* ignore */
      }
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-1 flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{t.subject}</label>
          <button onClick={() => copy(subject, "subject")} className="text-xs font-medium text-brand-700 hover:underline">
            {copied === "subject" ? t.copied : t.copy}
          </button>
        </div>
        <input readOnly value={subject} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm" />
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{t.body}</label>
          <button onClick={copyBody} className="text-xs font-medium text-brand-700 hover:underline">
            {copied === "body" ? t.copied : t.copyAll}
          </button>
        </div>
        <textarea readOnly value={body} rows={20} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-[13px] leading-6" />
        {html && <p className="mt-1 text-xs text-ink-muted">{t.copyRichHint}</p>}
      </div>
    </div>
  );
}
