import assert from "node:assert/strict";
import test from "node:test";
import { rentalDays } from "../reservations/duration.ts";
import { RT819_ITEMS } from "../reservations/items.ts";
import {
  DEC2026_PROMO,
  applyDecemberPromo,
  discountAmount,
  gradeFromBikePref,
  pickupEligible,
  popupActive,
  quoteRental,
} from "./dec2026.ts";

const PRICES = RT819_ITEMS.map((it) => ({ code: it.code, unit_price: it.unit_price }));

/**
 * Worked example from the December promotion:
 * Itami, P-4, pick-up 2026-12-10 10:00, return 2026-12-12 10:00, with a tail box.
 * 48 hours = 2 days. Bike 1,030 + 685 = 1,715. Insurance 195 + 105 = 300.
 * Eligible 2,015 × 12% = 241.8 → HK$242. Tail box 90 + 20 = 110, not discounted.
 */
function p4December() {
  const days = rentalDays({
    pickup_date: "2026-12-10",
    pickup_time: "10:00",
    return_date: "2026-12-12",
    return_time: "10:00",
  });
  return quoteRental({
    pickupDate: "2026-12-10",
    days,
    grade: gradeFromBikePref("Itami P-4"),
    prices: PRICES,
    topcase: true,
  });
}

test("P-4 December pick-up with a tail box: 12% off bike + insurance only", () => {
  const q = p4December();
  assert.equal(q.ok, true);
  assert.equal(q.applies, true);
  assert.equal(q.days, 2);
  assert.equal(q.grade, 4);
  assert.equal(q.bike, 1715);
  assert.equal(q.insurance, 300);
  assert.equal(q.eligible, 2015);
  assert.equal(q.discount, 242);
  assert.equal(q.discountedEligible, 1773);
  assert.deepEqual(q.addons, [{ key: "topcase", amount: 110 }]);
  assert.equal(q.equipment, 110);
  assert.equal(q.totalBefore, 2125);
  assert.equal(q.totalAfter, 1883);
});

test("the same trip outside December has no discount", () => {
  for (const pickup of ["2026-11-10", "2027-01-10"]) {
    const days = rentalDays({
      pickup_date: pickup,
      pickup_time: "10:00",
      return_date: pickup === "2026-11-10" ? "2026-11-12" : "2027-01-12",
      return_time: "10:00",
    });
    const q = quoteRental({
      pickupDate: pickup,
      days,
      grade: 4,
      prices: PRICES,
      topcase: true,
    });
    assert.equal(q.applies, false, pickup);
    assert.equal(q.discount, 0, pickup);
    assert.equal(q.eligible, 2015, pickup);
    assert.equal(q.equipment, 110, pickup);
    assert.equal(q.totalBefore, 2125, pickup);
    assert.equal(q.totalAfter, 2125, pickup);
  }
});

test("pick-up eligibility is inclusive of 1 Dec and 31 Dec only", () => {
  assert.equal(pickupEligible("2026-11-30"), false);
  assert.equal(pickupEligible("2026-12-01"), true);
  assert.equal(pickupEligible("2026-12-31"), true);
  assert.equal(pickupEligible("2027-01-01"), false);
  assert.equal(pickupEligible(""), false);
  assert.equal(pickupEligible("2026-12-10T10:00"), false);
  const edges = ["2026-12-01", "2026-12-31"].map((pickupDate) =>
    quoteRental({ pickupDate, days: 1, grade: 1, prices: PRICES }),
  );
  for (const q of edges) {
    assert.equal(q.applies, true);
    assert.equal(q.eligible, 295 + 85);
    assert.equal(q.discount, 46); // 380 × 12% = 45.6 → 46
  }
});

test("helmets, cases and MamoRide stay outside the discount base", () => {
  const q = quoteRental({
    pickupDate: "2026-12-15",
    days: 2,
    grade: 4,
    prices: PRICES,
    helmets: 1,
    topcase: true,
    mamoride: true,
  });
  // MamoRide P4P5: 160 + 65 = 225. Helmet: 60 + 10 = 70. Tail box: 110.
  assert.equal(q.eligible, 2015);
  assert.equal(q.discount, 242);
  assert.equal(q.equipment, 225 + 70 + 110);
  assert.equal(q.totalAfter, 2015 - 242 + 225 + 70 + 110);
  assert.ok(q.addons.every((a) => a.key !== "cardo"));
});

test("discount rounding: nearest whole HKD, halves away from zero", () => {
  assert.equal(discountAmount(2015), 242);
  assert.equal(discountAmount(380), 46);
  assert.equal(discountAmount(10), 1); // 1.2 → 1
  assert.equal(discountAmount(12.5), 2); // 1.5 → 2
  assert.equal(discountAmount(0), 0);
  assert.equal(discountAmount(-100), 0);
});

test("invoice credit is one negative line and is not applied twice", () => {
  const lines = [
    { description: "bike 1", amount: 1030, group: "bike" },
    { description: "bike 2", amount: 685, group: "bike" },
    { description: "ins 1", amount: 195, group: "insurance" },
    { description: "ins 2", amount: 105, group: "insurance" },
    { description: "top case", amount: 110, group: "case" },
  ];
  const groupOf = (it: (typeof lines)[number]) => it.group;
  const once = applyDecemberPromo(lines, "2026-12-10", groupOf);
  const credit = once[once.length - 1];
  assert.equal(credit.description, DEC2026_PROMO.invoiceDescription);
  assert.equal(credit.amount, -242);
  assert.equal(credit.unit_price, -242);
  assert.equal(credit.qty, 1);
  const twice = applyDecemberPromo(once, "2026-12-10", (it) =>
    "group" in it ? it.group : undefined,
  );
  assert.equal(twice.length, once.length);
  assert.equal(applyDecemberPromo(lines, "2026-11-10", groupOf).length, lines.length);
  assert.equal(
    applyDecemberPromo([{ description: "placeholder", amount: 0, group: "other" }], "2026-12-10", (it) => it.group)
      .length,
    1,
  );
});

test("class is read from the bike preference and not from a longer number", () => {
  assert.equal(gradeFromBikePref("ホンダ NC750X (2022) / P-4"), 4);
  assert.equal(gradeFromBikePref("P4クラス"), 4);
  assert.equal(gradeFromBikePref("CB400"), null);
  assert.equal(gradeFromBikePref("P12"), null);
});

test("homepage popup is open from deploy until 2027-01-01 00:00 HKT", () => {
  assert.equal(popupActive(new Date("2026-11-16T15:59:59.000Z")), false);
  assert.equal(popupActive(new Date("2026-11-16T16:00:00.000Z")), true);
  assert.equal(popupActive(new Date("2026-12-31T15:59:59.000Z")), true);
  assert.equal(popupActive(new Date("2026-12-31T16:00:00.000Z")), false);
});
