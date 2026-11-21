"use client";

import { useState } from "react";

const DOMAIN_MIN = 0;
const DOMAIN_MAX = 100000;
const STEP = 1000;

function clamp(n, lo, hi) {
  return Math.min(hi, Math.max(lo, n));
}

// Dual-thumb price range: two overlapping native range inputs over a
// track with a yellow fill, plus min/max number fields. Values live in
// local draft state (keyed by URL upstream); the parent form applies them.
export default function PriceRange({ min, max }) {
  const [loStr, setLoStr] = useState(min);
  const [hiStr, setHiStr] = useState(max);

  const lo = clamp(Number(loStr) || DOMAIN_MIN, DOMAIN_MIN, DOMAIN_MAX);
  const hi = clamp(Number(hiStr) || DOMAIN_MAX, DOMAIN_MIN, DOMAIN_MAX);
  const loPct = ((Math.min(lo, hi) / DOMAIN_MAX) * 100).toFixed(2);
  const hiPct = ((Math.max(lo, hi) / DOMAIN_MAX) * 100).toFixed(2);

  const webkitThumb =
    "[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-[21px] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow";
  const mozThumb =
    "[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-[21px] [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow";

  return (
    <div className="flex flex-col gap-3">
      <div className="relative h-6" role="group" aria-label="Price range slider">
        <div aria-hidden="true" className="absolute right-0 left-0 top-[10px] h-[5px] rounded-full bg-border" />
        <div
          aria-hidden="true"
          className="absolute top-[10px] h-[5px] rounded-full bg-brand"
          style={{ left: `${loPct}%`, right: `${100 - Number(hiPct)}%` }}
        />
        <input
          type="range"
          min={DOMAIN_MIN}
          max={DOMAIN_MAX}
          step={STEP}
          value={Math.min(lo, hi)}
          onChange={(e) => setLoStr(e.target.value)}
          aria-label="Minimum price"
          className={`absolute inset-0 h-6 w-full appearance-none bg-transparent pointer-events-none ${webkitThumb} [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-brand ${mozThumb} [&::-moz-range-thumb]:border-[3px] [&::-moz-range-thumb]:border-brand`}
        />
        <input
          type="range"
          min={DOMAIN_MIN}
          max={DOMAIN_MAX}
          step={STEP}
          value={Math.max(lo, hi)}
          onChange={(e) => setHiStr(e.target.value)}
          aria-label="Maximum price"
          className={`absolute inset-0 h-6 w-full appearance-none bg-transparent pointer-events-none ${webkitThumb} [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-[#111111] ${mozThumb} [&::-moz-range-thumb]:border-[3px] [&::-moz-range-thumb]:border-[#111111]`}
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          name="minPrice"
          aria-label="Minimum price"
          value={loStr}
          min={0}
          onChange={(e) => setLoStr(e.target.value)}
          placeholder="0"
          className="min-h-11 w-full min-w-0 rounded-xl border border-input bg-card px-3.5 text-[15px] outline-0 focus-visible:border-foreground"
        />
        <span aria-hidden="true" className="text-subtle">–</span>
        <input
          type="number"
          name="maxPrice"
          aria-label="Maximum price"
          value={hiStr}
          min={0}
          onChange={(e) => setHiStr(e.target.value)}
          placeholder="Any"
          className="min-h-11 w-full min-w-0 rounded-xl border border-input bg-card px-3.5 text-[15px] outline-0 focus-visible:border-foreground"
        />
      </div>
    </div>
  );
}
