import "server-only";
import { SHOP_AREAS } from "@/lib/reservations/types";
import { supabaseCatalogue } from "@/lib/supabase";

export interface CatalogueShop {
  storeId: number;
  nameJa: string;
  nameEn: string | null;
  areaId: number | null;
  areaJa: string;
  areaEn: string | null;
}

export interface ShopAreaGroup {
  areaJa: string;
  areaEn: string | null;
  shops: CatalogueShop[];
}

export function fallbackShopGroups(): ShopAreaGroup[] {
  return SHOP_AREAS.map((area) => ({
    areaJa: area.area,
    areaEn: null,
    shops: area.shops.map((name) => ({
      storeId: 0,
      nameJa: name,
      nameEn: null,
      areaId: null,
      areaJa: area.area,
      areaEn: null,
    })),
  }));
}

export function groupShops(shops: CatalogueShop[]): ShopAreaGroup[] {
  const groups: ShopAreaGroup[] = [];
  const byArea = new Map<string, ShopAreaGroup>();
  for (const shop of shops) {
    const key = shop.areaJa || "その他";
    let group = byArea.get(key);
    if (!group) {
      group = { areaJa: key, areaEn: shop.areaEn, shops: [] };
      byArea.set(key, group);
      groups.push(group);
    }
    group.shops.push(shop);
  }
  return groups;
}

/** Active shops from the last sync, or null when the catalogue is not available. */
export async function listCatalogueShops(): Promise<CatalogueShop[] | null> {
  const sb = supabaseCatalogue();
  if (!sb) return null;
  const { data, error } = await sb
    .from("catalogue_shops")
    .select("store_id, name_ja, name_en, area_id, area_ja, area_en")
    .eq("active", true)
    .order("area_id", { ascending: true })
    .order("name_ja", { ascending: true })
    .limit(300);
  if (error || !data?.length) return null;
  return data.map((row) => ({
    storeId: row.store_id as number,
    nameJa: row.name_ja as string,
    nameEn: (row.name_en as string | null) ?? null,
    areaId: (row.area_id as number | null) ?? null,
    areaJa: (row.area_ja as string | null) || "その他",
    areaEn: (row.area_en as string | null) ?? null,
  }));
}

export async function listShopGroups(): Promise<ShopAreaGroup[]> {
  try {
    const shops = await listCatalogueShops();
    if (shops?.length) return groupShops(shops);
  } catch (err) {
    console.error("catalogue shops", err);
  }
  return fallbackShopGroups();
}

/** Japanese branch names grouped by region, for the booking form and admin selects. */
export async function shopAreasForSelect(): Promise<{ area: string; shops: string[] }[]> {
  const groups = await listShopGroups();
  return groups.map((g) => ({ area: g.areaJa, shops: g.shops.map((s) => s.nameJa) }));
}
