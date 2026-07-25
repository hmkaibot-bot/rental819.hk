"use client";

import { useMemo, useState, useTransition } from "react";
import type { Reservation, InvoiceItem } from "@/lib/reservations/types";
import { ISSUER, fmtHKD, invoiceTotal } from "@/lib/reservations/invoice";
import { saveInvoice } from "@/app/admin/(app)/reservations/[id]/invoice/actions";

export default function InvoiceEditor({
  reservation,
  seed,
}: {
  reservation: Reservation;
  seed: InvoiceItem[];
}) {
  const r = reservation;
  const [si, setSi] = useState(r.si_number ?? "");
  const [date, setDate] = useState(r.invoice_date ?? new Date().toISOString().slice(0, 10));
  const [items, setItems] = useState<InvoiceItem[]>(
    r.invoice_items?.length ? r.invoice_items : seed,
  );
  const [saved, setSaved] = useState(false);
  const [pending, start] = useTransition();

  const total = useMemo(() => invoiceTotal(items), [items]);

  const update = (i: number, patch: Partial<InvoiceItem>) =>
    setItems((prev) =>
      prev.map((it, idx) => {
        if (idx !== i) return it;
        const next = { ...it, ...patch };
        next.amount = Number((Number(next.qty) * Number(next.unit_price)).toFixed(2));
        return next;
      }),
    );

  const addRow = () =>
    setItems((prev) => [...prev, { description: "", qty: 1, unit_price: 0, amount: 0 }]);
  const removeRow = (i: number) => setItems((prev) => prev.filter((_, idx) => idx !== i));

  const save = (markInvoiced: boolean) =>
    start(async () => {
      await saveInvoice({
        id: r.id,
        si_number: si || null,
        invoice_date: date || null,
        invoice_items: items,
        markInvoiced,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    });

  const cell = "rounded-lg border border-slate-200 px-2 py-1.5 text-sm outline-none focus:border-brand-500";

  return (
    <div>
      {/* ---- Editor (hidden when printing) ---- */}
      <div className="no-print mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1 block font-medium text-ink-soft">單號 (SI No.)</span>
            <input value={si} onChange={(e) => setSi(e.target.value)} placeholder="SI-26-xxxxx" className={`${cell} w-full`} />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium text-ink-soft">單據日期</span>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={`${cell} w-full`} />
          </label>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-ink-muted">
                <th className="py-1 pr-2">項目說明</th>
                <th className="w-16 py-1 px-2">數量</th>
                <th className="w-28 py-1 px-2">單價 (HK$)</th>
                <th className="w-28 py-1 px-2 text-right">金額</th>
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, i) => (
                <tr key={i}>
                  <td className="py-1 pr-2">
                    <input value={it.description} onChange={(e) => update(i, { description: e.target.value })} className={`${cell} w-full`} />
                  </td>
                  <td className="py-1 px-2">
                    <input type="number" value={it.qty} onChange={(e) => update(i, { qty: Number(e.target.value) })} className={`${cell} w-full`} />
                  </td>
                  <td className="py-1 px-2">
                    <input type="number" value={it.unit_price} onChange={(e) => update(i, { unit_price: Number(e.target.value) })} className={`${cell} w-full`} />
                  </td>
                  <td className="py-1 px-2 text-right font-medium">{fmtHKD(it.amount)}</td>
                  <td className="py-1 text-center">
                    <button onClick={() => removeRow(i)} className="text-slate-400 hover:text-rose-600" aria-label="刪除">×</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <button onClick={addRow} className="text-sm font-medium text-brand-700 hover:underline">+ 加一行</button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-ink-muted">合計</span>
            <span className="text-lg font-black text-ink">{fmtHKD(total)}</span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={() => save(true)} disabled={pending} className="btn-primary text-sm disabled:opacity-60">
            {pending ? "儲存中…" : saved ? "已儲存 ✓" : "儲存並標記已開單"}
          </button>
          <button onClick={() => save(false)} disabled={pending} className="btn-outline text-sm">
            只儲存
          </button>
          <button onClick={() => window.print()} className="btn-brand text-sm">
            列印 / 儲存為 PDF
          </button>
        </div>
      </div>

      {/* ---- Print-ready invoice ---- */}
      <div className="print-area mx-auto max-w-[800px] rounded-2xl border border-slate-200 bg-white p-8 shadow-card print:rounded-none print:border-0 print:shadow-none">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-2xl font-black text-brand-700">
              RENTAL<span className="text-accent-500">819</span>
              <span className="ml-1 text-sm font-semibold text-ink-muted">.HK</span>
            </div>
            <div className="mt-1 text-sm text-ink-soft">{ISSUER.name}</div>
            <div className="mt-1 text-xs leading-5 text-ink-muted">
              {ISSUER.addressLines.filter(Boolean).map((l) => (
                <div key={l}>{l}</div>
              ))}
              <div>{ISSUER.phone} · {ISSUER.email}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold tracking-wide text-ink">INVOICE 單據</div>
            <div className="mt-2 text-sm">
              <div><span className="text-ink-muted">單號 No.：</span><span className="font-semibold">{si || "—"}</span></div>
              <div><span className="text-ink-muted">日期 Date：</span>{date || "—"}</div>
              <div><span className="text-ink-muted">預約 Ref：</span>{r.booking_ref ?? "—"}</div>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-lg bg-slate-50 p-4 text-sm">
          <div className="text-xs uppercase tracking-wide text-ink-muted">Bill to 客戶</div>
          <div className="mt-1 font-semibold">{r.name_en ?? r.name_zh}</div>
          <div className="text-ink-soft">{r.name_zh}</div>
          <div className="text-ink-muted">{r.email} · {r.hk_phone}</div>
        </div>

        <table className="mt-6 w-full text-sm">
          <thead>
            <tr className="border-b-2 border-slate-200 text-left text-xs uppercase tracking-wide text-ink-muted">
              <th className="py-2">項目說明 Description</th>
              <th className="w-16 py-2 text-center">數量</th>
              <th className="w-32 py-2 text-right">單價</th>
              <th className="w-32 py-2 text-right">金額</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={i} className="border-b border-slate-100">
                <td className="py-2.5">{it.description || "—"}</td>
                <td className="py-2.5 text-center">{it.qty}</td>
                <td className="py-2.5 text-right">{fmtHKD(it.unit_price)}</td>
                <td className="py-2.5 text-right">{fmtHKD(it.amount)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="py-3 text-right font-semibold">總計 Total</td>
              <td className="py-3 text-right text-lg font-black text-brand-700">{fmtHKD(total)}</td>
            </tr>
          </tfoot>
        </table>

        <div className="mt-10 border-t border-slate-100 pt-4 text-xs leading-5 text-ink-muted">
          付款方式：轉數快 (FPS) / 銀行轉帳予「頭盔王 Helmet King」。請於單據發出後之工作天內完成付款。
          <br />
          多謝惠顧！ Helmet King × RENTAL819.HK — 日本電單車自駕遊。
        </div>
      </div>
    </div>
  );
}
