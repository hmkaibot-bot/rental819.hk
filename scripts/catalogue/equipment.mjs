/**
 * Rental819 bike-page equipment.
 *
 * The detail page lists every possible item, then shows a subset per unit.
 * `data-default-option` / `data-custom-option` are bitmasks; bit i matches
 * `<li id="default_option_i">` (see rental819.com static/js/bike.js).
 * Japanese labels are the stable source. Unknown labels are kept as `raw:…`
 * so a new official item is not dropped.
 */

export const EQUIPMENT_CODE_BY_JA = {
  トップケース: "topcase",
  サイドバッグ: "sidebag",
  パニアケース: "pannier",
  スマホホルダー: "phone_holder",
  USBソケット: "usb",
  "USB-C type": "usb_c",
  シガーソケット: "cigarette",
  ETC車載器: "etc_reader",
};

/**
 * @param {string | number | null | undefined} mask
 * @param {{ bit: number, label: string, code: string | null }[]} catalog
 * @param {Set<string>} unmapped
 * @returns {string[]}
 */
export function codesForMask(mask, catalog, unmapped) {
  const n = Number(mask);
  if (!Number.isInteger(n) || n < 0) return [];
  const known = new Set(catalog.map((item) => item.bit));
  const out = [];
  for (const item of catalog) {
    if ((n & (1 << item.bit)) === 0) continue;
    if (item.code) out.push(item.code);
    else {
      unmapped.add(item.label || `bit:${item.bit}`);
      out.push(item.label ? `raw:${item.label}` : `raw:bit:${item.bit}`);
    }
  }
  for (let bit = 0; bit <= 15; bit++) {
    if ((n & (1 << bit)) !== 0 && !known.has(bit)) unmapped.add(`bit:${bit}`);
  }
  return out;
}
