import type { AbilityOption } from "@/lib/reservations/types";
import type { AdminLang } from "@/lib/admin/i18n";

const SELECT =
  "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20";

/**
 * Language-ability picker for the back office. Shared by the new-booking form
 * and the reservation detail so staff and customers can only ever produce the
 * same set of answers.
 *
 * Imported bookings carry wording that predates this list — six different
 * phrasings for Japanese alone, including a couple typed on the English form.
 * A plain select would show "—" for those and silently blank the field on the
 * next save, so the stored value stays selectable, exactly as the 出發店 select
 * does for branch names.
 */
export default function AbilitySelect({
  name,
  label,
  options,
  lang,
  value,
  existingSuffix,
  labelClassName = "text-xs font-medium text-ink-soft",
  wrapperClassName,
}: {
  name: string;
  label: string;
  options: AbilityOption[];
  lang: AdminLang;
  value?: string | null;
  existingSuffix: string;
  labelClassName?: string;
  wrapperClassName?: string;
}) {
  const current = value ?? "";
  const known = options.some((o) => o.value === current);

  return (
    <div className={wrapperClassName}>
      <label className={labelClassName} htmlFor={name}>
        {label}
      </label>
      <select id={name} name={name} defaultValue={current} className={`mt-1 ${SELECT}`}>
        <option value="">—</option>
        {current && !known && (
          <option value={current}>
            {current}
            {existingSuffix}
          </option>
        )}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {lang === "ja" ? o.ja : o.zh}
          </option>
        ))}
      </select>
    </div>
  );
}
