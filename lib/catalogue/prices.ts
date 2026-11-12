import "server-only";
import { RENT_TABLE } from "@/lib/content/prices";
import { isSupabaseConfigured, supabaseAdmin } from "@/lib/supabase";

const CODES: Record<string, { d1: string; dayN: string }> = {
  "P-1": { d1: "RT819-P1-1D", dayN: "RT819-P1-2D" },
  "P-2": { d1: "RT819-P2-1D", dayN: "RT819-P2-2D" },
  "P-3": { d1: "RT819-P3-1D", dayN: "RT819-P3-2D" },
  "P-4": { d1: "RT819-P4-1D", dayN: "RT819-P4-2D" },
  "P-5": { d1: "RT819-P5-1D", dayN: "RT819-P5-2D" },
  "P-6": { d1: "RT819-P6-1D", dayN: "RT819-P6-2D" },
  "P-7": { d1: "RT819-P7-1D", dayN: "RT819-P7-2D" },
};

export interface ClassRate {
  d1: number;
  dayN: number;
}

/** HK$ reference rents by class. fee_items overrides the static table when the DB is up. */
export async function classRates(): Promise<Record<string, ClassRate>> {
  const rates: Record<string, ClassRate> = {};
  for (const row of RENT_TABLE) rates[row.cls] = { d1: row.d1, dayN: row.dayN };
  if (!isSupabaseConfigured()) return rates;
  try {
    const codes = Object.values(CODES).flatMap((c) => [c.d1, c.dayN]);
    const { data, error } = await supabaseAdmin()
      .from("fee_items")
      .select("code, unit_price")
      .in("code", codes);
    if (error || !data) return rates;
    const byCode = new Map(data.map((r) => [r.code as string, Number(r.unit_price)]));
    for (const [cls, code] of Object.entries(CODES)) {
      const d1 = byCode.get(code.d1);
      const dayN = byCode.get(code.dayN);
      if (d1 && d1 > 0) rates[cls] = { ...rates[cls], d1 };
      if (dayN && dayN > 0) rates[cls] = { ...rates[cls], dayN };
    }
  } catch {
    // Keep the static table. The catalogue must still render.
  }
  return rates;
}

/** 1st day plus each extra day. `days` is the date difference (minimum 1). */
export function referenceTotal(rate: ClassRate, days: number): number {
  const span = Math.max(1, days);
  return rate.d1 + (span - 1) * rate.dayN;
}
