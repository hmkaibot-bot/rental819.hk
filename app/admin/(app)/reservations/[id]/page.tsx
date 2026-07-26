import Link from "next/link";
import { notFound } from "next/navigation";
import { getReservation } from "@/lib/reservations/store";
import {
  STATUS_FLOW,
  statusMeta,
  ADDON_LABELS,
  SHOPS,
  type Reservation,
} from "@/lib/reservations/types";
import { patchReservation } from "./actions";

export const dynamic = "force-dynamic";

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="py-2">
      <dt className="text-xs uppercase tracking-wide text-ink-muted">{label}</dt>
      <dd className="mt-0.5 text-sm text-ink">{value || "—"}</dd>
    </div>
  );
}

function addonValue(r: Reservation, key: (typeof ADDON_LABELS)[number]["key"]) {
  const v = r.addons?.[key];
  if (typeof v === "number") return v > 0 ? `×${v}` : "—";
  return v === true ? "✔" : "—";
}

const input =
  "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20";

export default async function ReservationDetail({
  params,
}: {
  params: { id: string };
}) {
  const r = await getReservation(params.id);
  if (!r) notFound();
  const m = statusMeta(r.status);
  const stageIndex = STATUS_FLOW.findIndex((s) => s.key === r.status);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/admin" className="text-sm text-brand-700 hover:underline">
            ← 返回列表
          </Link>
          <h1 className="mt-1 text-xl font-bold">
            {r.booking_ref}{" "}
            <span className="ml-1 text-base font-medium text-ink-muted">
              {r.name_en ?? r.name_zh}
            </span>
          </h1>
        </div>
        <span className={`rounded-full px-3 py-1.5 text-sm font-medium ${m.tone}`}>
          {m.zh}
        </span>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        {/* ---- Details ---- */}
        <div className="space-y-5">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <h2 className="mb-2 text-sm font-bold text-brand-700">預約</h2>
            <dl className="grid grid-cols-2 gap-x-6 sm:grid-cols-3">
              <Field label="預約編號" value={r.booking_ref} />
              <Field label="提交日期" value={r.request_date} />
              <Field label="狀態" value={m.zh} />
              <Field label="優惠" value={r.promo} />
              <Field label="來源" value={r.source} />
            </dl>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <h2 className="mb-2 text-sm font-bold text-brand-700">客人資料</h2>
            <dl className="grid grid-cols-2 gap-x-6">
              <Field label="中文姓名" value={r.name_zh} />
              <Field label="英文姓名" value={r.name_en} />
              <Field label="性別" value={r.gender} />
              <Field label="出生年月日" value={r.dob} />
              <Field label="電郵" value={r.email} />
              <Field label="香港聯絡電話" value={r.hk_phone} />
              <Field label="日語能力" value={r.japanese_ability} />
              <Field label="英語能力" value={r.english_ability} />
              <div className="col-span-2">
                <Field label="原國籍居住地址" value={r.hk_address} />
              </div>
              <div className="col-span-2">
                <Field label="日本住宿地址" value={r.jp_address} />
              </div>
              <Field label="日本手提電話" value={r.jp_phone} />
              <Field label="緊急聯絡人" value={r.emergency_contact} />
              <Field label="緊急聯絡人號碼" value={r.emergency_phone} />
            </dl>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <h2 className="mb-2 text-sm font-bold text-brand-700">租車詳情</h2>
            <dl className="grid grid-cols-2 gap-x-6">
              <Field label="出發店" value={r.shop} />
              <Field label="確認車款" value={r.confirmed_bike ? <span className="font-semibold text-emerald-700">{r.confirmed_bike}</span> : "未確認"} />
              <Field label="取車日期" value={[r.pickup_date, r.pickup_time].filter(Boolean).join(" ")} />
              <Field label="還車日期" value={[r.return_date, r.return_time].filter(Boolean).join(" ")} />
              <Field label="首選車款" value={r.bike_pref_1} />
              <Field label="次選車款" value={r.bike_pref_2} />
              <Field label="第三選車款" value={r.bike_pref_3} />
            </dl>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <h2 className="mb-2 text-sm font-bold text-brand-700">配件及加購</h2>
            <dl className="grid grid-cols-3 gap-x-6 sm:grid-cols-5">
              {ADDON_LABELS.map((a) => (
                <Field key={a.key} label={a.zh} value={addonValue(r, a.key)} />
              ))}
            </dl>
          </section>

          {r.notes && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
              <h2 className="mb-2 text-sm font-bold text-brand-700">備註</h2>
              <p className="whitespace-pre-wrap text-sm text-ink-soft">{r.notes}</p>
            </section>
          )}
        </div>

        {/* ---- Pipeline / actions ---- */}
        <div className="space-y-5">
          {/* Stepper */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <h2 className="mb-3 text-sm font-bold text-brand-700">流程</h2>
            <ol className="space-y-2">
              {STATUS_FLOW.map((s, i) => (
                <li key={s.key} className="flex items-center gap-2.5 text-sm">
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                      i < stageIndex
                        ? "bg-emerald-500 text-white"
                        : i === stageIndex
                          ? "bg-brand-600 text-white"
                          : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {i < stageIndex ? "✓" : i + 1}
                  </span>
                  <span className={i === stageIndex ? "font-semibold text-ink" : "text-ink-muted"}>
                    {s.zh}
                  </span>
                </li>
              ))}
            </ol>
          </section>

          {/* Step actions */}
          <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <h2 className="text-sm font-bold text-brand-700">下一步</h2>

            {/* Email drafts (steps 4 & 8) + invoice (step 6) */}
            <div className="flex flex-wrap gap-2">
              <Link href={`/admin/reservations/${r.id}/email/jp`} className="btn-outline text-xs">
                ✉️ 生成日本預約信
              </Link>
              <Link href={`/admin/reservations/${r.id}/email/customer`} className="btn-outline text-xs">
                ✉️ 生成客人確認信
              </Link>
              <Link href={`/admin/reservations/${r.id}/invoice`} className="btn-brand text-xs">
                🧾 開單 / 生成 PDF
              </Link>
            </div>

            {/* Advance status quick buttons */}
            <form action={patchReservation} className="flex flex-wrap gap-2">
              <input type="hidden" name="id" value={r.id} />
              <button name="status" value="sent_to_jp" className="rounded-lg bg-amber-100 px-3 py-1.5 text-xs font-medium text-amber-800 hover:bg-amber-200">
                標記已向日本確認
              </button>
              <button name="status" value="customer_confirmed" className="rounded-lg bg-teal-100 px-3 py-1.5 text-xs font-medium text-teal-800 hover:bg-teal-200">
                已發客人確認信
              </button>
            </form>

            {/* Confirmed bike → confirmed */}
            <form action={patchReservation} className="space-y-2 border-t border-slate-100 pt-3">
              <input type="hidden" name="id" value={r.id} />
              <label className="text-xs font-medium text-ink-soft">確認車款（日本回覆後）</label>
              <input name="confirmed_bike" defaultValue={r.confirmed_bike ?? ""} className={input} placeholder="例：Rebel 1100 (2023) / ID：334" />
              <input type="hidden" name="status" value="confirmed" />
              <button className="btn-brand w-full text-xs">儲存並標記已確認</button>
            </form>

            {/* Invoice → invoiced */}
            <form action={patchReservation} className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
              <input type="hidden" name="id" value={r.id} />
              <div className="col-span-2 text-xs font-medium text-ink-soft">開單</div>
              <input name="si_number" defaultValue={r.si_number ?? ""} className={input} placeholder="SI-26-xxxxx" />
              <input name="cost_jpy" type="number" defaultValue={r.cost_jpy ?? ""} className={input} placeholder="成本 ¥" />
              <input type="hidden" name="status" value="invoiced" />
              <button className="btn-brand col-span-2 text-xs">儲存單號並標記已開單</button>
            </form>

            {/* Customer paid → paid */}
            <form action={patchReservation} className="space-y-2 border-t border-slate-100 pt-3">
              <input type="hidden" name="id" value={r.id} />
              <label className="text-xs font-medium text-ink-soft">客人付款日期</label>
              <input name="customer_paid_date" type="date" defaultValue={r.customer_paid_date ?? ""} className={input} />
              <input type="hidden" name="status" value="paid" />
              <button className="btn-brand w-full text-xs">記錄付款並標記已付款</button>
            </form>

            {/* Settlement → settled */}
            <form action={patchReservation} className="space-y-2 border-t border-slate-100 pt-3">
              <input type="hidden" name="id" value={r.id} />
              <label className="text-xs font-medium text-ink-soft">月結（向日本供應商付款）</label>
              <input name="supplier_paid_date" type="date" defaultValue={r.supplier_paid_date ?? ""} className={input} />
              <label className="flex items-center gap-2 text-xs text-ink-soft">
                <input type="checkbox" name="paid_to_supplier" defaultChecked={r.paid_to_supplier} /> 已向供應商付款
              </label>
              <input type="hidden" name="status" value="settled" />
              <button className="btn-brand w-full text-xs">記錄並標記月結完成</button>
            </form>

            {/* Terminal */}
            <form action={patchReservation} className="flex gap-2 border-t border-slate-100 pt-3">
              <input type="hidden" name="id" value={r.id} />
              <button name="status" value="cancelled" className="flex-1 rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-100">
                取消
              </button>
              <button name="status" value="no_response" className="flex-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200">
                客人無反應
              </button>
            </form>
          </section>

          {/* Billing summary */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <h2 className="mb-2 text-sm font-bold text-brand-700">單據與月結</h2>
            <dl className="grid grid-cols-2 gap-x-6">
              <Field label="單號 (SI)" value={r.si_number} />
              <Field label="成本 (¥)" value={r.cost_jpy?.toLocaleString("en-US")} />
              <Field label="客人付款日" value={r.customer_paid_date} />
              <Field label="供應商付款日" value={r.supplier_paid_date} />
              <Field label="已向供應商付款" value={r.paid_to_supplier ? "是" : "否"} />
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}
