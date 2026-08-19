import Link from "next/link";
import { notFound } from "next/navigation";
import { getReservation } from "@/lib/reservations/store";
import { canWrite } from "@/lib/admin/auth";
import { getAdminLang } from "@/lib/admin/lang";
import { adminDict, type AdminLang } from "@/lib/admin/i18n";
import {
  STATUS_FLOW,
  TERMINAL_STATUS,
  statusMeta,
  ADDON_LABELS,
  COST_ITEM_LABELS,
  SHOP_AREAS,
  SHOPS,
  JP_ABILITY_OPTIONS,
  EN_ABILITY_OPTIONS,
  costItemsTotal,
  rebateFromCostItems,
} from "@/lib/reservations/types";
import AbilitySelect from "@/components/admin/AbilitySelect";
import { autoSiNumber } from "@/lib/reservations/invoice";
import {
  patchReservation,
  confirmReservation,
  setCardo,
  saveAddons,
  saveCostItems,
} from "./actions";

export const dynamic = "force-dynamic";

/** Pick the operator-language label off any {zh, ja} record. */
const L = (o: { zh: string; ja: string }, lang: AdminLang) => (lang === "ja" ? o.ja : o.zh);

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="py-2">
      <dt className="text-xs uppercase tracking-wide text-ink-muted">{label}</dt>
      <dd className="mt-0.5 text-sm text-ink">{value || "—"}</dd>
    </div>
  );
}

const input =
  "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20";
const fieldLabel = "text-xs uppercase tracking-wide text-ink-muted";

/** Labelled text input used by the editable customer / rental blocks. */
function Edit({
  label,
  name,
  value,
  type = "text",
  wide,
  readOnly,
}: {
  label: string;
  name: string;
  value?: string | null;
  type?: string;
  wide?: boolean;
  readOnly?: boolean;
}) {
  return (
    <div className={`py-2 ${wide ? "col-span-2" : ""}`}>
      <label className={fieldLabel} htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={value ?? ""}
        disabled={readOnly}
        className={`mt-1 ${input} ${readOnly ? "bg-slate-50 text-ink-muted" : ""}`}
      />
    </div>
  );
}

function SaveRow({
  label,
  readOnly,
  span = "col-span-2",
  children,
}: {
  label: string;
  readOnly: boolean;
  span?: string;
  children?: React.ReactNode;
}) {
  // A read-only session gets no submit control at all — the action behind it
  // would refuse anyway, and an inert button invites a pointless click.
  if (readOnly) return null;
  return (
    <div className={`${span} mt-3 flex items-center gap-3 border-t border-slate-100 pt-3`}>
      <button className="btn-brand text-xs">{label}</button>
      {children}
    </div>
  );
}

export default async function ReservationDetail({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { err?: string };
}) {
  const r = await getReservation(params.id);
  if (!r) notFound();
  const readOnly = !canWrite();
  const lang = getAdminLang();
  const t = adminDict(lang);
  const f = t.fields;
  const m = statusMeta(r.status);
  const stageIndex = STATUS_FLOW.findIndex((s) => s.key === r.status);
  const currentGrade =
    (typeof (r.settlement as Record<string, unknown>)?.grade === "string"
      ? ((r.settlement as Record<string, unknown>).grade as string)
      : "") || "";
  const GRADES = ["P1", "P2", "P3", "P4", "P5", "P6", "P7"];
  // Set by patchReservation when a save was refused before it reached the DB.
  const bookingErr =
    searchParams?.err === "ref_taken"
      ? t.detail.refTaken
      : searchParams?.err === "ref_required"
        ? t.detail.refRequired
        : searchParams?.err === "date_required"
          ? t.detail.dateRequired
          : null;

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/admin" className="text-sm text-brand-700 hover:underline">
            {t.common.backToList}
          </Link>
          <h1 className="mt-1 text-xl font-bold">
            {r.booking_ref}{" "}
            <span className="ml-1 text-base font-medium text-ink-muted">
              {r.name_en ?? r.name_zh}
            </span>
          </h1>
        </div>
        <span className={`rounded-full px-3 py-1.5 text-sm font-medium ${m.tone}`}>
          {L(m, lang)}
        </span>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        {/* ---- Details ---- */}
        <div className="space-y-5">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <h2 className="mb-2 text-sm font-bold text-brand-700">{t.detail.sectionBooking}</h2>
            {bookingErr && (
              <p className="mb-3 rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">
                {bookingErr}
              </p>
            )}
            <form action={patchReservation} className="grid grid-cols-2 gap-x-6 sm:grid-cols-3">
              <fieldset disabled={readOnly} className="contents">
              <input type="hidden" name="id" value={r.id} />
              <Edit label={f.bookingRef} name="booking_ref" value={r.booking_ref} readOnly={readOnly} />
              <Edit label={f.requestDate} name="request_date" value={r.request_date} type="date" readOnly={readOnly} />
              <div className="py-2">
                <label className={fieldLabel} htmlFor="status">{f.status}</label>
                <select
                  id="status"
                  key={r.status}
                  name="status"
                  defaultValue={r.status}
                  className={`mt-1 ${input}`}
                >
                  {[...STATUS_FLOW, ...TERMINAL_STATUS].map((s) => (
                    <option key={s.key} value={s.key}>
                      {L(s, lang)}
                    </option>
                  ))}
                </select>
              </div>
              <Edit label={f.promo} name="promo" value={r.promo} readOnly={readOnly} />
              <Edit label={f.source} name="source" value={r.source} readOnly={readOnly} />
              <SaveRow label={t.common.save} readOnly={readOnly} span="col-span-2 sm:col-span-3" />
              </fieldset>
            </form>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <h2 className="mb-2 text-sm font-bold text-brand-700">{t.detail.sectionCustomer}</h2>
            <form action={patchReservation} className="grid grid-cols-2 gap-x-6">
              <fieldset disabled={readOnly} className="contents">
              <input type="hidden" name="id" value={r.id} />
              <Edit label={f.nameZh} name="name_zh" value={r.name_zh} readOnly={readOnly} />
              <Edit label={f.nameEn} name="name_en" value={r.name_en} readOnly={readOnly} />
              <div className="py-2">
                <label className={fieldLabel} htmlFor="gender">{f.gender}</label>
                <select id="gender" name="gender" defaultValue={r.gender ?? ""} className={`mt-1 ${input}`}>
                  <option value="">—</option>
                  {/* Stored verbatim as 男性 / 女性 — the label follows the UI language. */}
                  <option value="男性">{f.male}</option>
                  <option value="女性">{f.female}</option>
                </select>
              </div>
              <Edit label={f.dob} name="dob" value={r.dob} type="date" readOnly={readOnly} />
              <Edit label={f.email} name="email" value={r.email} type="email" readOnly={readOnly} />
              <Edit label={f.hkPhone} name="hk_phone" value={r.hk_phone} readOnly={readOnly} />
              <AbilitySelect
                name="japanese_ability"
                label={f.japaneseAbility}
                options={JP_ABILITY_OPTIONS}
                lang={lang}
                value={r.japanese_ability}
                existingSuffix={t.detail.existingSuffix}
                labelClassName={fieldLabel}
                wrapperClassName="py-2"
              />
              <AbilitySelect
                name="english_ability"
                label={f.englishAbility}
                options={EN_ABILITY_OPTIONS}
                lang={lang}
                value={r.english_ability}
                existingSuffix={t.detail.existingSuffix}
                labelClassName={fieldLabel}
                wrapperClassName="py-2"
              />
              <Edit label={f.hkAddress} name="hk_address" value={r.hk_address} wide readOnly={readOnly} />
              <Edit label={f.jpAddress} name="jp_address" value={r.jp_address} wide readOnly={readOnly} />
              <Edit label={f.jpPhone} name="jp_phone" value={r.jp_phone} readOnly={readOnly} />
              <Edit label={f.emergencyContact} name="emergency_contact" value={r.emergency_contact} readOnly={readOnly} />
              <Edit label={f.emergencyPhone} name="emergency_phone" value={r.emergency_phone} readOnly={readOnly} />
              <SaveRow label={t.common.save} readOnly={readOnly} />
              </fieldset>
            </form>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <h2 className="mb-2 text-sm font-bold text-brand-700">{t.detail.sectionRental}</h2>
            <form action={patchReservation} className="grid grid-cols-2 gap-x-6">
              <fieldset disabled={readOnly} className="contents">
              <input type="hidden" name="id" value={r.id} />
              <div className="py-2">
                <label className={fieldLabel} htmlFor="shop">{f.shop}</label>
                <select id="shop" name="shop" defaultValue={r.shop ?? ""} className={`mt-1 ${input}`}>
                  <option value="">—</option>
                  {/* Historical bookings carry free-text branch names imported from
                      the Excel (e.g. 那霸空港店) that predate the official list.
                      Keep the stored value selectable so saving never wipes it. */}
                  {r.shop && !SHOPS.includes(r.shop) && (
                    <option value={r.shop}>{r.shop}{t.detail.existingSuffix}</option>
                  )}
                  {SHOP_AREAS.map((a) => (
                    <optgroup key={a.area} label={a.area}>
                      {a.shops.map((sh) => (
                        <option key={sh} value={sh}>{sh}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              <Edit label={f.confirmedBike} name="confirmed_bike" value={r.confirmed_bike} readOnly={readOnly} />
              <Edit label={f.pickupDate} name="pickup_date" value={r.pickup_date} type="date" readOnly={readOnly} />
              <Edit label={f.pickupTime} name="pickup_time" value={r.pickup_time} type="time" readOnly={readOnly} />
              <Edit label={f.returnDate} name="return_date" value={r.return_date} type="date" readOnly={readOnly} />
              <Edit label={f.returnTime} name="return_time" value={r.return_time} type="time" readOnly={readOnly} />
              <Edit label={f.bikePref1} name="bike_pref_1" value={r.bike_pref_1} readOnly={readOnly} />
              <Edit label={f.bikePref2} name="bike_pref_2" value={r.bike_pref_2} readOnly={readOnly} />
              <Edit label={f.bikePref3} name="bike_pref_3" value={r.bike_pref_3} readOnly={readOnly} />
              <SaveRow label={t.common.save} readOnly={readOnly} />
              </fieldset>
            </form>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <h2 className="mb-2 text-sm font-bold text-brand-700">{t.detail.sectionAddons}</h2>
            <form action={saveAddons}>
              <fieldset disabled={readOnly} className="contents">
              <input type="hidden" name="id" value={r.id} />
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
                {ADDON_LABELS.map((a) =>
                  a.key === "full_face" || a.key === "open_face" ? (
                    <div key={a.key} className="flex items-center gap-2">
                      <label className="flex-1 text-sm text-ink-soft" htmlFor={`addon_${a.key}`}>
                        {L(a, lang)}
                      </label>
                      <input
                        id={`addon_${a.key}`}
                        name={`addon_${a.key}`}
                        type="number"
                        min="0"
                        defaultValue={Number(r.addons?.[a.key]) || 0}
                        className="w-20 rounded-lg border border-slate-200 px-2 py-1.5 text-sm outline-none focus:border-brand-500"
                      />
                    </div>
                  ) : (
                    <label key={a.key} className="flex items-center gap-2 py-1.5 text-sm text-ink-soft">
                      <input
                        name={`addon_${a.key}`}
                        type="checkbox"
                        defaultChecked={r.addons?.[a.key] === true}
                        className="h-4 w-4 rounded border-slate-300"
                      />
                      {L(a, lang)}
                    </label>
                  ),
                )}
              </div>
              <div className="mt-3 border-t border-slate-100 pt-3">
                <button className="btn-brand text-xs">{t.common.save}</button>
              </div>
              </fieldset>
            </form>
          </section>

          {r.notes && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
              <h2 className="mb-2 text-sm font-bold text-brand-700">{t.detail.sectionNotes}</h2>
              <p className="whitespace-pre-wrap text-sm text-ink-soft">{r.notes}</p>
            </section>
          )}
        </div>

        {/* ---- Pipeline / actions ---- */}
        <div className="space-y-5">
          {/* Stepper */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <h2 className="mb-3 text-sm font-bold text-brand-700">{t.detail.sectionFlow}</h2>
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
                    {L(s, lang)}
                  </span>
                </li>
              ))}
            </ol>
          </section>

          {/* Step actions */}
          <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <h2 className="text-sm font-bold text-brand-700">{t.detail.sectionNext}</h2>

            {/* Emails (steps 4 & 8) + invoice (step 6) */}
            <div className="flex flex-wrap gap-2">
              <Link href={`/admin/reservations/${r.id}/email/jp`} className="btn-outline text-xs">
                {t.detail.jpEmail}
              </Link>
              <Link href={`/admin/reservations/${r.id}/email/customer`} className="btn-outline text-xs">
                {t.detail.customerEmail}
              </Link>
              <Link href={`/admin/reservations/${r.id}/invoice`} className="btn-brand text-xs">
                {t.detail.invoice}
              </Link>
            </div>

            {/* Japan confirmation → confirmed (bike + grade + dates + add-ons) */}
            <form action={confirmReservation} className="flex flex-col gap-2 border-t border-slate-100 pt-3">
              <fieldset disabled={readOnly} className="contents">
              <input type="hidden" name="id" value={r.id} />
              <div className="text-xs font-bold text-brand-700">{t.detail.jpConfirmTitle}</div>
              <label className="text-xs font-medium text-ink-soft">{f.confirmedBike}</label>
              <input name="confirmed_bike" defaultValue={r.confirmed_bike ?? ""} className={input} placeholder={t.detail.bikePlaceholder} />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-ink-soft">{t.detail.grade}</label>
                  <select name="grade" defaultValue={currentGrade} className={input}>
                    <option value="">—</option>
                    {GRADES.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div />
                <div>
                  <label className="text-xs text-ink-soft">{f.pickupDate}</label>
                  <input type="date" name="pickup_date" defaultValue={r.pickup_date ?? ""} className={input} />
                </div>
                <div>
                  <label className="text-xs text-ink-soft">{f.pickupTime}</label>
                  <input type="time" name="pickup_time" defaultValue={r.pickup_time ?? ""} className={input} />
                </div>
                <div>
                  <label className="text-xs text-ink-soft">{f.returnDate}</label>
                  <input type="date" name="return_date" defaultValue={r.return_date ?? ""} className={input} />
                </div>
                <div>
                  <label className="text-xs text-ink-soft">{f.returnTime}</label>
                  <input type="time" name="return_time" defaultValue={r.return_time ?? ""} className={input} />
                </div>
              </div>
              <div className="text-xs font-medium text-ink-soft">{t.detail.confirmAddons}</div>
              <div className="grid grid-cols-2 gap-1.5 text-xs text-ink-soft">
                {(["topcase", "sidebag", "pannier", "mamoride", "etc", "shuttle_bus", "luggage_storage"] as const).map(
                  (key) => {
                    const a = ADDON_LABELS.find((x) => x.key === key)!;
                    return (
                      <label key={key} className="flex items-center gap-1.5">
                        <input
                          type="checkbox"
                          name={`addon_${key}`}
                          defaultChecked={r.addons?.[key] === true}
                          className="h-3.5 w-3.5 rounded border-slate-300"
                        />
                        {L(a, lang)}
                      </label>
                    );
                  },
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-ink-soft">{f.fullHelmetQty}</label>
                  <input type="number" min="0" name="helmet_full" defaultValue={r.addons?.full_face ?? 0} className={input} />
                </div>
                <div>
                  <label className="text-xs text-ink-soft">{f.openHelmetQty}</label>
                  <input type="number" min="0" name="helmet_open" defaultValue={r.addons?.open_face ?? 0} className={input} />
                </div>
              </div>
              <button className="btn-brand w-full text-xs">{t.common.save}</button>
              </fieldset>
            </form>

            {/* CARDO — HK-side value-add (not Japan-confirmed) */}
            <form action={setCardo} className="flex flex-col gap-2 border-t border-slate-100 pt-3">
              <fieldset disabled={readOnly} className="contents">
              <input type="hidden" name="id" value={r.id} />
              <div className="text-xs font-bold text-brand-700">{t.detail.cardoTitle}</div>
              <label className="flex items-center gap-2 text-xs text-ink-soft">
                <input type="checkbox" name="cardo" defaultChecked={!!r.addons?.cardo} className="h-3.5 w-3.5 rounded border-slate-300" />
                {t.detail.cardoCheck}
              </label>
              <div className="flex flex-wrap gap-2">
                <button className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-ink-soft hover:bg-slate-200">
                  {t.common.update}
                </button>
                {r.addons?.cardo && (
                  <Link href={`/admin/reservations/${r.id}/cardo`} target="_blank" className="btn-outline text-xs">
                    {t.detail.printCardo}
                  </Link>
                )}
              </div>
              </fieldset>
            </form>

            {/* Invoice — supplier cost is entered per line, mirroring the Excel */}
            <form action={saveCostItems} className="flex flex-col gap-2 border-t border-slate-100 pt-3">
              <fieldset disabled={readOnly} className="contents">
              <input type="hidden" name="id" value={r.id} />
              <div className="text-xs font-medium text-ink-soft">{t.detail.billingTitle}</div>
              <div>
                <label className="text-xs text-ink-soft" htmlFor="si_number">{t.detail.siNumber}</label>
                <input id="si_number" name="si_number" defaultValue={autoSiNumber(r)} className={`mt-1 ${input}`} placeholder="SI-26-xxxxx" />
              </div>
              <div className="text-xs font-medium text-ink-soft">{t.detail.costPerItem}</div>
              <div className="space-y-1.5">
                {COST_ITEM_LABELS.map((l) => (
                  <div key={l.key} className="flex items-center gap-2">
                    <label className="flex-1 text-xs text-ink-soft" htmlFor={`cost_${l.key}`}>
                      {L(l, lang)}
                    </label>
                    <input
                      id={`cost_${l.key}`}
                      name={`cost_${l.key}`}
                      type="number"
                      min="0"
                      step="1"
                      defaultValue={r.cost_items?.[l.key] ?? ""}
                      placeholder="¥"
                      className="w-28 rounded-lg border border-slate-200 px-2 py-1.5 text-right text-sm outline-none focus:border-brand-500"
                    />
                  </div>
                ))}
              </div>
              <dl className="space-y-1 rounded-lg bg-slate-50 px-3 py-2 text-xs">
                <div className="flex justify-between">
                  <dt className="text-ink-muted">{t.detail.costTotalNow}</dt>
                  <dd className="font-semibold">¥{costItemsTotal(r.cost_items).toLocaleString("en-US")}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-muted">{t.detail.rebateLine}</dt>
                  <dd className="font-semibold text-emerald-700">
                    −¥{rebateFromCostItems(r.cost_items).toLocaleString("en-US")}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-1">
                  <dt className="text-ink-muted">{t.detail.netPay}</dt>
                  <dd className="font-bold">
                    ¥{(costItemsTotal(r.cost_items) - rebateFromCostItems(r.cost_items)).toLocaleString("en-US")}
                  </dd>
                </div>
              </dl>
              <p className="text-[11px] leading-4 text-ink-muted">{t.detail.costHint}</p>
              <button className="btn-brand w-full text-xs">{t.detail.saveSiCost}</button>
              </fieldset>
            </form>

            {/* Customer paid → paid */}
            <form action={patchReservation} className="flex flex-col gap-2 border-t border-slate-100 pt-3">
              <fieldset disabled={readOnly} className="contents">
              <input type="hidden" name="id" value={r.id} />
              <label className="text-xs font-medium text-ink-soft">{t.detail.customerPaidDate}</label>
              <input name="customer_paid_date" type="date" defaultValue={r.customer_paid_date ?? ""} className={input} />
              <button className="btn-brand w-full text-xs">{t.common.save}</button>
              </fieldset>
            </form>

            {/* Settlement moved to the accounting module */}
            <div className="border-t border-slate-100 pt-3 text-xs text-ink-muted">
              {t.detail.settlementMoved}{" "}
              <Link href="/admin/accounting" className="text-brand-700 hover:underline">
                {t.detail.accountingModule}
              </Link>
              {t.detail.settlementMovedTail}
            </div>

          </section>

          {/* Billing summary */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <h2 className="mb-2 text-sm font-bold text-brand-700">{t.detail.sectionBilling}</h2>
            <dl className="grid grid-cols-2 gap-x-6">
              <Field label={t.detail.siNumber} value={r.si_number} />
              <Field label={t.detail.costJpy} value={r.cost_jpy?.toLocaleString("en-US")} />
              <Field label={t.detail.rebateJpy} value={r.rebate_jpy ? `−${r.rebate_jpy.toLocaleString("en-US")}` : undefined} />
              <Field
                label={t.detail.netCostJpy}
                value={
                  r.cost_jpy != null
                    ? (Number(r.cost_jpy) - (Number(r.rebate_jpy) || 0)).toLocaleString("en-US")
                    : undefined
                }
              />
              <Field label={t.detail.customerPaidOn} value={r.customer_paid_date} />
              <Field label={t.detail.supplierPaidOn} value={r.supplier_paid_date} />
              <Field label={t.detail.paidToSupplier} value={r.paid_to_supplier ? t.common.yes : t.common.no} />
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}
