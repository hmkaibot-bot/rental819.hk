"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateStatusFromList } from "./status-actions";

/** Chevron so the badge still reads as a dropdown with appearance-none. */
const CHEVRON =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='8' height='6' viewBox='0 0 8 6'><path d='M1 1l3 3 3-3' fill='none' stroke='%23475569' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/></svg>\")";

/**
 * The dashboard's status badge as an editable dropdown — pick a status and it
 * saves immediately, keeping the badge colour of whatever is selected. The
 * server action re-checks write permission; a failure rolls the pick back.
 */
export function StatusSelect({
  id,
  value,
  options,
  ariaLabel,
  paidDateRequired,
}: {
  id: string;
  value: string;
  options: { key: string; label: string; tone: string }[];
  ariaLabel: string;
  /** Shown when 已確認預定 is refused for a booking with no 客人付款日期. */
  paidDateRequired: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [current, setCurrent] = useState(value);
  const [refused, setRefused] = useState("");
  const tone =
    options.find((o) => o.key === current)?.tone ?? "bg-slate-100 text-slate-700";

  return (
    <span className="inline-flex flex-col gap-1">
    <select
      value={current}
      aria-label={ariaLabel}
      disabled={pending}
      onChange={(e) => {
        const next = e.target.value;
        const prev = current;
        setCurrent(next);
        setRefused("");
        const fd = new FormData();
        fd.set("id", id);
        fd.set("status", next);
        startTransition(async () => {
          try {
            const res = await updateStatusFromList(fd);
            if (res?.ok) {
              router.refresh();
              return;
            }
            // Refused by a rule, not by an outage — put the badge back and say
            // which rule, otherwise the pick just silently springs back.
            setCurrent(prev);
            if (res?.error === "paid_date_required") setRefused(paidDateRequired);
          } catch {
            setCurrent(prev);
          }
        });
      }}
      className={`cursor-pointer appearance-none rounded-full border-0 py-1 pl-2.5 pr-6 text-xs font-medium outline-none focus:ring-2 focus:ring-brand-500/30 ${tone} ${
        pending ? "opacity-60" : ""
      }`}
      style={{
        backgroundImage: CHEVRON,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 8px center",
      }}
    >
      {options.map((o) => (
        <option key={o.key} value={o.key}>
          {o.label}
        </option>
      ))}
    </select>
    {refused && (
      <span role="alert" className="max-w-[190px] text-[11px] leading-4 text-rose-600">
        {refused}
      </span>
    )}
    </span>
  );
}
