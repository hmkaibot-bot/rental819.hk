import Link from "next/link";
import { listReservations } from "@/lib/reservations/store";
import {
  STATUS_FLOW,
  TERMINAL_STATUS,
  statusMeta,
  type ReservationStatus,
} from "@/lib/reservations/types";

export const dynamic = "force-dynamic";

function fmtDate(d: string | null) {
  return d ? d : "—";
}

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const all = await listReservations();
  const active = searchParams.status as ReservationStatus | undefined;
  const list = active ? all.filter((r) => r.status === active) : all;

  const counts = new Map<string, number>();
  for (const r of all) counts.set(r.status, (counts.get(r.status) ?? 0) + 1);

  return (
    <div>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-xl font-bold">租車預約</h1>
          <p className="text-sm text-ink-muted">共 {all.length} 張預約</p>
        </div>
      </div>

      {/* Pipeline summary */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/admin"
          className={`rounded-full border px-3 py-1.5 text-sm ${
            !active ? "border-brand-500 bg-brand-50 text-brand-700" : "border-slate-200 bg-white text-ink-soft hover:bg-slate-50"
          }`}
        >
          全部 <span className="ml-1 font-semibold">{all.length}</span>
        </Link>
        {[...STATUS_FLOW, ...TERMINAL_STATUS].map((s) => (
          <Link
            key={s.key}
            href={`/admin?status=${s.key}`}
            className={`rounded-full border px-3 py-1.5 text-sm ${
              active === s.key
                ? "border-brand-500 bg-brand-50 text-brand-700"
                : "border-slate-200 bg-white text-ink-soft hover:bg-slate-50"
            }`}
          >
            {s.zh} <span className="ml-1 font-semibold">{counts.get(s.key) ?? 0}</span>
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-card">
        <table className="w-full min-w-[820px] text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-ink-muted">
              <th className="px-4 py-3">編號</th>
              <th className="px-4 py-3">狀態</th>
              <th className="px-4 py-3">客人</th>
              <th className="px-4 py-3">出發店</th>
              <th className="px-4 py-3">取車日期</th>
              <th className="px-4 py-3">車款</th>
            </tr>
          </thead>
          <tbody>
            {list.map((r) => {
              const m = statusMeta(r.status);
              return (
                <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50/60">
                  <td className="px-4 py-3">
                    <Link href={`/admin/reservations/${r.id}`} className="font-semibold text-brand-700 hover:underline">
                      {r.booking_ref ?? "—"}
                    </Link>
                    <div className="text-xs text-ink-muted">{fmtDate(r.request_date)}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${m.tone}`}>
                      {m.zh}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{r.name_en ?? r.name_zh ?? "—"}</div>
                    <div className="text-xs text-ink-muted">{r.name_zh ?? ""}</div>
                  </td>
                  <td className="px-4 py-3">{r.shop ?? "—"}</td>
                  <td className="px-4 py-3">
                    {fmtDate(r.pickup_date)}
                    {r.return_date ? <span className="text-ink-muted"> → {r.return_date}</span> : null}
                  </td>
                  <td className="px-4 py-3 max-w-[220px]">
                    <div className="truncate">{r.confirmed_bike ?? r.bike_pref_1 ?? "—"}</div>
                    {!r.confirmed_bike && r.bike_pref_1 && (
                      <div className="text-xs text-ink-muted">未確認</div>
                    )}
                  </td>
                </tr>
              );
            })}
            {list.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-ink-muted">
                  沒有符合的預約。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
