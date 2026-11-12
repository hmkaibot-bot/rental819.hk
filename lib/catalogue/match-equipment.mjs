/**
 * Match a booking's shop + bike text to one catalogue model.
 * `pref` must be the same string the catalogue Book link writes
 * (`bikePrefValue` in labels.ts). Ambiguous text matches nothing, so the
 * form keeps every add-on selectable.
 *
 * @param {string} shop Japanese branch name, as stored on the booking
 * @param {string} bikeText bike preference the customer is booking
 * @param {{ shop: string, pref: string, maker: string, model: string, paid: string[] }[]} bikes
 */
export function matchEquipmentBike(shop, bikeText, bikes) {
  const t = norm(bikeText);
  const branch = norm(shop);
  if (!t || !branch) return null;
  const rows = (bikes || []).filter((b) => norm(b.shop) === branch);
  if (!rows.length) return null;

  const exact = rows.filter((b) => {
    const pref = norm(b.pref);
    const withoutClass = pref.replace(/\s*\/\s*p-[1-7]\s*$/i, "");
    return t === pref || t === withoutClass || t === norm(`${b.maker} ${b.model}`) || t === norm(b.model);
  });
  if (exact.length === 1) return exact[0];
  if (exact.length > 1) return null;

  const contained = rows
    .filter((b) => {
      const model = norm(b.model);
      return model.length >= 2 && t.includes(model);
    })
    .sort((a, b) => norm(b.model).length - norm(a.model).length);
  if (!contained.length) return null;
  const bestLen = norm(contained[0].model).length;
  const best = contained.filter((b) => norm(b.model).length === bestLen);
  const prefs = new Set(best.map((b) => b.pref));
  if (prefs.size === 1) return best[0];
  return null;
}

function norm(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}
