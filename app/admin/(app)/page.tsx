import Link from "next/link";
import type { ReactNode } from "react";
import { listReservations } from "@/lib/reservations/store";
import { canWrite } from "@/lib/admin/auth";
import { getAdminLang } from "@/lib/admin/lang";
import { adminDict, type AdminLang } from "@/lib/admin/i18n";
import {
  STATUS_FLOW,
  TERMINAL_STATUS,
  statusMeta,
  type Reservation,
  type ReservationStatus,
} from "@/lib/reservations/types";
import { StatusFilter } from "./status-filter";
import { StatusSelect } from "./status-select";

/** Status label in the operator's language. */
const statusName = (s: { zh: string; ja: string }, lang: AdminLang) =>
  lang === "ja" ? s.ja : s.zh;

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
const DEFAULT_SORT: SortKey = "booking_ref";
const DEFAULT_DIR: "asc" | "desc" = "desc";

function fmtDate(d: string | null) {
  return d ? d : "—";
}
function nameOf(r: Reservation) {
  return r.name_en ?? r.name_zh ?? "";
}
function compare(a: Reservation, b: Reservation, key: SortKey): number {
  switch (key) {
    case "booking_ref":
      // Numeric collation: refs are YYYY-NNN, so 2026-100 must outrank 2026-099
      // even once the sequence grows past three digits.
      return (a.booking_ref ?? "").localeCompare(b.booking_ref ?? "", undefined, { numeric: true });
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
  label: string; // 中文 header
  ja?: string; // Japanese header (中日對照, from the master Excel)
  sort?: SortKey;
  filter?: boolean;
  cls?: string;
  cell: (r: Reservation, lang: AdminLang, ctx: { readOnly: boolean }) => ReactNode;
};

/** Header text in the chosen language, with the other language underneath. */
function heads(c: Column, lang: AdminLang): { main: string; sub?: string } {
  if (lang === "ja" && c.ja) return { main: c.ja, sub: c.label };
  return { main: c.label, sub: c.ja };
}

const COLUMNS: Column[] = [
  {
    label: "編號",
    ja: "予約番号",
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
    ja: "状態",
    sort: "status",
    filter: true,
    cls: "whitespace-nowrap",
    cell: (r, lang, ctx) => {
      const m = statusMeta(r.status);
      if (ctx.readOnly) {
        return (
          <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${m.tone}`}>
            {statusName(m, lang)}
          </span>
        );
      }
      // key remounts the select when another session moved the status, so the
      // local pick never masks fresher server data.
      return (
        <StatusSelect
          key={r.status}
          id={r.id}
          value={r.status}
          ariaLabel={lang === "ja" ? "状態" : "狀態"}
          paidDateRequired={adminDict(lang).dashboard.paidDateRequired}
          options={STATUS_ORDER.map((s) => ({
            key: s.key,
            label: statusName(s, lang),
            tone: s.tone,
          }))}
        />
      );
    },
  },
  { label: "電郵", ja: "メール", cls: "whitespace-nowrap", cell: (r) => txt(r.email) },
  { label: "香港聯絡電話", ja: "連絡先番号", cls: "whitespace-nowrap", cell: (r) => txt(r.hk_phone) },
  { label: "中文姓名", ja: "中国語名", cls: "whitespace-nowrap", cell: (r) => txt(r.name_zh) },
  { label: "英文姓名", ja: "英語名", sort: "name", cls: "whitespace-nowrap", cell: (r) => txt(r.name_en) },
  { label: "性別", ja: "性別", cls: "whitespace-nowrap", cell: (r) => txt(r.gender) },
  { label: "出生年月日", ja: "生年月日", cls: "whitespace-nowrap", cell: (r) => txt(r.dob) },
  { label: "國籍居住地址", ja: "香港住所", cell: (r) => trunc(r.hk_address, "max-w-[220px]") },
  { label: "日本住宿地址", ja: "JPアドレス", cell: (r) => trunc(r.jp_address, "max-w-[220px]") },
  { label: "日本手提電話", ja: "JP連絡先番号", cls: "whitespace-nowrap", cell: (r) => txt(r.jp_phone) },
  { label: "日語能力", ja: "日本語能力", cell: (r) => trunc(r.japanese_ability, "max-w-[160px]") },
  { label: "英語能力", ja: "英語力", cell: (r) => trunc(r.english_ability, "max-w-[160px]") },
  { label: "出發店", ja: "店", sort: "shop", cls: "whitespace-nowrap", cell: (r) => txt(r.shop) },
  { label: "首選", ja: "バイクの好み #1", cell: (r) => trunc(r.bike_pref_1, "max-w-[200px]") },
  { label: "次選", ja: "バイクの好み #2", cell: (r) => trunc(r.bike_pref_2, "max-w-[200px]") },
  { label: "第三選", ja: "バイクの好み #3", cell: (r) => trunc(r.bike_pref_3, "max-w-[200px]") },
  { label: "取車日期", ja: "レンタル日", sort: "pickup_date", cls: "whitespace-nowrap", cell: (r) => txt(r.pickup_date) },
  { label: "取車時間", ja: "レンタル時間", cls: "whitespace-nowrap", cell: (r) => txt(r.pickup_time) },
  { label: "還車日期", ja: "返却日", cls: "whitespace-nowrap", cell: (r) => txt(r.return_date) },
  { label: "還車時間", ja: "帰還の時間", cls: "whitespace-nowrap", cell: (r) => txt(r.return_time) },
  { label: "CARDO", ja: "CARDO", cls: "text-center", cell: (r) => tick(r.addons?.cardo) },
  { label: "尾箱", ja: "トップケース", cls: "text-center", cell: (r) => tick(r.addons?.topcase) },
  { label: "側袋", ja: "サイドバッグ", cls: "text-center", cell: (r) => tick(r.addons?.sidebag) },
  { label: "側箱", ja: "サイドケース", cls: "text-center", cell: (r) => tick(r.addons?.pannier) },
  { label: "全盔", ja: "フルフェイス", cls: "whitespace-nowrap text-center", cell: (r) => num(r.addons?.full_face) },
  { label: "開面盔", ja: "オープンフェイス", cls: "whitespace-nowrap text-center", cell: (r) => num(r.addons?.open_face) },
  { label: "MamoRide 保險", ja: "MAMO RIDE 保険料", cls: "text-center", cell: (r) => tick(r.addons?.mamoride) },
  { label: "穿梭巴士", ja: "シャトルバス", cls: "text-center", cell: (r) => tick(r.addons?.shuttle_bus) },
  { label: "行李寄存", ja: "荷物預かり", cls: "text-center", cell: (r) => tick(r.addons?.luggage_storage) },
  { label: "ETC", ja: "ETC", cls: "text-center", cell: (r) => tick(r.addons?.etc) },
  { label: "緊急聯絡人", ja: "緊急連絡先", cls: "whitespace-nowrap", cell: (r) => txt(r.emergency_contact) },
  { label: "緊急聯絡人號碼", ja: "緊急連絡先番号", cls: "whitespace-nowrap", cell: (r) => txt(r.emergency_phone) },
  { label: "優惠", ja: "利点", cls: "whitespace-nowrap", cell: (r) => txt(r.promo) },
];

// Fields a keyword search scans (case-insensitive substring).
function searchable(r: Reservation): string {
  return [
    r.booking_ref, r.name_zh, r.name_en, r.email, r.hk_phone, r.jp_phone,
    r.shop, r.bike_pref_1, r.bike_pref_2, r.bike_pref_3,
    r.emergency_contact, r.emergency_phone, r.promo, r.si_number,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: { tab?: string; status?: string; sort?: string; dir?: string; q?: string };
}) {
  const all = await listReservations();
  const readOnly = !canWrite();
  const lang = getAdminLang();
  const t = adminDict(lang);

  const tab: TabKey = TABS.some((t) => t.key === searchParams.tab)
    ? (searchParams.tab as TabKey)
    : "2026";
  const activeStatus = searchParams.status as ReservationStatus | undefined;
  // The list opens on 編號 newest-first — staff work down from the latest
  // booking. An explicit ?sort/?dir from a header click still wins.
  const sortKey: SortKey = SORT_KEYS.includes(searchParams.sort as SortKey)
    ? (searchParams.sort as SortKey)
    : DEFAULT_SORT;
  const dir: "asc" | "desc" =
    searchParams.dir === "desc" || searchParams.dir === "asc"
      ? searchParams.dir
      : DEFAULT_DIR;
  const q = (searchParams.q ?? "").trim();
  const qLower = q.toLowerCase();

  const tabCount = (k: TabKey) => all.filter((r) => tabOf(r) === k).length;
  const tabRows = all.filter((r) => tabOf(r) === tab);

  // Status counts are scoped to the active tab so the filter reflects this book.
  const counts = new Map<string, number>();
  for (const r of tabRows) counts.set(r.status, (counts.get(r.status) ?? 0) + 1);

  let list = q ? tabRows.filter((r) => searchable(r).includes(qLower)) : [...tabRows];
  if (activeStatus) list = list.filter((r) => r.status === activeStatus);
  list.sort((a, b) => compare(a, b, sortKey) * (dir === "desc" ? -1 : 1));

  const th = "px-3 py-3 text-left align-middle whitespace-nowrap";

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">{t.dashboard.title}</h1>
          <p className="text-sm text-ink-muted">
            {`${t.dashboard.total.pre}${tabRows.length}${t.dashboard.total.post}`}
            {q
              ? `${t.dashboard.searched.pre}${q}${t.dashboard.searched.mid}${list.length}${t.dashboard.searched.post}`
              : ""}
            {activeStatus
              ? `${t.dashboard.filtered.pre}${statusName(statusMeta(activeStatus), lang)}${t.dashboard.filtered.mid}${list.length}${t.dashboard.filtered.post}`
              : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <form method="get" action="/admin" className="flex items-center gap-2">
            <input type="hidden" name="tab" value={tab} />
            {activeStatus && <input type="hidden" name="status" value={activeStatus} />}
            <input type="hidden" name="sort" value={sortKey} />
            <input type="hidden" name="dir" value={dir} />
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder={t.dashboard.searchPlaceholder}
              className="w-56 rounded-lg border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-brand-500"
            />
            <button className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-ink-soft hover:bg-slate-200">
              {t.dashboard.search}
            </button>
          </form>
          {(activeStatus || q) && (
            <Link
              href={`/admin${qs({ tab, sort: sortKey, dir })}`}
              className="text-sm text-brand-700 hover:underline"
            >
              {t.dashboard.clear}
            </Link>
          )}
          {!readOnly && (
            <Link href="/admin/reservations/new" className="btn-brand text-sm">
              {t.dashboard.newBooking}
            </Link>
          )}
        </div>
      </div>

      {/* Books — one per master-Excel sheet */}
      <div className="mb-5 flex gap-1 border-b border-slate-200">
        {TABS.map((t) => {
          const activeT = tab === t.key;
          return (
            <Link
              key={t.key}
              href={`/admin${qs({ tab: t.key, status: activeStatus, sort: sortKey, dir, q: q || undefined })}`}
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
                const h = heads(c, lang);
                return (
                  <th key={c.label} className={th}>
                    <div className="flex items-center gap-1.5">
                      {c.sort ? (
                        <Link
                          href={`/admin${qs({ tab, status: activeStatus, sort: c.sort, dir: nextDir, q: q || undefined })}`}
                          className={`inline-flex items-center gap-1 hover:text-ink ${active ? "text-ink" : ""}`}
                        >
                          {h.main}
                          <span className="text-[10px] leading-none">
                            {active ? (dir === "asc" ? "▲" : "▼") : "↕"}
                          </span>
                        </Link>
                      ) : (
                        <span>{h.main}</span>
                      )}

                      {c.filter && (
                        <StatusFilter
                          value={activeStatus ?? ""}
                          ariaLabel={t.dashboard.statusFilterAria}
                          keep={{ tab, sort: sortKey, dir, q: q || undefined }}
                          options={[
                            { key: "", label: t.common.all, count: tabRows.length },
                            ...STATUS_ORDER.map((s) => ({
                              key: s.key,
                              label: statusName(s, lang),
                              count: counts.get(s.key) ?? 0,
                            })),
                          ]}
                        />
                      )}
                    </div>
                    {h.sub && (
                      <div className="mt-0.5 text-[10px] font-normal normal-case tracking-normal text-ink-muted/70">
                        {h.sub}
                      </div>
                    )}
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
                    {c.cell(r, lang, { readOnly })}
                  </td>
                ))}
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length} className="px-4 py-10 text-center text-ink-muted">
                  {t.dashboard.empty}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
