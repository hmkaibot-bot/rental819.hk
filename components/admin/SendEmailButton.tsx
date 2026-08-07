"use client";

import { useState } from "react";
import type { AdminDict } from "@/lib/admin/i18n";

/**
 * Sends the reservation email straight out of the company mailbox. Because that
 * is irreversible, the button arms first — one click to arm, a second to send —
 * so a stray click on a customer's record cannot fire a real email.
 */
export default function SendEmailButton({
  id,
  kind,
  lang,
  enabled,
  hasRecipient,
  t,
}: {
  id: string;
  kind: "jp" | "customer";
  lang?: "en" | "zh";
  enabled: boolean;
  hasRecipient: boolean;
  t: AdminDict["email"];
}) {
  const [state, setState] = useState<"idle" | "armed" | "sending" | "done" | "error">("idle");
  const [detail, setDetail] = useState("");

  if (!enabled) {
    return <p className="text-xs text-ink-muted">{t.notConfigured}</p>;
  }
  if (!hasRecipient) {
    return <p className="text-xs text-accent-700">{t.noRecipient}</p>;
  }

  const send = async () => {
    if (state === "idle") {
      setState("armed");
      return;
    }
    setState("sending");
    setDetail("");
    try {
      const res = await fetch("/api/admin/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, kind, lang }),
      });
      if (res.ok) {
        setState("done");
      } else {
        const j = (await res.json().catch(() => ({}))) as { error?: string; detail?: string };
        setDetail(j.detail || j.error || `HTTP ${res.status}`);
        setState("error");
      }
    } catch (e) {
      setDetail(e instanceof Error ? e.message : String(e));
      setState("error");
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        onClick={send}
        disabled={state === "sending" || state === "done"}
        className={`text-sm disabled:opacity-60 ${state === "armed" ? "btn-primary" : "btn-brand"}`}
      >
        {state === "sending" ? t.sending : state === "armed" ? t.confirmSend : t.send}
      </button>
      {state === "armed" && <span className="text-xs text-ink-muted">{t.confirmHint}</span>}
      {state === "done" && <span className="text-sm text-emerald-700">{t.sent}</span>}
      {state === "error" && (
        <span className="text-sm text-rose-600">
          {t.failed}
          {detail && <span className="block text-xs text-rose-400">（{detail}）</span>}
        </span>
      )}
    </div>
  );
}
