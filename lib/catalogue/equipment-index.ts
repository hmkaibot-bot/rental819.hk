import "server-only";
import { supabaseCatalogue } from "@/lib/supabase";
import { bikePrefValue } from "./labels";
import { paidFormAddons, type EquipmentBikeRef, type PaidFormAddon } from "./equipment";

export interface EquipmentBike extends EquipmentBikeRef {
  paid: PaidFormAddon[];
}

interface ModelRow {
  store_id: number;
  master_bike_id: number;
  maker: string;
  model: string;
  model_year: number | null;
  bike_class: string | null;
}

interface UnitRow {
  store_id: number;
  master_bike_id: number;
  paid_equipment: string[] | null;
}

interface ShopRow {
  store_id: number;
  name_ja: string;
}

/**
 * Models whose equipment has been scraped, with the paid add-ons the booking
 * form is allowed to offer. Models still at NULL are omitted so the form
 * keeps today's behaviour until the sync reaches them.
 */
export async function loadEquipmentBikes(): Promise<EquipmentBike[]> {
  const sb = supabaseCatalogue();
  if (!sb) return [];
  const [shops, models, units] = await Promise.all([
    pageAll<ShopRow>((from, to) =>
      sb.from("catalogue_shops").select("store_id, name_ja").eq("active", true).range(from, to),
    ),
    pageAll<ModelRow>((from, to) =>
      sb
        .from("catalogue_models")
        .select("store_id, master_bike_id, maker, model, model_year, bike_class")
        .eq("active", true)
        .range(from, to),
    ),
    pageAll<UnitRow>((from, to) =>
      sb
        .from("catalogue_units")
        .select("store_id, master_bike_id, paid_equipment")
        .eq("active", true)
        .not("paid_equipment", "is", null)
        .range(from, to),
    ),
  ]);
  if (!shops || !models || !units) return [];

  const shopName = new Map(shops.map((s) => [s.store_id, s.name_ja]));
  const paidByModel = new Map<string, Set<string>>();
  for (const unit of units) {
    if (!unit.paid_equipment) continue;
    const key = `${unit.store_id}:${unit.master_bike_id}`;
    const set = paidByModel.get(key) ?? new Set<string>();
    for (const code of unit.paid_equipment) set.add(code);
    paidByModel.set(key, set);
  }

  const bikes: EquipmentBike[] = [];
  for (const model of models) {
    const shop = shopName.get(model.store_id);
    const paid = paidByModel.get(`${model.store_id}:${model.master_bike_id}`);
    if (!shop || !paid) continue;
    bikes.push({
      shop,
      maker: model.maker,
      model: model.model,
      pref: bikePrefValue({
        maker: model.maker,
        model: model.model,
        modelYear: model.model_year,
        bikeClass: model.bike_class,
      }),
      paid: paidFormAddons([...paid]),
    });
  }
  return bikes;
}

async function pageAll<T>(
  run: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: { message: string } | null }>,
): Promise<T[] | null> {
  const rows: T[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await run(from, from + 999);
    if (error) {
      console.error("equipment index", error.message);
      return null;
    }
    rows.push(...(data ?? []));
    if (!data || data.length < 1000) break;
  }
  return rows;
}
