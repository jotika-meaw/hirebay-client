"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import EquipmentCard from "@/components/equipment/EquipmentCard";
import Reveal from "@/components/fx/Reveal";
import Kicker from "@/components/home/Kicker";
import { useFeatured } from "@/lib/data/hooks";
import { useState } from "react";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "all", label: "All", match: null },
  { id: "con", label: "Construction", match: "Construction Equipment" },
  { id: "cam", label: "Photography", match: "Photography Equipment" },
  { id: "veh", label: "Vehicles", match: "Vehicles & Transportation" },
  { id: "ele", label: "Electronics", match: "Electronics" },
  { id: "evt", label: "Events", match: "Event Equipment" },
];

// Featured equipment: animated tabs (layoutId pill) over the 3×2
// useFeatured grid. Tab changes replay a staggered spring rise.
export default function Featured() {
  const reduce = useReducedMotion();
  const [tab, setTab] = useState("all");
  const { data, isPending } = useFeatured();

  const active = TABS.find((t) => t.id === tab) ?? TABS[0];
  const items = (data?.data ?? [])
    .filter((item) => !active.match || item.category === active.match)
    .slice(0, 6);

  const cards = (animate) => (
    <div className="mt-6 grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => (
        animate ? (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22, delay: i * 0.06 }}
          >
            <EquipmentCard item={item} />
          </motion.div>
        ) : (
          <EquipmentCard key={item.id} item={item} />
        )
      ))}
    </div>
  );

  return (
    <section id="featured" className="mx-auto w-full max-w-[1240px] scroll-mt-24 px-7 pt-[120px] max-[640px]:pt-[84px]">
      <Reveal className="flex flex-wrap items-end justify-between gap-5">
        <div className="flex flex-col gap-3.5">
          <Kicker>Featured equipment</Kicker>
          <h2 className="m-0 font-display text-[38px] leading-[0.98] font-extrabold tracking-[-0.045em] sm:text-[56px]">
            Approved, available,
            <br />
            ready this week.
          </h2>
        </div>
        <Link
          href="/equipment"
          className="inline-flex min-h-11 items-center rounded-full border border-input bg-card px-[22px] py-3 text-[15px] font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:bg-muted"
        >
          View all equipment →
        </Link>
      </Reveal>
      <div className="mt-7 overflow-x-auto pb-1">
        <div role="tablist" aria-label="Filter featured equipment" className="inline-flex gap-1 rounded-full border border-border bg-card p-[5px]">
          {TABS.map((t) => {
            const on = t.id === tab;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={on}
                onClick={() => setTab(t.id)}
                className={cn(
                  "relative min-h-[42px] rounded-full px-[18px] text-sm font-semibold transition-colors duration-300",
                  on ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {on && !reduce && (
                  <motion.span
                    layoutId="featured-tab-pill"
                    className="absolute inset-0 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 260, damping: 22 }}
                  />
                )}
                {on && reduce && (
                  <span aria-hidden="true" className="absolute inset-0 rounded-full bg-primary" />
                )}
                <span className="relative">{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      {isPending ? (
        <div className="mt-6 grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading featured equipment">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-[380px] animate-pulse rounded-[24px] bg-muted" />
          ))}
        </div>
      ) : reduce ? (
        cards(false)
      ) : (
        <motion.div key={tab} initial="hidden" animate="show">
          {cards(true)}
        </motion.div>
      )}
    </section>
  );
}
