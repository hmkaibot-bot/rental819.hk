import Link from "next/link";
import { redirect } from "next/navigation";
import { canWrite } from "@/lib/admin/auth";
import { getAdminLang } from "@/lib/admin/lang";
import { adminDict } from "@/lib/admin/i18n";
import { createCardoRentalAction } from "./actions";

export const dynamic = "force-dynamic";

const input =
  "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20";
const label = "text-xs font-medium text-ink-soft";

function Field({
  name,
  label: lbl,
  type = "text",
  placeholder,
}: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className={label} htmlFor={name}>
        {lbl}
      </label>
      <input id={name} name={name} type={type} placeholder={placeholder} className={`mt-1 ${input}`} />
    </div>
  );
}

export default function NewCardoRentalPage() {
  // This page exists only to create a record — send a read-only session back to
  // the list rather than showing a form whose submit can never succeed.
  if (!canWrite()) redirect("/admin");
  const lang = getAdminLang();
  const t = adminDict(lang);
  const f = t.fields;

  return (
    <div className="mx-auto max-w-xl">
      <Link href="/admin" className="text-sm text-brand-700 hover:underline">
        {t.common.backToList}
      </Link>
      <h1 className="mt-1 text-xl font-bold">{t.newCardo.title}</h1>
      <p className="mb-5 text-sm text-ink-muted">{t.newCardo.intro}</p>

      <form action={createCardoRentalAction} className="space-y-5">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <h2 className="mb-3 text-sm font-bold text-brand-700">{t.detail.sectionCustomer}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="name_zh" label={f.nameZh} />
            <Field name="name_en" label={f.nameEn} />
            <Field name="hk_phone" label={f.hkPhone} />
            <Field name="email" label={f.email} type="email" />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <h2 className="mb-3 text-sm font-bold text-brand-700">{t.newCardo.badge}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="pickup_date" label={t.newCardo.rentFrom} type="date" />
            <Field name="return_date" label={t.newCardo.rentTo} type="date" />
          </div>
          <div className="mt-4">
            <label className={label} htmlFor="notes">{f.notes}</label>
            <textarea id="notes" name="notes" rows={3} className={`mt-1 ${input}`} placeholder={t.newBooking.notesPlaceholder} />
          </div>
        </section>

        <div className="flex items-center gap-3">
          <button className="btn-brand">{t.newCardo.create}</button>
          <Link href="/admin" className="text-sm text-ink-muted hover:underline">{t.common.cancel}</Link>
        </div>
      </form>
    </div>
  );
}
