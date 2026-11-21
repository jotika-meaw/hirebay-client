import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { billableUnits, computePricing, wholeDays } from "../src/lib/pricing.js";

describe("pricing (01 decision 1)", () => {
  it("same start and end day counts as 1 day", () => {
    assert.equal(wholeDays("2026-11-21", "2026-11-21"), 1);
  });

  it("counts inclusive calendar days", () => {
    assert.equal(wholeDays("2026-11-21", "2026-11-23"), 3);
  });

  it("daily: units equal days", () => {
    assert.equal(billableUnits(3, "daily"), 3);
  });

  it("weekly: 7 days is 1 unit, 8 days is 2 units", () => {
    assert.equal(billableUnits(7, "weekly"), 1);
    assert.equal(billableUnits(8, "weekly"), 2);
  });

  it("monthly: 30 days is 1 unit, 31 days is 2 units", () => {
    assert.equal(billableUnits(30, "monthly"), 1);
    assert.equal(billableUnits(31, "monthly"), 2);
  });

  it("total is units × price × quantity", () => {
    assert.deepEqual(
      computePricing({
        startDate: "2026-11-21",
        endDate: "2026-11-23",
        price: 18500,
        rentalType: "daily",
        quantity: 1,
      }),
      { days: 3, units: 3, total: 55500 }
    );
    assert.deepEqual(
      computePricing({
        startDate: "2026-12-01",
        endDate: "2026-12-07",
        price: 32000,
        rentalType: "weekly",
        quantity: 2,
      }),
      { days: 7, units: 1, total: 64000 }
    );
  });
});
