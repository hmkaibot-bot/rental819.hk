import "server-only";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import { hkd } from "@/lib/content/prices";
import { supabaseCatalogue } from "@/lib/supabase";
import { dateDiffDays, unitAvailable, type AvailDay } from "./availability";
import { equipmentLabel } from "./equipment";
import { bikePrefValue, colourLabel, makerLabel, typeLabel } from "./labels";
import { classRates, referenceTotal } from "./prices";
import { listCatalogueShops, type CatalogueShop } from "./shops";

export interface EquipmentLine {
  key: string;
  /** Set when colours of the same model carry different equipment. */
  colour: string | null;
  free: string[];
  paid: string[];
}

export interface CatalogueCard {
  key: string;
  title: string;
  bikeClass: string | null;
  typeLabel: string | null;
  ccLabel: string | null;
  year: number | null;
  photo: string | null;
  colours: string[];
  /** Null until this model's units have been scraped for equipment. */
  equipment: { varies: boolean; lines: EquipmentLine[] } | null;
  priceLabel: string;
  availability: "unknown" | "yes" | "no";
  bookHref: string;
}

export interface CatalogueData {
  synced: boolean;
  shops: CatalogueShop[];
  selected: CatalogueShop | null;
  areaEmpty: boolean;
  pickup: string;
  returnDate: string;
  maker: string;
  type: string;
  makers: string[];
  types: string[];
  dateError: "order" | "past" | null;
  cards: CatalogueCard[];
  matched: number;
  listed: number;
}

const DEFAULT_STORE = 110;
const ISO = /^\d{4}-\d{2}-\d{2}$/;

export function hkToday(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Hong_Kong",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

interface RawUnit {
  unit_id: number;
  colour: string | null;
  photo_url: string | null;
  active: boolean;
  free_equipment?: string[] | null;
  paid_equipment?: string[] | null;
}

interface RawModel {
  master_bike_id: number;
  maker: string;
  model: string;
  bike_class: string | null;
  bike_type: string | null;
  displacement_cc: number | string | null;
  model_year: number | null;
  photo_url: string | null;
  catalogue_units: RawUnit[] | null;
}

export async function loadCatalogue(
  locale: Locale,
  sp: { shop?: string; pickup?: string; return?: string; maker?: string; type?: string; area?: string },
): Promise<CatalogueData> {
  const empty: CatalogueData = {
    synced: false,
    shops: [],
    selected: null,
    areaEmpty: false,
    pickup: "",
    returnDate: "",
    maker: "",
    type: "",
    makers: [],
    types: [],
    dateError: null,
    cards: [],
    matched: 0,
    listed: 0,
  };
  const shops = await listCatalogueShops();
  if (!shops?.length) return empty;

  const areaId = Number(sp.area);
  const areaShops = Number.isInteger(areaId) ? shops.filter((s) => s.areaId === areaId) : [];
  const areaEmpty = Number.isInteger(areaId) && sp.area !== undefined && sp.area !== "" && areaShops.length === 0;
  const requestedId = Number(sp.shop);
  const inArea = areaShops.length
    ? areaShops.find((s) => s.storeId === DEFAULT_STORE) ?? areaShops[0]
    : undefined;
  let selected: CatalogueShop | undefined = areaEmpty
    ? undefined
    : shops.find((s) => s.storeId === requestedId) ??
      inArea ??
      shops.find((s) => s.storeId === DEFAULT_STORE) ??
      shops[0];

  const today = hkToday();
  let pickup = ISO.test(sp.pickup || "") ? sp.pickup! : "";
  let returnDate = ISO.test(sp.return || "") ? sp.return! : "";
  let dateError: CatalogueData["dateError"] = null;
  if (pickup && pickup < today) {
    dateError = "past";
    pickup = "";
    returnDate = "";
  } else if (pickup && returnDate && !(pickup < returnDate)) {
    dateError = "order";
    pickup = "";
    returnDate = "";
  } else if ((pickup && !returnDate) || (!pickup && returnDate)) {
    pickup = "";
    returnDate = "";
  }

  const base: CatalogueData = {
    ...empty,
    synced: true,
    shops,
    selected: selected ?? null,
    areaEmpty,
    pickup,
    returnDate,
    maker: sp.maker || "",
    type: sp.type || "",
    dateError,
  };
  if (!selected) return base;

  const sb = supabaseCatalogue();
  if (!sb) return { ...base, synced: false };

  const { data, error } = await sb
    .from("catalogue_models")
    .select(
      "master_bike_id, maker, model, bike_class, bike_type, displacement_cc, model_year, photo_url, catalogue_units(unit_id, colour, photo_url, active, free_equipment, paid_equipment)",
    )
    .eq("store_id", selected.storeId)
    .eq("active", true)
    .order("maker", { ascending: true })
    .order("model", { ascending: true })
    .limit(400);
  if (error || !data) {
    console.error("catalogue models", error?.message);
    return base;
  }
  const models = data as unknown as RawModel[];
  const makers = [...new Set(models.map((m) => m.maker))].sort();
  const types = [...new Set(models.map((m) => m.bike_type).filter((t): t is string => Boolean(t)))].sort();
  const maker = makers.includes(sp.maker || "") ? sp.maker! : "";
  const type = types.includes(sp.type || "") ? sp.type! : "";
  const filtered = models.filter((m) => (!maker || m.maker === maker) && (!type || m.bike_type === type));

  const datesOn = Boolean(pickup && returnDate);
  const unitIds = filtered.flatMap((m) =>
    (m.catalogue_units ?? []).filter((u) => u.active).map((u) => u.unit_id),
  );
  const avail = datesOn ? await loadAvailability(unitIds, pickup, returnDate) : new Map<number, AvailDay[]>();
  const rates = await classRates();
  const days = datesOn ? dateDiffDays(pickup, returnDate) : 0;
  const isEn = locale === "en";

  const cards: CatalogueCard[] = filtered.map((m) => {
    const units = (m.catalogue_units ?? []).filter((u) => u.active);
    const colours = [...new Set(units.map((u) => u.colour).filter((c): c is string => Boolean(c)))].map((c) =>
      colourLabel(c, locale),
    );
    let availability: CatalogueCard["availability"] = "unknown";
    if (datesOn) {
      availability = units.some((u) => unitAvailable(avail.get(u.unit_id) ?? [], pickup, returnDate))
        ? "yes"
        : "no";
    }
    const cc = m.displacement_cc == null ? null : Number(m.displacement_cc);
    const rate = m.bike_class ? rates[m.bike_class] : undefined;
    const amount = rate ? (datesOn ? referenceTotal(rate, days) : rate.d1) : null;
    const priceLabel = amount == null ? "" : hkd(amount);
    const pref = bikePrefValue({
      maker: m.maker,
      model: m.model,
      modelYear: m.model_year,
      bikeClass: m.bike_class,
    });
    const q = new URLSearchParams();
    q.set("bike", pref);
    q.set("shop", selected.nameJa);
    if (datesOn) {
      q.set("pickup_date", pickup);
      q.set("return_date", returnDate);
    }
    return {
      key: String(m.master_bike_id),
      title: `${makerLabel(m.maker, locale)} ${m.model}`,
      bikeClass: m.bike_class,
      typeLabel: m.bike_type ? typeLabel(m.bike_type, locale) : null,
      ccLabel: cc != null && Number.isFinite(cc) ? `${Number.isInteger(cc) ? cc : cc}cc` : null,
      year: m.model_year,
      photo: m.photo_url,
      colours,
      equipment: equipmentLines(units, locale),
      priceLabel,
      availability,
      bookHref: `${localePath(locale, "/booking")}?${q.toString()}`,
    };
  });

  cards.sort((a, b) => {
    if (datesOn && a.availability !== b.availability) {
      if (a.availability === "yes") return -1;
      if (b.availability === "yes") return 1;
    }
    return a.title.localeCompare(b.title, isEn ? "en" : "zh-Hant");
  });

  return {
    ...base,
    maker,
    type,
    makers,
    types,
    cards,
    matched: cards.length,
    listed: models.length,
  };
}

function equipmentLines(units: RawUnit[], locale: Locale): CatalogueCard["equipment"] {
  const known = units.filter((u) => u.free_equipment != null && u.paid_equipment != null);
  if (!known.length) return null;
  const sig = (u: RawUnit) =>
    `${[...(u.free_equipment ?? [])].slice().sort().join(",")}|${[...(u.paid_equipment ?? [])].slice().sort().join(",")}`;
  const distinct = new Set(known.map(sig));
  const varies = distinct.size > 1;
  const seen = new Set<string>();
  const lines: EquipmentLine[] = [];
  for (const unit of known) {
    const colour = unit.colour ? colourLabel(unit.colour, locale) : null;
    const key = varies ? `${colour ?? ""}:${sig(unit)}` : "all";
    if (seen.has(key)) continue;
    seen.add(key);
    lines.push({
      key,
      colour: varies ? colour : null,
      free: (unit.free_equipment ?? []).map((code) => equipmentLabel(code, locale)),
      paid: (unit.paid_equipment ?? []).map((code) => equipmentLabel(code, locale)),
    });
  }
  const visible = lines.filter((line) => line.free.length || line.paid.length);
  if (!visible.length) return { varies: false, lines: [] };
  return { varies, lines: visible };
}

async function loadAvailability(
  unitIds: number[],
  pickup: string,
  returnDate: string,
): Promise<Map<number, AvailDay[]>> {
  const grouped = new Map<number, AvailDay[]>();
  const sb = supabaseCatalogue();
  if (!sb || !unitIds.length) return grouped;
  for (let i = 0; i < unitIds.length; i += 80) {
    const ids = unitIds.slice(i, i + 80);
    let from = 0;
    for (;;) {
      const { data, error } = await sb
        .from("catalogue_availability")
        .select("unit_id, day, status, can_start")
        .in("unit_id", ids)
        .gte("day", pickup)
        .lte("day", returnDate)
        .range(from, from + 999);
      if (error) {
        console.error("catalogue availability", error.message);
        break;
      }
      for (const row of data ?? []) {
        const id = row.unit_id as number;
        const list = grouped.get(id) ?? [];
        list.push({
          day: String(row.day).slice(0, 10),
          status: row.status as string,
          canStart: Boolean(row.can_start),
        });
        grouped.set(id, list);
      }
      if (!data || data.length < 1000) break;
      from += 1000;
    }
  }
  return grouped;
}
