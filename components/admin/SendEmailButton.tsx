"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  readOnly,
  t,
}: {
  id: string;
  kind: "jp" | "customer";
  lang?: "en" | "zh";
  enabled: boolean;
  hasRecipient: boolean;
  readOnly: boolean;
  t: AdminDict["email"];
}) {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "armed" | "sending" | "done" | "error">("idle");
  const [advanced, setAdvanced] = useState(false);
  const [detail, setDetail] = useState("");
  const [staffName, setStaffName] = useState("");

  // The JP mail is signed by the sending colleague, so their name is required
  // before it can go out. The customer mail carries no such signature.
  const isJp = kind === "jp";
  const nameOk = !isJp || staffName.trim().length > 0;

  // The arming click is client state only — the real guard is the 403 the send
  // route returns for a read-only session. This just removes a dead control.
  if (readOnly) {
    return <p className="text-xs text-ink-muted">{t.readOnlyNotice}</p>;
  }
  if (!enabled) {
    return <p className="text-xs text-ink-muted">{t.notConfigured}</p>;
  }
  if (!hasRecipient) {
    return <p className="text-xs text-accent-700">{t.noRecipient}</p>;
  }

  const send = async () => {
    if (!nameOk) return;
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
        body: JSON.stringify({ id, kind, lang, staffName: staffName.trim() || undefined }),
      });
      if (res.ok) {
        const j = (await res.json().catch(() => ({}))) as { statusAdvanced?: boolean };
        setAdvanced(Boolean(j.statusAdvanced));
        setState("done");
        // The JP send moves the booking to 已通知日本 server-side; refresh so the
        // status shown here is not the one from before the mail went out.
        router.refresh();
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
      {isJp && (
        <label className="flex items-center gap-1.5 text-sm text-ink-soft">
          <span className="whitespace-nowrap">{t.staffNameLabel}</span>
          <input
            value={staffName}
            onChange={(e) => setStaffName(e.target.value)}
            placeholder={t.staffNamePlaceholder}
            aria-label={t.staffNameLabel}
            className="w-40 rounded-lg border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
        </label>
      )}
      <button
        onClick={send}
        disabled={state === "sending" || state === "done" || !nameOk}
        title={!nameOk ? t.staffNameRequired : undefined}
        className={`text-sm disabled:opacity-60 ${state === "armed" ? "btn-primary" : "btn-brand"}`}
      >
        {state === "sending" ? t.sending : state === "armed" ? t.confirmSend : t.send}
      </button>
      {state === "armed" && <span className="text-xs text-ink-muted">{t.confirmHint}</span>}
      {state === "done" && (
        <span className="text-sm text-emerald-700">
          {t.sent}
          {advanced && <span className="ml-1 text-xs">{t.statusAdvanced}</span>}
        </span>
      )}
      {state === "error" && (
        <span className="text-sm text-rose-600">
          {t.failed}
          {detail && <span className="block text-xs text-rose-400">（{detail}）</span>}
        </span>
      )}
    </div>
  );
}
