"use client";

import { useMemo, useState, useTransition } from "react";
import { RT819_GROUP_LABELS, type Rt819Item } from "@/lib/reservations/items";
import type { AdminDict } from "@/lib/admin/i18n";
import { saveFeeItems } from "@/app/admin/(app)/items/actions";

export interface FeeItemRow {
  code: string;
  grp: Rt819Item["group"];
  desc_en: string;
  desc_zh: string | null;
  unit_price: number;
  cost_hkd: number;
  yen_cost: number;
}

const GROUP_ORDER: Rt819Item["group"][] = [
  "bike",
  "insurance",
  "mamoride",
  "helmet",
  "case",
  "hk",
  "other",
];

type Draft = Record<
  string,
  { unit_price: number; cost_hkd: number; yen_cost: number }
>;

export default function FeeItemsEditor({
  items,
  t,
  groupLabels = RT819_GROUP_LABELS,
}: {
  items: FeeItemRow[];
  t: AdminDict["items"];
  groupLabels?: Record<Rt819Item["group"], string>;
}) {
  const [draft, setDraft] = useState<Draft>(() =>
    Object.fromEntries(
      items.map((it) => [
        it.code,
        { unit_price: it.unit_price, cost_hkd: it.cost_hkd, yen_cost: it.yen_cost },
      ]),
    ),
  );
  const [saved, setSaved] = useState(false);
  const [pending, start] = useTransition();

  const dirty = useMemo(
    () =>
      items.filter((it) => {
        const d = draft[it.code];
        return (
          d.unit_price !== it.unit_price ||
          d.cost_hkd !== it.cost_hkd ||
          d.yen_cost !== it.yen_cost
        );
      }),
    [draft, items],
  );

  const set = (
    code: string,
    field: "unit_price" | "cost_hkd" | "yen_cost",
    value: number,
  ) => setDraft((p) => ({ ...p, [code]: { ...p[code], [field]: value } }));

  const save = () =>
    start(async () => {
      await saveFeeItems(
        dirty.map((it) => ({ code: it.code, ...draft[it.code] })),
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    });

  const cell =
    "w-24 rounded-lg border border-slate-200 px-2 py-1 text-right text-sm outline-none focus:border-brand-500";
  const th =
    "px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-ink-muted";

  const grouped = GROUP_ORDER.map((g) => ({
    g,
    rows: items.filter((it) => it.grp === g),
  })).filter((s) => s.rows.length);

  return (
    <div>
      <div className="space-y-6">
        {grouped.map(({ g, rows }) => (
          <div
            key={g}
            className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-card"
          >
            <div className="border-b border-slate-100 bg-slate-50 px-4 py-2 text-sm font-semibold text-ink-soft">
              {groupLabels[g]}
            </div>
            <table className="w-full min-w-[720px] border-collapse">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className={th}>{t.colItem}</th>
                  <th className={`${th} text-right`}>{t.colPrice}</th>
                  <th className={`${th} text-right`}>{t.colCost}</th>
                  <th className={`${th} text-right`}>{t.colYen}</th>
                  <th className={`${th} text-right`}>{t.colMargin}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((it) => {
                  const d = draft[it.code];
                  const margin = d.unit_price - d.cost_hkd;
                  const pct = d.unit_price
                    ? Math.round((margin / d.unit_price) * 100)
                    : 0;
                  return (
                    <tr key={it.code}>
                      <td className="px-2 py-1.5 text-sm">
                        <div className="font-medium text-ink">{it.desc_en}</div>
                        <div className="text-xs text-ink-muted">
                          {it.code}
                          {it.desc_zh ? ` · ${it.desc_zh}` : ""}
                        </div>
                      </td>
                      <td className="px-2 py-1.5 text-right">
                        <input
                          type="number"
                          step="0.01"
                          value={d.unit_price}
                          onChange={(e) =>
                            set(it.code, "unit_price", Number(e.target.value))
                          }
                          className={cell}
                        />
                      </td>
                      <td className="px-2 py-1.5 text-right">
                        <input
                          type="number"
                          step="0.01"
                          value={d.cost_hkd}
                          onChange={(e) =>
                            set(it.code, "cost_hkd", Number(e.target.value))
                          }
                          className={cell}
                        />
                      </td>
                      <td className="px-2 py-1.5 text-right">
                        <input
                          type="number"
                          step="1"
                          value={d.yen_cost}
                          onChange={(e) =>
                            set(it.code, "yen_cost", Number(e.target.value))
                          }
                          className={cell}
                        />
                      </td>
                      <td
                        className={`px-2 py-1.5 text-right text-sm font-medium ${
                          margin >= 0 ? "text-emerald-700" : "text-rose-600"
                        }`}
                      >
                        {margin.toFixed(2)}
                        <span className="ml-1 text-xs text-ink-muted">
                          {pct}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* Sticky save bar */}
      <div className="sticky bottom-4 mt-6 flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/95 px-4 py-3 shadow-card backdrop-blur">
        <span className="text-sm text-ink-muted">
          {dirty.length ? `${t.dirty.pre}${dirty.length}${t.dirty.post}` : t.hint}
        </span>
        <button
          onClick={save}
          disabled={pending || !dirty.length}
          className="btn-primary text-sm disabled:opacity-50"
        >
          {pending ? t.saving : saved ? t.savedOk : t.saveChanges}
        </button>
      </div>
    </div>
  );
}
