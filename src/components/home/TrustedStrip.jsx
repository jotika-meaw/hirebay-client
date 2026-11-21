"use client";

import { Camera, Layers, Truck, Zap } from "lucide-react";
import Reveal from "@/components/fx/Reveal";
import { trustedOwners } from "@/lib/data/reviews";

const ICONS = [Layers, Camera, Zap, Zap, Layers, Truck, Truck, Camera];

// "Trusted by" pill + owner marquee (pauses on hover, static under
// reduced motion via the global CSS rule).
export default function TrustedStrip() {
  const owners = [...trustedOwners, ...trustedOwners];
  return (
    <div className="flex flex-col items-center gap-5 pt-[34px]">
      <Reveal>
        <p className="m-0 px-4 text-center text-sm text-muted-foreground">
          Trusted by{" "}
          <span className="mx-1 inline-block rounded-full border border-border bg-card px-2.5 py-0.5 font-bold text-foreground">
            9,600+ renters
          </span>{" "}
          and the 300+ owners who list with us
        </p>
      </Reveal>
      <div className="mqw w-full">
        <div className="mq">
          {owners.map((name, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <span
                key={`${name}-${i}`}
                aria-hidden={i >= trustedOwners.length}
                className="inline-flex items-center gap-2.5 font-display text-[22px] font-bold tracking-[-0.03em] whitespace-nowrap text-subtle"
              >
                <Icon className="size-[22px]" strokeWidth={2} aria-hidden="true" />
                {name}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
