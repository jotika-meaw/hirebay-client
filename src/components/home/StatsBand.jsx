"use client";

import NumberFlow from "@number-flow/react";
import { useReducedMotion } from "motion/react";
import Reveal from "@/components/fx/Reveal";
import { useStats } from "@/lib/data/hooks";

// Black stats band (fixed #111111 in both themes) with a hazard strip.
// Numbers animate from 0 via NumberFlow; reduced motion shows statics.
const CELLS = [
  { key: "listings", label: "Approved listings", suffix: "+", decimals: 0 },
  { key: "cities", label: "Cities covered", suffix: "", decimals: 0 },
  { key: "completedRentals", label: "Completed rentals", suffix: "+", decimals: 0 },
  { key: "avgRating", label: "Average rating", suffix: "", decimals: 1 },
];

export default function StatsBand() {
  const reduce = useReducedMotion();
  const { data, isPending } = useStats();
  const stats = data?.data;

  return (
    <section className="mx-auto w-full max-w-[1240px] px-7 pt-[120px] max-[640px]:pt-[84px]">
      <Reveal className="overflow-hidden rounded-[32px] bg-[#111111] text-[#F5F3EE]">
        <div className="hazard h-3" aria-hidden="true" />
        <div className="grid grid-cols-2 min-[1080px]:grid-cols-4">
          {CELLS.map((cell) => {
            const value = stats?.[cell.key];
            return (
              <div
                key={cell.key}
                className="flex flex-col gap-2 border-[#292524] px-8 py-11 min-[1080px]:border-r min-[1080px]:last:border-r-0"
              >
                {isPending || value === undefined ? (
                  <span className="h-[68px] w-3/4 animate-pulse rounded-2xl bg-[#292524]" aria-label={`Loading ${cell.label}`} />
                ) : reduce ? (
                  <span className="font-display text-[68px] leading-none font-extrabold tracking-[-0.04em] text-brand tabular-nums">
                    {cell.decimals > 0
                      ? value.toFixed(cell.decimals) + cell.suffix
                      : `${Number(value).toLocaleString("en-IN")}${cell.suffix}`}
                  </span>
                ) : (
                  <NumberFlow
                    value={value}
                    suffix={cell.suffix}
                    format={{ useGrouping: true, minimumFractionDigits: cell.decimals, maximumFractionDigits: cell.decimals }}
                    className="font-display text-[68px] leading-none font-extrabold tracking-[-0.04em] text-brand tabular-nums"
                  />
                )}
                <span className="text-[15px] text-[#A8A29E]">{cell.label}</span>
              </div>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}
