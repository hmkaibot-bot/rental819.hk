import "server-only";
import { isSupabaseConfigured, supabaseAdmin } from "@/lib/supabase";
import { RT819_ITEMS, type Rt819Item } from "./items";

const TABLE = "fee_items";

/** A row of the editable fee/charge catalogue. */
export interface FeeItem {
  code: string;
  grp: Rt819Item["group"];
  desc_en: string;
  desc_zh: string | null;
  unit_price: number; // 售價 (HK$)
  cost_hkd: number; // 成本 (HK$)
  yen_cost: number; // 成本 (¥)
  sort: number;
}

/** Fallback catalogue derived from the static RT819 list (demo / unseeded db). */
function staticFeeItems(): FeeItem[] {
  return RT819_ITEMS.map((it, i) => ({
    code: it.code,
    grp: it.group,
    desc_en: it.desc_en,
    desc_zh: it.desc_zh || null,
    unit_price: it.unit_price,
    cost_hkd: it.hkd_cost,
    yen_cost: it.yen_cost,
    sort: i,
  }));
}

/** All fee items for the admin editor, in catalogue order. */
export async function listFeeItems(): Promise<FeeItem[]> {
  if (!isSupabaseConfigured()) return staticFeeItems();
  const { data, error } = await supabaseAdmin()
    .from(TABLE)
    .select("code, grp, desc_en, desc_zh, unit_price, cost_hkd, yen_cost, sort")
    .order("sort", { ascending: true });
  if (error) throw error;
  if (!data?.length) return staticFeeItems();
  return data.map((r) => ({
    code: r.code as string,
    grp: r.grp as Rt819Item["group"],
    desc_en: r.desc_en as string,
    desc_zh: (r.desc_zh as string | null) ?? null,
    unit_price: Number(r.unit_price) || 0,
    cost_hkd: Number(r.cost_hkd) || 0,
    yen_cost: Number(r.yen_cost) || 0,
    sort: Number(r.sort) || 0,
  }));
}

/**
 * Fee items in the {@link Rt819Item} shape used by the invoice seeder + picker,
 * so edited prices/costs flow straight into new invoices.
 */
export async function getCatalog(): Promise<Rt819Item[]> {
  const rows = await listFeeItems();
  return rows.map((r) => ({
    code: r.code,
    desc_en: r.desc_en,
    desc_zh: r.desc_zh ?? "",
    yen_cost: r.yen_cost,
    hkd_cost: r.cost_hkd,
    unit_price: r.unit_price,
    group: r.grp,
  }));
}

export interface FeeItemPatch {
  code: string;
  unit_price: number;
  cost_hkd: number;
  yen_cost: number;
}

/** Persist edited prices/costs. No-op in demo mode. */
export async function updateFeeItems(
  patches: FeeItemPatch[],
): Promise<{ ok: true; demo?: boolean }> {
  if (!isSupabaseConfigured()) return { ok: true, demo: true };
  const admin = supabaseAdmin();
  for (const p of patches) {
    const { error } = await admin
      .from(TABLE)
      .update({
        unit_price: p.unit_price,
        cost_hkd: p.cost_hkd,
        yen_cost: p.yen_cost,
      })
      .eq("code", p.code);
    if (error) throw error;
  }
  return { ok: true };
}
