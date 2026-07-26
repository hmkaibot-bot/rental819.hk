import Link from "next/link";
import type { ReactNode } from "react";
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

// Three books, mirroring the master Excel sheets: 2026 FIT / 2025 FIT / 2025 PKG.
type TabKey = "2026" | "2025" | "pkg";
const TABS: { key: TabKey; label: string }[] = [
  { key: "2026", label: "2026" },
  { key: "2025", label: "2025" },
  { key: "pkg", label: "2025 PKG" },
];
function tabOf(r: Reservation): TabKey {
  const ref = r.booking_ref ?? "";
  if (ref.startsWith("P-")) return "pkg"; // 套票 P-YYYY-nnn
  if (ref.startsWith("2026")) return "2026";
  return "2025";
}

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

// ---- Cell renderers (columns mirror the master Excel sheet, left → right) ----
const dash = <span className="text-ink-muted">—</span>;
const txt = (v?: string | null): ReactNode => (v ? v : dash);
const trunc = (v: string | null | undefined, cls: string): ReactNode =>
  v ? <div className={`truncate ${cls}`}>{v}</div> : dash;
const tick = (v?: boolean): ReactNode =>
  v ? <span className="font-semibold text-emerald-600">✔</span> : dash;
const num = (v?: number): ReactNode => (v && v > 0 ? `×${v}` : dash);

type Column = {
  label: string;
  sort?: SortKey;
  filter?: boolean;
  cls?: string;
  cell: (r: Reservation) => ReactNode;
};

const COLUMNS: Column[] = [
  {
    label: "編號",
    sort: "booking_ref",
    cls: "whitespace-nowrap",
    cell: (r) => (
      <>
        <Link href={`/admin/reservations/${r.id}`} className="font-semibold text-brand-700 hover:underline">
          {r.booking_ref ?? "—"}
        </Link>
        <div className="text-xs text-ink-muted">{fmtDate(r.request_date)}</div>
      </>
    ),
  },
  {
    label: "狀態",
    sort: "status",
    filter: true,
    cls: "whitespace-nowrap",
    cell: (r) => {
      const m = statusMeta(r.status);
      return (
        <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${m.tone}`}>
          {m.zh}
        </span>
      );
    },
  },
  { label: "電郵", cls: "whitespace-nowrap", cell: (r) => txt(r.email) },
  { label: "香港聯絡電話", cls: "whitespace-nowrap", cell: (r) => txt(r.hk_phone) },
  { label: "中文姓名", cls: "whitespace-nowrap", cell: (r) => txt(r.name_zh) },
  { label: "英文姓名", sort: "name", cls: "whitespace-nowrap", cell: (r) => txt(r.name_en) },
  { label: "性別", cls: "whitespace-nowrap", cell: (r) => txt(r.gender) },
  { label: "出生年月日", cls: "whitespace-nowrap", cell: (r) => txt(r.dob) },
  { label: "國籍居住地址", cell: (r) => trunc(r.hk_address, "max-w-[220px]") },
  { label: "日本住宿地址", cell: (r) => trunc(r.jp_address, "max-w-[220px]") },
  { label: "日本手提電話", cls: "whitespace-nowrap", cell: (r) => txt(r.jp_phone) },
  { label: "日語能力", cell: (r) => trunc(r.japanese_ability, "max-w-[160px]") },
  { label: "英語能力", cell: (r) => trunc(r.english_ability, "max-w-[160px]") },
  { label: "出發店", sort: "shop", cls: "whitespace-nowrap", cell: (r) => txt(r.shop) },
  { label: "首選", cell: (r) => trunc(r.bike_pref_1, "max-w-[200px]") },
  { label: "次選", cell: (r) => trunc(r.bike_pref_2, "max-w-[200px]") },
  { label: "第三選", cell: (r) => trunc(r.bike_pref_3, "max-w-[200px]") },
  { label: "取車日期", sort: "pickup_date", cls: "whitespace-nowrap", cell: (r) => txt(r.pickup_date) },
  { label: "取車時間", cls: "whitespace-nowrap", cell: (r) => txt(r.pickup_time) },
  { label: "還車日期", cls: "whitespace-nowrap", cell: (r) => txt(r.return_date) },
  { label: "還車時間", cls: "whitespace-nowrap", cell: (r) => txt(r.return_time) },
  { label: "CARDO", cls: "text-center", cell: (r) => tick(r.addons?.cardo) },
  { label: "尾箱", cls: "text-center", cell: (r) => tick(r.addons?.topcase) },
  { label: "側袋", cls: "text-center", cell: (r) => tick(r.addons?.sidebag) },
  { label: "側箱", cls: "text-center", cell: (r) => tick(r.addons?.pannier) },
  { label: "全盔", cls: "whitespace-nowrap text-center", cell: (r) => num(r.addons?.full_face) },
  { label: "開面盔", cls: "whitespace-nowrap text-center", cell: (r) => num(r.addons?.open_face) },
  { label: "MamoRide 保險", cls: "text-center", cell: (r) => tick(r.addons?.mamoride) },
  { label: "穿梭巴士", cls: "text-center", cell: (r) => tick(r.addons?.shuttle_bus) },
  { label: "行李寄存", cls: "text-center", cell: (r) => tick(r.addons?.luggage_storage) },
  { label: "ETC", cls: "text-center", cell: (r) => tick(r.addons?.etc) },
  { label: "緊急聯絡人", cls: "whitespace-nowrap", cell: (r) => txt(r.emergency_contact) },
  { label: "緊急聯絡人號碼", cls: "whitespace-nowrap", cell: (r) => txt(r.emergency_phone) },
  { label: "優惠", cls: "whitespace-nowrap", cell: (r) => txt(r.promo) },
];

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: { tab?: string; status?: string; sort?: string; dir?: string };
}) {
  const all = await listReservations();

  const tab: TabKey = TABS.some((t) => t.key === searchParams.tab)
    ? (searchParams.tab as TabKey)
    : "2026";
  const activeStatus = searchParams.status as ReservationStatus | undefined;
  const sortKey = SORT_KEYS.includes(searchParams.sort as SortKey)
    ? (searchParams.sort as SortKey)
    : undefined;
  const dir: "asc" | "desc" = searchParams.dir === "desc" ? "desc" : "asc";

  const tabCount = (k: TabKey) => all.filter((r) => tabOf(r) === k).length;
  const tabRows = all.filter((r) => tabOf(r) === tab);

  // Status counts are scoped to the active tab so the filter reflects this book.
  const counts = new Map<string, number>();
  for (const r of tabRows) counts.set(r.status, (counts.get(r.status) ?? 0) + 1);

  const list = activeStatus ? tabRows.filter((r) => r.status === activeStatus) : [...tabRows];
  if (sortKey) list.sort((a, b) => compare(a, b, sortKey) * (dir === "desc" ? -1 : 1));

  const th = "px-3 py-3 text-left align-middle whitespace-nowrap";

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">租車預約</h1>
          <p className="text-sm text-ink-muted">
            共 {tabRows.length} 張預約
            {activeStatus
              ? ` · 篩選：${statusMeta(activeStatus).zh}（${list.length}）`
              : ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {activeStatus && (
            <Link
              href={`/admin${qs({ tab, sort: sortKey, dir: sortKey ? dir : undefined })}`}
              className="text-sm text-brand-700 hover:underline"
            >
              清除篩選 ✕
            </Link>
          )}
          <Link href="/admin/reservations/new" className="btn-brand text-sm">
            ＋ 新增預約
          </Link>
        </div>
      </div>

      {/* Books — one per master-Excel sheet */}
      <div className="mb-5 flex gap-1 border-b border-slate-200">
        {TABS.map((t) => {
          const activeT = tab === t.key;
          return (
            <Link
              key={t.key}
              href={`/admin${qs({ tab: t.key, status: activeStatus, sort: sortKey, dir: sortKey ? dir : undefined })}`}
              className={`-mb-px inline-flex items-center gap-1.5 rounded-t-lg border-b-2 px-4 py-2 text-sm font-medium ${
                activeT
                  ? "border-brand-600 text-brand-700"
                  : "border-transparent text-ink-muted hover:text-ink hover:border-slate-300"
              }`}
            >
              {t.label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-xs tabular-nums ${
                  activeT ? "bg-brand-50 text-brand-700" : "bg-slate-100 text-ink-muted"
                }`}
              >
                {tabCount(t.key)}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Table — sorting & status filter live in the header row; columns keep
          their width and the whole table scrolls sideways on narrow screens. */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-card">
        <table className="min-w-full text-sm">
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
                          href={`/admin${qs({ tab, status: activeStatus, sort: c.sort, dir: nextDir })}`}
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
                          keep={{ tab, sort: sortKey, dir: sortKey ? dir : undefined }}
                          options={[
                            { key: "", label: "全部", count: tabRows.length },
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
            {list.map((r) => (
              <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50/60">
                {COLUMNS.map((c) => (
                  <td key={c.label} className={`px-3 py-3 align-top ${c.cls ?? ""}`}>
                    {c.cell(r)}
                  </td>
                ))}
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length} className="px-4 py-10 text-center text-ink-muted">
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
