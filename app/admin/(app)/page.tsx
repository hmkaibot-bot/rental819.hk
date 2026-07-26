import Link from "next/link";
import { listReservations } from "@/lib/reservations/store";
import {
  STATUS_FLOW,
  TERMINAL_STATUS,
  statusMeta,
  type Reservation,
  type ReservationStatus,
} from "@/lib/reservations/types";
import { StatusFilter } from "./status-filter";

export const dynamic = "force-dynamic";

const STATUS_ORDER = [...STATUS_FLOW, ...TERMINAL_STATUS];
const statusIndex = (s: ReservationStatus) => {
  const i = STATUS_ORDER.findIndex((x) => x.key === s);
  return i < 0 ? 99 : i;
};

type SortKey = "booking_ref" | "status" | "name" | "shop" | "pickup_date";
const SORT_KEYS: SortKey[] = ["booking_ref", "status", "name", "shop", "pickup_date"];

function fmtDate(d: string | null) {
  return d ? d : "—";
}
function nameOf(r: Reservation) {
  return r.name_en ?? r.name_zh ?? "";
}
function compare(a: Reservation, b: Reservation, key: SortKey): number {
  switch (key) {
    case "booking_ref":
      return (a.booking_ref ?? "").localeCompare(b.booking_ref ?? "");
    case "status":
      return statusIndex(a.status) - statusIndex(b.status);
    case "name":
      return nameOf(a).localeCompare(nameOf(b));
    case "shop":
      return (a.shop ?? "").localeCompare(b.shop ?? "");
    case "pickup_date":
      return (a.pickup_date ?? "").localeCompare(b.pickup_date ?? "");
    default:
      return 0;
  }
}

/** Build a /admin query string, dropping empty values. */
function qs(p: Record<string, string | undefined>) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(p)) if (v) sp.set(k, v);
  const s = sp.toString();
  return s ? `?${s}` : "";
}

const COLUMNS: { label: string; sort?: SortKey; filter?: boolean }[] = [
  { label: "編號", sort: "booking_ref" },
  { label: "狀態", sort: "status", filter: true },
  { label: "客人", sort: "name" },
  { label: "出發店", sort: "shop" },
  { label: "取車日期", sort: "pickup_date" },
  { label: "車款" },
];

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: { status?: string; sort?: string; dir?: string };
}) {
  const all = await listReservations();

  const activeStatus = searchParams.status as ReservationStatus | undefined;
  const sortKey = SORT_KEYS.includes(searchParams.sort as SortKey)
    ? (searchParams.sort as SortKey)
    : undefined;
  const dir: "asc" | "desc" = searchParams.dir === "desc" ? "desc" : "asc";

  const counts = new Map<string, number>();
  for (const r of all) counts.set(r.status, (counts.get(r.status) ?? 0) + 1);

  const list = activeStatus ? all.filter((r) => r.status === activeStatus) : [...all];
  if (sortKey) list.sort((a, b) => compare(a, b, sortKey) * (dir === "desc" ? -1 : 1));

  const th = "px-4 py-3 text-left align-middle";

  return (
    <div>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-xl font-bold">租車預約</h1>
          <p className="text-sm text-ink-muted">
            共 {all.length} 張預約
            {activeStatus
              ? ` · 篩選：${statusMeta(activeStatus).zh}（${list.length}）`
              : ""}
          </p>
        </div>
        {activeStatus && (
          <Link
            href={`/admin${qs({ sort: sortKey, dir: sortKey ? dir : undefined })}`}
            className="text-sm text-brand-700 hover:underline"
          >
            清除篩選 ✕
          </Link>
        )}
      </div>

      {/* Table — sorting & status filter live in the header row */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-card">
        <table className="w-full min-w-[820px] text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-ink-muted">
              {COLUMNS.map((c) => {
                const active = !!c.sort && sortKey === c.sort;
                const nextDir = active && dir === "asc" ? "desc" : "asc";
                return (
                  <th key={c.label} className={th}>
                    <div className="flex items-center gap-1.5">
                      {c.sort ? (
                        <Link
                          href={`/admin${qs({ status: activeStatus, sort: c.sort, dir: nextDir })}`}
                          className={`inline-flex items-center gap-1 hover:text-ink ${active ? "text-ink" : ""}`}
                        >
                          {c.label}
                          <span className="text-[10px] leading-none">
                            {active ? (dir === "asc" ? "▲" : "▼") : "↕"}
                          </span>
                        </Link>
                      ) : (
                        <span>{c.label}</span>
                      )}

                      {c.filter && (
                        <StatusFilter
                          value={activeStatus ?? ""}
                          keep={{ sort: sortKey, dir: sortKey ? dir : undefined }}
                          options={[
                            { key: "", label: "全部", count: all.length },
                            ...STATUS_ORDER.map((s) => ({
                              key: s.key,
                              label: s.zh,
                              count: counts.get(s.key) ?? 0,
                            })),
                          ]}
                        />
                      )}
                    </div>
                  </th>
                );
              })}
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
