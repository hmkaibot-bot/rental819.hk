import Link from "next/link";
import { SHOPS } from "@/lib/reservations/types";
import { createReservationAction } from "./actions";

export const dynamic = "force-dynamic";

const input =
  "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20";
const label = "text-xs font-medium text-ink-soft";

function Field({
  name,
  label: lbl,
  type = "text",
  placeholder,
  colSpan,
}: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  colSpan?: boolean;
}) {
  return (
    <div className={colSpan ? "sm:col-span-2" : ""}>
      <label className={label} htmlFor={name}>
        {lbl}
      </label>
      <input id={name} name={name} type={type} placeholder={placeholder} className={`mt-1 ${input}`} />
    </div>
  );
}

const ADDON_CHECKS: [string, string][] = [
  ["addon_cardo", "CARDO 對講機"],
  ["addon_topcase", "尾箱"],
  ["addon_sidebag", "側袋"],
  ["addon_pannier", "側箱"],
  ["addon_mamoride", "MamoRide 保險"],
  ["addon_etc", "ETC"],
  ["addon_shuttle_bus", "穿梭巴士"],
  ["addon_luggage_storage", "行李寄存"],
];

export default function NewReservationPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/admin" className="text-sm text-brand-700 hover:underline">
        ← 返回列表
      </Link>
      <h1 className="mt-1 text-xl font-bold">新增預約</h1>
      <p className="mb-5 text-sm text-ink-muted">
        直接喺後台建立一張預約。建立後狀態為「未處理」，可再喺詳情頁跟進。
      </p>

      <form action={createReservationAction} className="space-y-5">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <h2 className="mb-3 text-sm font-bold text-brand-700">預約</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="booking_ref" label="預約編號（可留空後補）" placeholder="例：2026-050 / P-2025-010" />
            <Field name="promo" label="優惠" />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <h2 className="mb-3 text-sm font-bold text-brand-700">客人資料</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="name_zh" label="中文姓名" />
            <Field name="name_en" label="英文姓名" />
            <Field name="gender" label="性別" />
            <Field name="dob" label="出生年月日" type="date" />
            <Field name="email" label="電郵" type="email" />
            <Field name="hk_phone" label="香港聯絡電話" />
            <Field name="japanese_ability" label="日語能力" />
            <Field name="english_ability" label="英語能力" />
            <Field name="hk_address" label="原國籍居住地址" colSpan />
            <Field name="jp_address" label="日本住宿地址" colSpan />
            <Field name="jp_phone" label="日本手提電話" />
            <div />
            <Field name="emergency_contact" label="緊急聯絡人" />
            <Field name="emergency_phone" label="緊急聯絡人號碼" />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <h2 className="mb-3 text-sm font-bold text-brand-700">租車詳情</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label} htmlFor="shop">出發店</label>
              <select id="shop" name="shop" defaultValue="" className={`mt-1 ${input}`}>
                <option value="">—</option>
                {SHOPS.map((sh) => (
                  <option key={sh} value={sh}>{sh}</option>
                ))}
              </select>
            </div>
            <div />
            <Field name="bike_pref_1" label="首選車款" />
            <Field name="bike_pref_2" label="次選車款" />
            <Field name="bike_pref_3" label="第三選車款" />
            <div />
            <Field name="pickup_date" label="取車日期" type="date" />
            <Field name="pickup_time" label="取車時間" type="time" />
            <Field name="return_date" label="還車日期" type="date" />
            <Field name="return_time" label="還車時間" type="time" />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <h2 className="mb-3 text-sm font-bold text-brand-700">配件及加購</h2>
          <div className="grid grid-cols-2 gap-2 text-sm text-ink-soft sm:grid-cols-4">
            {ADDON_CHECKS.map(([name, lbl]) => (
              <label key={name} className="flex items-center gap-2">
                <input type="checkbox" name={name} className="h-4 w-4 rounded border-slate-300" />
                {lbl}
              </label>
            ))}
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label} htmlFor="helmet_full">全盔數量</label>
              <input id="helmet_full" name="helmet_full" type="number" min="0" defaultValue={0} className={`mt-1 ${input}`} />
            </div>
            <div>
              <label className={label} htmlFor="helmet_open">開面盔數量</label>
              <input id="helmet_open" name="helmet_open" type="number" min="0" defaultValue={0} className={`mt-1 ${input}`} />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <h2 className="mb-3 text-sm font-bold text-brand-700">備註</h2>
          <textarea name="notes" rows={3} className={input} placeholder="內部備註…" />
        </section>

        <div className="flex items-center gap-3">
          <button className="btn-brand">建立預約</button>
          <Link href="/admin" className="text-sm text-ink-muted hover:underline">取消</Link>
        </div>
      </form>
    </div>
  );
}
