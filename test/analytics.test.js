import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { completionRate, monthLabel, monthOverMonth } from "../src/lib/analytics.js";

describe("analytics captions (audit A8)", () => {
  it("labels YYYY-MM months", () => {
    assert.equal(monthLabel("2026-06"), "Jun");
    assert.equal(monthLabel("2026-11"), "Nov");
    assert.equal(monthLabel("nope"), "");
  });

  it("compares the last two months", () => {
    const mom = monthOverMonth(
      [
        { month: "2026-09", revenue: 100 },
        { month: "2026-10", revenue: 150 },
      ],
      "revenue"
    );
    assert.deepEqual(mom, { pct: 50, label: "Sep", current: 150, previous: 100 });
  });

  it("handles falls and zero previous months", () => {
    const down = monthOverMonth(
      [
        { month: "2026-09", revenue: 100 },
        { month: "2026-10", revenue: 75 },
      ],
      "revenue"
    );
    assert.equal(down.pct, -25);
    assert.equal(monthOverMonth([{ month: "2026-10", revenue: 5 }], "revenue"), null);
    assert.equal(
      monthOverMonth(
        [
          { month: "2026-09", revenue: 0 },
          { month: "2026-10", revenue: 5 },
        ],
        "revenue"
      ),
      null
    );
  });

  it("computes completion from completed over total", () => {
    assert.equal(completionRate(5, 9), "56% completion");
    assert.equal(completionRate(9, 9), "100% completion");
    assert.equal(completionRate(0, 0), null);
  });
});
