"use client";

import { useState } from "react";

export default function GmailDraftButton({
  id,
  kind,
  enabled,
}: {
  id: string;
  kind: "jp" | "customer";
  enabled: boolean;
}) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  if (!enabled) {
    return (
      <p className="text-xs text-ink-muted">
        （設定 Gmail API 後，可一鍵在你的 Gmail 建立草稿。見 .env.example）
      </p>
    );
  }

  const create = async () => {
    setState("loading");
    try {
      const res = await fetch("/api/admin/gmail-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, kind }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button onClick={create} disabled={state === "loading"} className="btn-brand text-sm disabled:opacity-60">
        {state === "loading" ? "建立中…" : "在 Gmail 建立草稿"}
      </button>
      {state === "done" && (
        <span className="text-sm text-emerald-700">
          已建立草稿 ✓ 請到{" "}
          <a href="https://mail.google.com/mail/u/0/#drafts" target="_blank" rel="noopener noreferrer" className="underline">
            Gmail 草稿箱
          </a>{" "}
          檢查並發送。
        </span>
      )}
      {state === "error" && <span className="text-sm text-rose-600">建立失敗，請重試或用複製方式。</span>}
    </div>
  );
}
