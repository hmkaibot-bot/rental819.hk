/** HTML parsers for the public Rental819 fleet pages. No prices in JPY are kept. */

export function decodeHtml(value) {
  return String(value ?? "")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanArea(name) {
  return decodeHtml(name).replace(/(エリア| Area)$/i, "").trim();
}

/**
 * @param {string} html store list page
 * @returns {{ storeId: number, name: string, areaId: number | null, area: string, prefecture: string, address: string }[]}
 */
export function parseStoreList(html) {
  const blocks = String(html).split('<div class="p-store-list__area-block">').slice(1);
  const shops = [];
  for (const block of blocks) {
    const areaId = Number((block.match(/id="area_(\d+)"/) || [])[1]) || null;
    const area = cleanArea((block.match(/p-store-list__area-title">([\s\S]*?)<\/h3>/) || [])[1] || "");
    const prefParts = block.split(/<p id="prefecture_\d+" class="p-store-list__pref">/);
    for (let i = 1; i < prefParts.length; i++) {
      const prefecture = decodeHtml(prefParts[i].split("</p>")[0] || "");
      const re =
        /<a href="\/store\/(\d+)">[\s\S]*?p-store-list__store-name">([\s\S]*?)<\/span>[\s\S]*?p-store-list__store-adress">([\s\S]*?)<\/span>/g;
      let m;
      while ((m = re.exec(prefParts[i]))) {
        shops.push({
          storeId: Number(m[1]),
          name: decodeHtml(m[2]),
          areaId,
          area,
          prefecture,
          address: decodeHtml(m[3]),
        });
      }
    }
  }
  return shops;
}

function ddAfter(chunk, label) {
  const re = new RegExp(
    `<dt[^>]*>\\s*${label}\\s*</dt>\\s*<dd[^>]*>\\s*([\\s\\S]*?)\\s*</dd>`,
  );
  const m = chunk.match(re);
  return m ? decodeHtml(m[1]) : "";
}

/** @param {string} html one search-results fragment */
export function parseSearchPage(html) {
  const source = String(html);
  const total = Number(
    (source.match(/p-search-result__result-number">[\s\S]*?<span>(\d+)<\/span>/) || [])[1] || 0,
  );
  const pageNums = [...source.matchAll(/[?&]page=(\d+)/g)].map((m) => Number(m[1]));
  const maxPage = Math.max(1, Math.ceil(total / 20) || 1, ...pageNums);
  const items = [];
  const parts = source.split('<div class="p-search-result__item">').slice(1);
  for (const part of parts) {
    const chunk = part.split('<div class="c-pagination">')[0];
    const link = chunk.match(/\/bike\/(\d+)\/(\d+)/);
    const names = [
      ...chunk.matchAll(/p-search-result__item-name">\s*<span>([^<]*)<\/span>\s*<span>([^<]*)<\/span>/g),
    ];
    if (!link || !names.length) continue;
    const photo =
      (chunk.match(/<img[^>]*\bdata-src="(https:[^"]+)"/) ||
        chunk.match(/<img[^>]*\bsrc="(https:[^"]+)"/) ||
        [])[1] || null;
    const ccText = ddAfter(chunk, "排気量");
    const cc = Number((ccText.match(/[\d.]+/) || [])[0]);
    const year = Number(ddAfter(chunk, "年式"));
    const cls = (ddAfter(chunk, "クラス").match(/P-[1-7]/) || [])[0] || null;
    items.push({
      storeId: Number(link[1]),
      masterBikeId: Number(link[2]),
      maker: decodeHtml(names[0][1]),
      model: decodeHtml(names[0][2]),
      bikeType: ddAfter(chunk, "タイプ") || null,
      bikeClass: cls,
      displacementCc: Number.isFinite(cc) ? cc : null,
      modelYear: Number.isInteger(year) && year > 1980 && year < 2100 ? year : null,
      photoUrl: photo,
    });
  }
  return { total, maxPage, items };
}

function attr(tag, name) {
  const m = tag.match(new RegExp(`\\b${name}="([^"]*)"`));
  return m ? decodeHtml(m[1]) : "";
}

/** @param {string} html bike detail page */
export function parseBikeDetail(html) {
  const source = String(html);
  const units = [];
  const re = /<li\b([^>]*\bdata-id="\d+"[^>]*)>/g;
  let m;
  while ((m = re.exec(source))) {
    const tag = m[1];
    const unitId = Number(attr(tag, "data-id"));
    if (!unitId) continue;
    units.push({
      unitId,
      colour: attr(tag, "data-color") || null,
      photoUrl: attr(tag, "data-image") || null,
    });
  }
  const ccText = ddAfter(source, "排気量");
  const cc = Number((ccText.match(/[\d.]+/) || [])[0]);
  const year = Number(ddAfter(source, "年式"));
  return {
    maker: ddAfter(source, "メーカー") || null,
    bikeType: ddAfter(source, "タイプ") || null,
    bikeClass: (ddAfter(source, "クラス").match(/P-[1-7]/) || [])[0] || null,
    displacementCc: Number.isFinite(cc) ? cc : null,
    modelYear: Number.isInteger(year) && year > 1980 && year < 2100 ? year : null,
    units,
  };
}

/** Expand official availability JSON into one row per day. */
export function parseAvailability(payload) {
  const spans = Array.isArray(payload?.result) ? payload.result : [];
  const rows = [];
  for (const span of spans) {
    const status = String(span?.type || "");
    if (!status || !span.start || !span.end) continue;
    let day = String(span.start).slice(0, 10);
    const end = String(span.end).slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || !/^\d{4}-\d{2}-\d{2}$/.test(end)) continue;
    let guard = 0;
    while (day <= end && guard < 400) {
      rows.push({
        day,
        status,
        canStart: Boolean(span.flg_start_date),
      });
      day = addUtcDay(day);
      guard++;
    }
  }
  return rows;
}

function addUtcDay(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + 1);
  return dt.toISOString().slice(0, 10);
}
