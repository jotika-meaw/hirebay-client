"use client";

import Image from "next/image";
import Reveal from "@/components/fx/Reveal";
import Kicker from "@/components/home/Kicker";
import { howItWorks } from "@/lib/data/reviews";
import { cn } from "@/lib/utils";

const PHOTOS = [
  { src: "/images/excavator.jpg", pos: "40% 55%" },
  { src: "/images/cinema.jpg", pos: "50% 45%" },
  { src: "/images/camera-rig-fx3.jpg", pos: "55% 50%" },
  { src: "/images/van.jpg", pos: "60% 88%" },
];

const CIRCLES = [
  "bg-brand text-[#111111]",
  "bg-white text-[#111111]",
  "bg-white text-[#111111]",
  "bg-[#111111] text-white",
];

// 4-step dashed timeline. Photos 4:3 per step.
export default function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto w-full max-w-[1240px] scroll-mt-24 px-7 pt-[120px] max-[640px]:pt-[84px]">
      <Reveal className="mb-9 flex flex-wrap items-end justify-between gap-5">
        <div className="flex flex-col gap-3.5">
          <Kicker>How it works</Kicker>
          <h2 className="m-0 font-display text-[38px] leading-[0.98] font-extrabold tracking-[-0.045em] sm:text-[56px]">
            From search to site
            <br />
            in four steps.
          </h2>
        </div>
        <p className="m-0 max-w-[380px] text-muted-foreground">
          Price, availability and payment are settled before anything leaves the yard. Unpaid holds expire after 30 minutes.
        </p>
      </Reveal>
      <div className="relative grid grid-cols-1 gap-[18px] min-[640px]:grid-cols-2 min-[1080px]:grid-cols-4">
        <span aria-hidden="true" className="absolute top-[30px] right-[30px] left-[30px] hidden border-t-2 border-dashed border-input min-[1080px]:block" />
        {howItWorks.map((step, i) => (
          <Reveal key={step.no} delay={i * 0.06} className="relative flex flex-col gap-3.5">
            <span
              aria-hidden="true"
              className={cn(
                "flex size-[60px] items-center justify-center rounded-full font-display text-xl font-extrabold shadow-[inset_0_0_0_2px_#111111]",
                CIRCLES[i]
              )}
            >
              {step.no}
            </span>
            <div className="flex flex-1 flex-col gap-3 rounded-[24px] border border-border bg-card p-2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image
                  src={PHOTOS[i].src}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1080px) 50vw, 25vw"
                  className="object-cover"
                  style={{ objectPosition: PHOTOS[i].pos }}
                />
              </div>
              <div className="px-2 pb-2.5">
                <h3 className="m-0 mb-1.5 font-display text-[21px] tracking-[-0.03em]">{step.title}</h3>
                <p className="m-0 text-sm text-muted-foreground">{step.text}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
