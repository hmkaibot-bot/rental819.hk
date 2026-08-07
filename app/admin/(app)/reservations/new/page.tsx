import Link from "next/link";
import {
  ADDON_LABELS,
  SHOP_AREAS,
  JP_ABILITY_OPTIONS,
  EN_ABILITY_OPTIONS,
} from "@/lib/reservations/types";
import { getAdminLang } from "@/lib/admin/lang";
import { adminDict } from "@/lib/admin/i18n";
import AbilitySelect from "@/components/admin/AbilitySelect";
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

/** The tickable add-ons — helmets are counted separately, below. */
const ADDON_CHECKS = ADDON_LABELS.filter(
  (a) => a.key !== "full_face" && a.key !== "open_face",
);

export default function NewReservationPage() {
  const lang = getAdminLang();
  const t = adminDict(lang);
  const f = t.fields;

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/admin" className="text-sm text-brand-700 hover:underline">
        {t.common.backToList}
      </Link>
      <h1 className="mt-1 text-xl font-bold">{t.newBooking.title}</h1>
      <p className="mb-5 text-sm text-ink-muted">{t.newBooking.intro}</p>

      <form action={createReservationAction} className="space-y-5">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <h2 className="mb-3 text-sm font-bold text-brand-700">{t.detail.sectionBooking}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              name="booking_ref"
              label={t.newBooking.bookingRefField}
              placeholder={t.newBooking.bookingRefPlaceholder}
            />
            <Field name="promo" label={f.promo} />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <h2 className="mb-3 text-sm font-bold text-brand-700">{t.detail.sectionCustomer}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="name_zh" label={f.nameZh} />
            <Field name="name_en" label={f.nameEn} />
            <Field name="gender" label={f.gender} />
            <Field name="dob" label={f.dob} type="date" />
            <Field name="email" label={f.email} type="email" />
            <Field name="hk_phone" label={f.hkPhone} />
            <AbilitySelect
              name="japanese_ability"
              label={f.japaneseAbility}
              options={JP_ABILITY_OPTIONS}
              lang={lang}
              existingSuffix={t.detail.existingSuffix}
            />
            <AbilitySelect
              name="english_ability"
              label={f.englishAbility}
              options={EN_ABILITY_OPTIONS}
              lang={lang}
              existingSuffix={t.detail.existingSuffix}
            />
            <Field name="hk_address" label={f.hkAddress} colSpan />
            <Field name="jp_address" label={f.jpAddress} colSpan />
            <Field name="jp_phone" label={f.jpPhone} />
            <div />
            <Field name="emergency_contact" label={f.emergencyContact} />
            <Field name="emergency_phone" label={f.emergencyPhone} />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <h2 className="mb-3 text-sm font-bold text-brand-700">{t.detail.sectionRental}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label} htmlFor="shop">{f.shop}</label>
              <select id="shop" name="shop" defaultValue="" className={`mt-1 ${input}`}>
                <option value="">—</option>
                {SHOP_AREAS.map((a) => (
                  <optgroup key={a.area} label={a.area}>
                    {a.shops.map((sh) => (
                      <option key={sh} value={sh}>{sh}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
            <div />
            <Field name="bike_pref_1" label={f.bikePref1} />
            <Field name="bike_pref_2" label={f.bikePref2} />
            <Field name="bike_pref_3" label={f.bikePref3} />
            <div />
            <Field name="pickup_date" label={f.pickupDate} type="date" />
            <Field name="pickup_time" label={f.pickupTime} type="time" />
            <Field name="return_date" label={f.returnDate} type="date" />
            <Field name="return_time" label={f.returnTime} type="time" />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <h2 className="mb-3 text-sm font-bold text-brand-700">{t.detail.sectionAddons}</h2>
          <div className="grid grid-cols-2 gap-2 text-sm text-ink-soft sm:grid-cols-4">
            {ADDON_CHECKS.map((a) => (
              <label key={a.key} className="flex items-center gap-2">
                <input type="checkbox" name={`addon_${a.key}`} className="h-4 w-4 rounded border-slate-300" />
                {lang === "ja" ? a.ja : a.zh}
              </label>
            ))}
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label} htmlFor="helmet_full">{f.fullHelmetQty}</label>
              <input id="helmet_full" name="helmet_full" type="number" min="0" defaultValue={0} className={`mt-1 ${input}`} />
            </div>
            <div>
              <label className={label} htmlFor="helmet_open">{f.openHelmetQty}</label>
              <input id="helmet_open" name="helmet_open" type="number" min="0" defaultValue={0} className={`mt-1 ${input}`} />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <h2 className="mb-3 text-sm font-bold text-brand-700">{f.notes}</h2>
          <textarea name="notes" rows={3} className={input} placeholder={t.newBooking.notesPlaceholder} />
        </section>

        <div className="flex items-center gap-3">
          <button className="btn-brand">{t.newBooking.create}</button>
          <Link href="/admin" className="text-sm text-ink-muted hover:underline">{t.common.cancel}</Link>
        </div>
      </form>
    </div>
  );
}
