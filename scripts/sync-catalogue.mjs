#!/usr/bin/env node
/**
 * Sync the public Rental819 fleet into catalogue_* tables.
 *
 *   node scripts/sync-catalogue.mjs                 # every shop
 *   node scripts/sync-catalogue.mjs --store 110     # one shop's fleet
 *   node scripts/sync-catalogue.mjs --dump /tmp/out # also write JSON (no DB if creds are absent)
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY
 * unless --dump is set. Rate limit: CATALOGUE_SYNC_INTERVAL_MS (default 650, about 1.5 req/s).
 */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import {
  parseAvailability,
  parseBikeDetail,
  parseSearchPage,
  parseStoreList,
} from "./catalogue/parse.mjs";

const ORIGIN = "https://rental819.com";
const UA = "rental819-hk-catalogue-sync/1.0 (+https://rental819.hk)";
const INTERVAL_MS = Math.max(400, Number(process.env.CATALOGUE_SYNC_INTERVAL_MS) || 650);
const MAX_ERRORS = 80;

const args = process.argv.slice(2);
function flag(name) {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
}
const onlyStore = flag("--store") ? Number(flag("--store")) : null;
const dumpDir = flag("--dump") || "";
const force = args.includes("--force");

if (onlyStore !== null && !Number.isInteger(onlyStore)) {
  console.error("--store must be an integer store id");
  process.exit(1);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const hasDb = Boolean(supabaseUrl && serviceKey);
if (!hasDb && !dumpDir) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, or pass --dump.");
  process.exit(1);
}

const sb = hasDb
  ? createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } })
  : null;

const stats = { requests: 0 };
let nextSlot = 0;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function pace() {
  const wait = Math.max(0, nextSlot - Date.now());
  if (wait) await sleep(wait);
  nextSlot = Date.now() + INTERVAL_MS;
}

async function fetchText(url, headers) {
  let last;
  for (let attempt = 0; attempt < 4; attempt++) {
    await pace();
    try {
      const res = await fetch(url, {
        headers,
        redirect: "follow",
        signal: AbortSignal.timeout(30000),
      });
      stats.requests++;
      if (res.status === 429 || res.status >= 500) {
        const retryAfter = Number(res.headers.get("retry-after"));
        const wait = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 1000 * 2 ** attempt;
        last = new Error(`HTTP ${res.status} ${url}`);
        await sleep(wait);
        continue;
      }
      if (res.status === 404) {
        const err = new Error(`HTTP 404 ${url}`);
        err.notFound = true;
        throw err;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
      return await res.text();
    } catch (err) {
      if (err?.notFound) throw err;
      last = err;
      if (attempt === 3) break;
      await sleep(1000 * 2 ** attempt);
    }
  }
  throw last instanceof Error ? last : new Error(String(last));
}

async function fetchJson(url) {
  const text = await fetchText(url, {
    "User-Agent": UA,
    Accept: "application/json",
    "Accept-Language": "ja",
    "HX-Request": "true",
  });
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Not JSON ${url}`);
  }
}

function chunk(rows, size) {
  const out = [];
  for (let i = 0; i < rows.length; i += size) out.push(rows.slice(i, i + size));
  return out;
}

async function must(promise, label) {
  const { error } = await promise;
  if (error) throw new Error(`${label}: ${error.message}`);
}

async function selectIds(table, column, filters) {
  const rows = [];
  let from = 0;
  for (;;) {
    let q = sb.from(table).select(column).range(from, from + 999);
    for (const [key, value] of Object.entries(filters)) q = q.eq(key, value);
    const { data, error } = await q;
    if (error) throw new Error(`select ${table}: ${error.message}`);
    rows.push(...(data || []));
    if (!data || data.length < 1000) break;
    from += 1000;
  }
  return rows;
}

function pushError(errors, entry) {
  if (errors.length < MAX_ERRORS) errors.push(entry);
}

async function loadShops() {
  const jaHtml = await fetchText(`${ORIGIN}/store/`, {
    "User-Agent": UA,
    Accept: "text/html",
    "Accept-Language": "ja",
  });
  const enHtml = await fetchText(`${ORIGIN}/store/`, {
    "User-Agent": UA,
    Accept: "text/html",
    "Accept-Language": "en",
  });
  const ja = parseStoreList(jaHtml);
  const en = parseStoreList(enHtml);
  if (ja.length < 50) throw new Error(`Store list parsed ${ja.length} shops; refusing to continue`);
  const enById = new Map(en.map((s) => [s.storeId, s]));
  const now = new Date().toISOString();
  return ja.map((s) => {
    const e = enById.get(s.storeId);
    return {
      store_id: s.storeId,
      name_ja: s.name,
      name_en: e?.name || null,
      area_id: s.areaId,
      area_ja: s.area || null,
      area_en: e?.area || null,
      prefecture_ja: s.prefecture || null,
      prefecture_en: e?.prefecture || null,
      address_ja: s.address || null,
      address_en: e?.address || null,
      active: true,
      updated_at: now,
    };
  });
}

async function searchShop(storeId, errors) {
  const items = new Map();
  const firstUrl = `${ORIGIN}/search/?store=${storeId}&page=1`;
  let first;
  try {
    first = parseSearchPage(
      await fetchText(firstUrl, {
        "User-Agent": UA,
        Accept: "text/html",
        "Accept-Language": "ja",
        "HX-Request": "true",
      }),
    );
  } catch (err) {
    pushError(errors, { store_id: storeId, url: firstUrl, message: err.message });
    return { complete: false, items: [] };
  }
  for (const item of first.items) {
    if (item.storeId === storeId) items.set(item.masterBikeId, item);
  }
  const maxPage = Math.min(first.maxPage, 40);
  let complete = true;
  for (let page = 2; page <= maxPage; page++) {
    const url = `${ORIGIN}/search/?store=${storeId}&page=${page}`;
    try {
      const parsed = parseSearchPage(
        await fetchText(url, {
          "User-Agent": UA,
          Accept: "text/html",
          "Accept-Language": "ja",
          "HX-Request": "true",
        }),
      );
      if (!parsed.items.length) break;
      for (const item of parsed.items) {
        if (item.storeId === storeId) items.set(item.masterBikeId, item);
      }
    } catch (err) {
      complete = false;
      pushError(errors, { store_id: storeId, url, message: err.message });
      break;
    }
  }
  return { complete, items: [...items.values()] };
}

async function syncShop(shop, errors) {
  const storeId = shop.store_id;
  const searched = await searchShop(storeId, errors);
  if (!searched.complete && searched.items.length === 0) {
    throw new Error("search failed");
  }
  const now = new Date().toISOString();
  const models = [];
  const units = [];
  const availability = [];
  const freshUnits = [];
  const preserve = new Set();

  for (const item of searched.items) {
    const url = `${ORIGIN}/bike/${storeId}/${item.masterBikeId}`;
    let detail;
    try {
      detail = parseBikeDetail(
        await fetchText(url, {
          "User-Agent": UA,
          Accept: "text/html",
          "Accept-Language": "ja",
        }),
      );
    } catch (err) {
      if (!err.notFound) preserve.add(item.masterBikeId);
      pushError(errors, { store_id: storeId, url, message: err.message });
      continue;
    }
    if (!detail.units.length) {
      pushError(errors, { store_id: storeId, url, message: "no units" });
      preserve.add(item.masterBikeId);
      continue;
    }
    const photo = item.photoUrl || detail.units.find((u) => u.photoUrl)?.photoUrl || null;
    models.push({
      store_id: storeId,
      master_bike_id: item.masterBikeId,
      maker: item.maker || detail.maker || "—",
      model: item.model,
      bike_class: item.bikeClass || detail.bikeClass,
      bike_type: item.bikeType || detail.bikeType,
      displacement_cc: item.displacementCc ?? detail.displacementCc,
      model_year: item.modelYear ?? detail.modelYear,
      photo_url: photo,
      active: true,
      updated_at: now,
    });
    for (const unit of detail.units) {
      units.push({
        unit_id: unit.unitId,
        store_id: storeId,
        master_bike_id: item.masterBikeId,
        colour: unit.colour,
        photo_url: unit.photoUrl || photo,
        active: true,
        updated_at: now,
      });
      const availUrl = `${ORIGIN}/bike/get_reserve_status_dates/${unit.unitId}`;
      try {
        const payload = await fetchJson(availUrl);
        const byDay = new Map();
        for (const row of parseAvailability(payload)) byDay.set(row.day, row);
        if (!byDay.size) throw new Error("empty availability");
        freshUnits.push(unit.unitId);
        for (const row of byDay.values()) {
          availability.push({
            unit_id: unit.unitId,
            day: row.day,
            status: row.status,
            can_start: row.canStart,
          });
        }
      } catch (err) {
        pushError(errors, { store_id: storeId, url: availUrl, message: err.message });
      }
    }
  }

  const payload = {
    shop,
    models,
    units,
    availability,
    freshUnits,
    preserve: [...preserve],
    searchComplete: searched.complete,
  };
  if (dumpDir) {
    await mkdir(dumpDir, { recursive: true });
    await writeFile(path.join(dumpDir, `store-${storeId}.json`), JSON.stringify(payload));
  }
  if (sb) await writeShop(payload);
  return {
    models: models.length,
    units: units.length,
    availability: availability.length,
  };
}

async function writeShop({ shop, models, units, availability, freshUnits, preserve, searchComplete }) {
  const storeId = shop.store_id;
  await must(sb.from("catalogue_shops").upsert(shop, { onConflict: "store_id" }), "upsert shop");
  for (const part of chunk(models, 200)) {
    await must(
      sb.from("catalogue_models").upsert(part, { onConflict: "store_id,master_bike_id" }),
      "upsert models",
    );
  }
  for (const part of chunk(units, 200)) {
    await must(sb.from("catalogue_units").upsert(part, { onConflict: "unit_id" }), "upsert units");
  }

  if (searchComplete) {
    const existing = await selectIds("catalogue_models", "master_bike_id", {
      store_id: storeId,
      active: true,
    });
    const seen = new Set(models.map((m) => m.master_bike_id));
    const keep = new Set(preserve);
    const stale = existing
      .map((r) => r.master_bike_id)
      .filter((id) => !seen.has(id) && !keep.has(id));
    for (const part of chunk(stale, 100)) {
      await must(
        sb.from("catalogue_models").update({ active: false }).eq("store_id", storeId).in("master_bike_id", part),
        "deactivate models",
      );
      await must(
        sb.from("catalogue_units").update({ active: false }).eq("store_id", storeId).in("master_bike_id", part),
        "deactivate model units",
      );
    }
  }

  const byModel = new Map();
  for (const unit of units) {
    const list = byModel.get(unit.master_bike_id) || [];
    list.push(unit.unit_id);
    byModel.set(unit.master_bike_id, list);
  }
  for (const [masterBikeId, liveIds] of byModel) {
    const existingUnits = await selectIds("catalogue_units", "unit_id", {
      store_id: storeId,
      master_bike_id: masterBikeId,
      active: true,
    });
    const live = new Set(liveIds);
    const staleUnits = existingUnits.map((r) => r.unit_id).filter((id) => !live.has(id));
    for (const part of chunk(staleUnits, 100)) {
      await must(
        sb.from("catalogue_units").update({ active: false }).in("unit_id", part),
        "deactivate units",
      );
    }
  }

  // Replace calendars only for units whose fetch succeeded, so a failed
  // request leaves yesterday's rows in place instead of wiping them.
  for (const part of chunk(freshUnits, 80)) {
    await must(sb.from("catalogue_availability").delete().in("unit_id", part), "delete availability");
  }
  for (const part of chunk(availability, 400)) {
    await must(sb.from("catalogue_availability").insert(part), "insert availability");
  }
}

async function claimRun(scope) {
  if (!sb) return null;
  const { data: running, error: readErr } = await sb
    .from("catalogue_sync_runs")
    .select("id, started_at")
    .eq("status", "running")
    .order("started_at", { ascending: false })
    .limit(1);
  if (readErr) throw new Error(readErr.message);
  const current = running?.[0];
  if (current) {
    const age = Date.now() - new Date(current.started_at).getTime();
    if (age < 6 * 60 * 60 * 1000 && !force) {
      console.log(`Another sync is already running (${current.id}). Pass --force to ignore it.`);
      process.exit(0);
    }
    await must(
      sb.from("catalogue_sync_runs").update({
        status: "failed",
        finished_at: new Date().toISOString(),
        message: "superseded: previous run did not finish",
      }).eq("id", current.id),
      "close stale run",
    );
  }
  const { data, error } = await sb
    .from("catalogue_sync_runs")
    .insert({ status: "running", scope })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  return data.id;
}

async function finishRun(id, patch) {
  if (!sb || !id) return;
  await must(
    sb.from("catalogue_sync_runs").update({ ...patch, finished_at: new Date().toISOString() }).eq("id", id),
    "finish run",
  );
}

async function main() {
  const scope = onlyStore ? `store:${onlyStore}` : "all";
  console.log(`Catalogue sync scope=${scope} interval=${INTERVAL_MS}ms db=${hasDb ? "yes" : "dump-only"}`);
  const runId = await claimRun(scope);
  const errors = [];
  let shopsOk = 0;
  let shopsFailed = 0;
  let models = 0;
  let units = 0;
  let availabilityRows = 0;
  try {
    const shops = await loadShops();
    if (sb) {
      for (const part of chunk(shops, 200)) {
        await must(sb.from("catalogue_shops").upsert(part, { onConflict: "store_id" }), "upsert shops");
      }
      if (!onlyStore) {
        const { data: existing, error } = await sb.from("catalogue_shops").select("store_id").eq("active", true);
        if (error) throw new Error(error.message);
        const live = new Set(shops.map((s) => s.store_id));
        const stale = (existing || []).map((r) => r.store_id).filter((id) => !live.has(id));
        for (const part of chunk(stale, 100)) {
          await must(
            sb.from("catalogue_shops").update({ active: false }).in("store_id", part),
            "deactivate shops",
          );
        }
      }
    }
    if (dumpDir) {
      await mkdir(dumpDir, { recursive: true });
      await writeFile(path.join(dumpDir, "shops.json"), JSON.stringify(shops));
    }
    const targets = onlyStore ? shops.filter((s) => s.store_id === onlyStore) : shops;
    if (onlyStore && !targets.length) throw new Error(`Store ${onlyStore} is not on the official store list`);
    for (const shop of targets) {
      try {
        const counts = await syncShop(shop, errors);
        shopsOk++;
        models += counts.models;
        units += counts.units;
        availabilityRows += counts.availability;
        console.log(
          `ok store ${shop.store_id} ${shop.name_ja} models=${counts.models} units=${counts.units} days=${counts.availability}`,
        );
      } catch (err) {
        shopsFailed++;
        pushError(errors, { store_id: shop.store_id, message: err.message });
        console.error(`fail store ${shop.store_id} ${shop.name_ja}: ${err.message}`);
      }
    }
    const status =
      shopsOk === 0 ? "failed" : shopsFailed === 0 && errors.length === 0 ? "success" : "partial";
    const message = `${shopsOk} shops ok, ${shopsFailed} failed, ${models} models, ${units} units, ${availabilityRows} availability rows, ${stats.requests} requests`;
    console.log(message);
    await finishRun(runId, {
      status,
      shops_ok: shopsOk,
      shops_failed: shopsFailed,
      models,
      units,
      availability_rows: availabilityRows,
      requests: stats.requests,
      error_log: errors,
      message,
    });
    if (status === "failed") process.exit(1);
  } catch (err) {
    console.error(err.message || err);
    await finishRun(runId, {
      status: "failed",
      shops_ok: shopsOk,
      shops_failed: shopsFailed,
      models,
      units,
      availability_rows: availabilityRows,
      requests: stats.requests,
      error_log: [...errors, { message: err.message || String(err) }].slice(0, MAX_ERRORS),
      message: err.message || String(err),
    });
    process.exit(1);
  }
}

main();
