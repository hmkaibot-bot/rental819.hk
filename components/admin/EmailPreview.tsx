"use client";

import { useState } from "react";

export default function EmailPreview({
  subject,
  body,
  to,
}: {
  subject: string;
  body: string;
  to?: string;
}) {
  const [copied, setCopied] = useState<"none" | "subject" | "body">("none");

  const copy = async (text: string, which: "subject" | "body") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(which);
      setTimeout(() => setCopied("none"), 1500);
    } catch {
      /* ignore */
    }
  };

  const mailto = `mailto:${to ?? ""}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-1 flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wide text-ink-muted">主旨 Subject</label>
          <button onClick={() => copy(subject, "subject")} className="text-xs font-medium text-brand-700 hover:underline">
            {copied === "subject" ? "已複製 ✓" : "複製"}
          </button>
        </div>
        <input readOnly value={subject} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm" />
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wide text-ink-muted">內容 Body</label>
          <button onClick={() => copy(body, "body")} className="text-xs font-medium text-brand-700 hover:underline">
            {copied === "body" ? "已複製 ✓" : "複製全文"}
          </button>
        </div>
        <textarea readOnly value={body} rows={20} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-[13px] leading-6" />
      </div>

      <a href={mailto} className="btn-primary text-sm">
        用郵件程式開啟
      </a>
    </div>
  );
}
