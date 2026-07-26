"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { recordSupplierPayment } from "./actions";

export type AcctRow = {
  id: string;
  booking_ref: string | null;
  name: string;
  si_number: string | null;
  status_zh: string;
  status_tone: string;
  pickup_date: string | null;
  return_date: string | null;
  revenue: number;
  cost_jpy: number | null;
  cost_hkd: number;
  paid_to_supplier: boolean;
  supplier_paid_date: string | null;
};

const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 2 });
const profitOf = (r: AcctRow) => r.revenue - r.cost_hkd;

type ColKey =
  | "booking_ref"
  | "name"
  | "si"
  | "pickup"
  | "return"
  | "revenue"
  | "cost_jpy"
  | "cost_hkd"
  | "profit"
  | "supplier";

type Col = {
  key: ColKey;
  label: string;
  align?: "right";
  numeric?: boolean;
  filter: "text" | "select" | "none";
  sortVal: (r: AcctRow) => string | number;
  text: (r: AcctRow) => string; // used for text filtering
};

const COLS: Col[] = [
  { key: "booking_ref", label: "預約", filter: "text", sortVal: (r) => r.booking_ref ?? "", text: (r) => r.booking_ref ?? "" },
  { key: "name", label: "客人", filter: "text", sortVal: (r) => r.name, text: (r) => r.name },
  { key: "si", label: "單號 SI", filter: "text", sortVal: (r) => r.si_number ?? "", text: (r) => r.si_number ?? "" },
  { key: "pickup", label: "取車日期", filter: "text", sortVal: (r) => r.pickup_date ?? "", text: (r) => r.pickup_date ?? "" },
  { key: "return", label: "還車日期", filter: "text", sortVal: (r) => r.return_date ?? "", text: (r) => r.return_date ?? "" },
  { key: "revenue", label: "收入", align: "right", numeric: true, filter: "text", sortVal: (r) => r.revenue, text: (r) => fmt(r.revenue) },
  { key: "cost_jpy", label: "成本 (¥)", align: "right", numeric: true, filter: "text", sortVal: (r) => r.cost_jpy ?? 0, text: (r) => (r.cost_jpy ? Number(r.cost_jpy).toLocaleString("en-US") : "") },
  { key: "cost_hkd", label: "成本 (HK$)", align: "right", numeric: true, filter: "text", sortVal: (r) => r.cost_hkd, text: (r) => fmt(r.cost_hkd) },
  { key: "profit", label: "利潤", align: "right", numeric: true, filter: "text", sortVal: (r) => profitOf(r), text: (r) => fmt(profitOf(r)) },
  { key: "supplier", label: "供應商付款", filter: "select", sortVal: (r) => (r.paid_to_supplier ? 1 : 0), text: (r) => (r.paid_to_supplier ? `已付 ${r.supplier_paid_date ?? ""}` : "未付") },
];

export default function AccountingTable({ rows }: { rows: AcctRow[] }) {
  const [year, setYear] = useState("all");
  const [month, setMonth] = useState("all");
  const [colFilter, setColFilter] = useState<Record<string, string>>({});
  const [supplierFilter, setSupplierFilter] = useState<"all" | "paid" | "unpaid">("all");
  const [sortKey, setSortKey] = useState<ColKey | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [date, setDate] = useState("");
  const [pending, startTransition] = useTransition();

  const years = useMemo(() => {
    const s = new Set<string>();
    for (const r of rows) if (r.pickup_date) s.add(r.pickup_date.slice(0, 4));
    return [...s].sort((a, b) => b.localeCompare(a));
  }, [rows]);

  const filtered = useMemo(() => {
    let out = rows;
    if (year !== "all") out = out.filter((r) => (r.pickup_date ?? "").slice(0, 4) === year);
    if (month !== "all") out = out.filter((r) => (r.pickup_date ?? "").slice(5, 7) === month);
    if (supplierFilter !== "all")
      out = out.filter((r) => (supplierFilter === "paid" ? r.paid_to_supplier : !r.paid_to_supplier));
    for (const c of COLS) {
      if (c.filter !== "text") continue;
      const q = (colFilter[c.key] ?? "").trim().toLowerCase();
      if (q) out = out.filter((r) => c.text(r).toLowerCase().includes(q));
    }
    if (sortKey) {
      const col = COLS.find((c) => c.key === sortKey)!;
      const sign = sortDir === "desc" ? -1 : 1;
      out = [...out].sort((a, b) => {
        const va = col.sortVal(a);
        const vb = col.sortVal(b);
        if (typeof va === "number" && typeof vb === "number") return (va - vb) * sign;
        return String(va).localeCompare(String(vb)) * sign;
      });
    }
    return out;
  }, [rows, year, month, supplierFilter, colFilter, sortKey, sortDir]);

  const totals = useMemo(
    () =>
      filtered.reduce(
        (acc, r) => {
          acc.rev += r.revenue;
          acc.cost += r.cost_hkd;
          acc.profit += profitOf(r);
          if (!r.paid_to_supplier) acc.outstanding += r.cost_hkd;
          return acc;
        },
        { rev: 0, cost: 0, profit: 0, outstanding: 0 },
      ),
    [filtered],
  );

  const allSelected = filtered.length > 0 && filtered.every((r) => selected.has(r.id));
  const toggleAll = () =>
    setSelected(allSelected ? new Set() : new Set(filtered.map((r) => r.id)));
  const toggleOne = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const submit = (paid: boolean) => {
    if (selected.size === 0) return;
    const fd = new FormData();
    selected.forEach((id) => fd.append("ids", id));
    fd.set("paid", paid ? "1" : "0");
    if (date) fd.set("supplier_paid_date", date);
    startTransition(async () => {
      await recordSupplierPayment(fd);
      setSelected(new Set());
    });
  };

  const resetFilters = () => {
    setYear("all");
    setMonth("all");
    setColFilter({});
    setSupplierFilter("all");
    setSortKey(null);
  };

  const th = "px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-ink-muted whitespace-nowrap";
  const td = "px-2 py-2 text-sm whitespace-nowrap";
  const filterInput =
    "w-full rounded border border-slate-200 px-1.5 py-1 text-xs font-normal normal-case outline-none focus:border-brand-500";

  const active = (k: ColKey) => sortKey === k;
  const clickSort = (k: ColKey) => {
    if (sortKey === k) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
      setSortKey(k);
      setSortDir("asc");
    }
  };

  return (
    <div>
      {/* Summary cards (reflect the current filter) */}
      <div className="mb-5 grid gap-4 sm:grid-cols-4">
        {[
          ["總收入 Revenue", totals.rev, "text-ink"],
          ["總成本 Cost", totals.cost, "text-ink"],
          ["總利潤 Profit", totals.profit, "text-emerald-700"],
          ["未付供應商 Outstanding", totals.outstanding, "text-accent-700"],
        ].map(([label, val, tone]) => (
          <div key={label as string} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
            <div className="text-xs text-ink-muted">{label as string}</div>
            <div className={`mt-1 text-xl font-black ${tone as string}`}>HK${fmt(val as number)}</div>
          </div>
        ))}
      </div>

      {/* Period statistics toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-card">
        <span className="text-sm font-medium text-ink-soft">統計期間（依取車日期）</span>
        <select value={year} onChange={(e) => setYear(e.target.value)} className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm">
          <option value="all">全部年份</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        <select value={month} onChange={(e) => setMonth(e.target.value)} className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm">
          <option value="all">全部月份</option>
          {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0")).map((m) => (
            <option key={m} value={m}>{Number(m)} 月</option>
          ))}
        </select>
        <span className="text-sm text-ink-muted">顯示 {filtered.length} 張</span>
        <button type="button" onClick={resetFilters} className="ml-auto text-sm text-brand-700 hover:underline">
          重設篩選
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-card">
        <table className="min-w-full border-collapse">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className={th}>
                <input type="checkbox" checked={allSelected} onChange={toggleAll} className="h-4 w-4 rounded border-slate-300" aria-label="全選" />
              </th>
              {COLS.map((c) => (
                <th key={c.key} className={`${th} ${c.align === "right" ? "text-right" : ""}`}>
                  <button type="button" onClick={() => clickSort(c.key)} className={`inline-flex items-center gap-1 hover:text-ink ${active(c.key) ? "text-ink" : ""}`}>
                    {c.label}
                    <span className="text-[10px] leading-none">{active(c.key) ? (sortDir === "asc" ? "▲" : "▼") : "↕"}</span>
                  </button>
                </th>
              ))}
            </tr>
            {/* Filter row */}
            <tr className="border-t border-slate-100">
              <th className="px-2 py-1.5" />
              {COLS.map((c) => (
                <th key={c.key} className="px-2 py-1.5">
                  {c.filter === "text" && (
                    <input
                      value={colFilter[c.key] ?? ""}
                      onChange={(e) => setColFilter((p) => ({ ...p, [c.key]: e.target.value }))}
                      placeholder="篩選…"
                      className={filterInput}
                    />
                  )}
                  {c.filter === "select" && (
                    <select
                      value={supplierFilter}
                      onChange={(e) => setSupplierFilter(e.target.value as "all" | "paid" | "unpaid")}
                      className={filterInput}
                    >
                      <option value="all">全部</option>
                      <option value="paid">已付</option>
                      <option value="unpaid">未付</option>
                    </select>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((r) => {
              const profit = profitOf(r);
              return (
                <tr key={r.id} className={r.paid_to_supplier ? "bg-emerald-50/40" : ""}>
                  <td className={td}>
                    <input type="checkbox" checked={selected.has(r.id)} onChange={() => toggleOne(r.id)} className="h-4 w-4 rounded border-slate-300" />
                  </td>
                  <td className={td}>
                    <Link href={`/admin/reservations/${r.id}`} className="font-medium text-brand-700 hover:underline">
                      {r.booking_ref ?? "—"}
                    </Link>
                    <div className={`text-xs ${r.status_tone.split(" ").find((c) => c.startsWith("text-")) ?? "text-ink-muted"}`}>{r.status_zh}</div>
                  </td>
                  <td className={td}>{r.name}</td>
                  <td className={td}>{r.si_number ?? "—"}</td>
                  <td className={td}>{r.pickup_date ?? "—"}</td>
                  <td className={td}>{r.return_date ?? "—"}</td>
                  <td className={`${td} text-right`}>{fmt(r.revenue)}</td>
                  <td className={`${td} text-right`}>{r.cost_jpy ? Number(r.cost_jpy).toLocaleString("en-US") : "—"}</td>
                  <td className={`${td} text-right`}>{fmt(r.cost_hkd)}</td>
                  <td className={`${td} text-right font-medium ${profit >= 0 ? "text-emerald-700" : "text-rose-600"}`}>{fmt(profit)}</td>
                  <td className={td}>
                    {r.paid_to_supplier ? (
                      <span className="text-xs text-emerald-700">已付 {r.supplier_paid_date ?? ""}</span>
                    ) : (
                      <span className="text-xs text-ink-muted">未付</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={COLS.length + 1} className="px-4 py-8 text-center text-sm text-ink-muted">
                  未有符合的預約。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Batch supplier-payment bar */}
      <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
        <span className="text-sm font-medium text-ink-soft">
          月結：已選 <span className="font-bold text-brand-700">{selected.size}</span> 張
        </span>
        <label className="text-sm text-ink-soft">向供應商付款日期</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm" />
        <button type="button" disabled={selected.size === 0 || pending} onClick={() => submit(true)} className="btn-primary text-sm disabled:opacity-50">
          標記已付款
        </button>
        <button type="button" disabled={selected.size === 0 || pending} onClick={() => submit(false)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-ink-soft hover:bg-slate-50 disabled:opacity-50">
          標記未付款
        </button>
        {pending && <span className="text-xs text-ink-muted">更新中…</span>}
      </div>
    </div>
  );
}
