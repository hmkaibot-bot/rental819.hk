"use client";

import { useRouter } from "next/navigation";

/**
 * Status filter that lives in the table header. Uses a native <select> so the
 * option popup is rendered by the browser and never clipped by the table's
 * horizontal-scroll container. Preserves the current sort on navigation.
 */
export function StatusFilter({
  value,
  options,
  keep,
}: {
  value: string;
  options: { key: string; label: string; count: number }[];
  keep: { sort?: string; dir?: string };
}) {
  const router = useRouter();
  return (
    <select
      aria-label="篩選狀態"
      value={value}
      onChange={(e) => {
        const sp = new URLSearchParams();
        if (e.target.value) sp.set("status", e.target.value);
        if (keep.sort) {
          sp.set("sort", keep.sort);
          if (keep.dir) sp.set("dir", keep.dir);
        }
        const s = sp.toString();
        router.push(`/admin${s ? `?${s}` : ""}`);
      }}
      className="max-w-[150px] rounded-md border border-slate-200 bg-white px-1.5 py-1 text-xs font-normal normal-case text-ink-soft outline-none hover:border-slate-300 focus:border-brand-500"
    >
      {options.map((o) => (
        <option key={o.key || "all"} value={o.key}>
          {o.label}（{o.count}）
        </option>
      ))}
    </select>
  );
}
