import Link from "next/link";
import { listReservations } from "@/lib/reservations/store";
import { invoiceTotal, fmtAmount } from "@/lib/reservations/invoice";
import { RT819_EXCHANGE_RATE } from "@/lib/reservations/items";
import { statusMeta, type Reservation } from "@/lib/reservations/types";
import { recordSupplierPayment } from "./actions";

export const dynamic = "force-dynamic";

const BILLED = ["invoiced", "paid", "customer_confirmed", "settled"];

function revenue(r: Reservation) {
  return invoiceTotal(r.invoice_items ?? []);
}
function costHkd(r: Reservation) {
  return (Number(r.cost_jpy) || 0) * RT819_EXCHANGE_RATE;
}

export default async function AccountingPage() {
  const all = await listReservations();
  const rows = all.filter((r) => BILLED.includes(r.status) || r.si_number || (r.invoice_items?.length ?? 0) > 0);

  const totals = rows.reduce(
    (acc, r) => {
      const rev = revenue(r);
      const cost = costHkd(r);
      acc.rev += rev;
      acc.cost += cost;
      acc.profit += rev - cost;
      if (!r.paid_to_supplier) acc.outstanding += cost;
      return acc;
    },
    { rev: 0, cost: 0, profit: 0, outstanding: 0 },
  );

  const th = "px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-ink-muted";
  const td = "px-2 py-2 text-sm";

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold">會計 / 月結</h1>
        <Link href="/admin" className="text-sm text-brand-700 hover:underline">預約列表 →</Link>
      </div>

      {/* Summary cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        {[
          ["總收入 Revenue", totals.rev, "text-ink"],
          ["總成本 Cost", totals.cost, "text-ink"],
          ["總利潤 Profit", totals.profit, "text-emerald-700"],
          ["未付供應商 Outstanding", totals.outstanding, "text-accent-700"],
        ].map(([label, val, tone]) => (
          <div key={label as string} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
            <div className="text-xs text-ink-muted">{label as string}</div>
            <div className={`mt-1 text-xl font-black ${tone as string}`}>HK${fmtAmount(val as number)}</div>
          </div>
        ))}
      </div>

      <form action={recordSupplierPayment}>
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-card">
          <table className="w-full min-w-[860px] border-collapse">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className={th}>
                  <span className="sr-only">選取</span>
                </th>
                <th className={th}>預約</th>
                <th className={th}>客人</th>
                <th className={th}>單號 SI</th>
                <th className={`${th} text-right`}>收入</th>
                <th className={`${th} text-right`}>成本 (¥)</th>
                <th className={`${th} text-right`}>成本 (HK$)</th>
                <th className={`${th} text-right`}>利潤</th>
                <th className={th}>供應商付款</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r) => {
                const rev = revenue(r);
                const cost = costHkd(r);
                const m = statusMeta(r.status);
                return (
                  <tr key={r.id} className={r.paid_to_supplier ? "bg-emerald-50/40" : ""}>
                    <td className={td}>
                      {!r.paid_to_supplier && (
                        <input type="checkbox" name="ids" value={r.id} className="h-4 w-4 rounded border-slate-300" />
                      )}
                    </td>
                    <td className={td}>
                      <Link href={`/admin/reservations/${r.id}`} className="font-medium text-brand-700 hover:underline">
                        {r.booking_ref}
                      </Link>
                      <div className="text-xs text-ink-muted">{m.zh}</div>
                    </td>
                    <td className={td}>{r.name_en ?? r.name_zh ?? "—"}</td>
                    <td className={td}>{r.si_number ?? "—"}</td>
                    <td className={`${td} text-right`}>{fmtAmount(rev)}</td>
                    <td className={`${td} text-right`}>{r.cost_jpy ? Number(r.cost_jpy).toLocaleString("en-US") : "—"}</td>
                    <td className={`${td} text-right`}>{fmtAmount(cost)}</td>
                    <td className={`${td} text-right font-medium ${rev - cost >= 0 ? "text-emerald-700" : "text-rose-600"}`}>
                      {fmtAmount(rev - cost)}
                    </td>
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
              {rows.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-sm text-ink-muted">未有已開單的預約。</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Batch settlement */}
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <span className="text-sm font-medium text-ink-soft">月結：剔選上面多個預約，記錄向日本供應商付款</span>
          <input type="date" name="supplier_paid_date" className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm" />
          <button className="btn-primary text-sm">記錄向供應商付款</button>
        </div>
      </form>
    </div>
  );
}
