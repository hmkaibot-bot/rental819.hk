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
  const [tab, setTab] = useState<"preview" | "text">(html ? "preview" : "text");

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

  // The plain-text body aligns its columns with padded spaces, which only line
  // up in a monospace font — pasted into Gmail's proportional compose box they
  // go ragged. So while the rendered preview is showing, copy the HTML (with
  // the text as a fallback part): Gmail takes the HTML and keeps the bordered,
  // aligned tables, while plain-text targets still receive the text version.
  // The 純文字 tab stays a deliberate plain-only copy.
  const copyBody = async () => {
    try {
      if (
        html &&
        tab === "preview" &&
        typeof ClipboardItem !== "undefined" &&
        navigator.clipboard?.write
      ) {
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
          <div className="flex items-center gap-3">
            {html && (
              <div className="flex overflow-hidden rounded-md border border-slate-200 text-xs">
                <button
                  onClick={() => setTab("preview")}
                  className={`px-2 py-0.5 ${tab === "preview" ? "bg-brand-600 text-white" : "text-ink-muted"}`}
                >
                  {t.preview}
                </button>
                <button
                  onClick={() => setTab("text")}
                  className={`px-2 py-0.5 ${tab === "text" ? "bg-brand-600 text-white" : "text-ink-muted"}`}
                >
                  {t.plain}
                </button>
              </div>
            )}
            <button onClick={copyBody} className="text-xs font-medium text-brand-700 hover:underline">
              {copied === "body" ? t.copied : t.copyAll}
            </button>
          </div>
        </div>
        {html && tab === "preview" ? (
          <iframe
            title="email preview"
            srcDoc={html}
            className="h-[560px] w-full rounded-lg border border-slate-200 bg-white"
          />
        ) : (
          <textarea readOnly value={body} rows={20} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-[13px] leading-6" />
        )}
        {html && (
          <p className="mt-1 text-xs text-ink-muted">
            {tab === "preview" ? t.copyRichHint : t.copyPlainHint}
          </p>
        )}
      </div>
    </div>
  );
}
