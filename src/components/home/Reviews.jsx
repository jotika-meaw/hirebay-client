"use client";

import Image from "next/image";
import Reveal from "@/components/fx/Reveal";
import Kicker from "@/components/home/Kicker";
import { ratingSummary, reviews } from "@/lib/data/reviews";
import { cn } from "@/lib/utils";

// Reviewer avatars reuse the equipment photos mapped in the design board.
const AVATARS = [
  { src: "/images/speaker.jpg", pos: "50% 40%" },
  { src: "/images/excavator.jpg", pos: "40% 55%" },
  { src: "/images/cinema.jpg", pos: "50% 45%" },
  { src: "/images/tractor.jpg", pos: "45% 40%" },
  { src: "/images/drone.jpg", pos: "30% 50%" },
  { src: "/images/van.jpg", pos: "60% 88%" },
];

function Stars({ rating }) {
  const full = "★★★★★".slice(0, rating);
  const empty = "☆☆☆☆☆".slice(0, 5 - rating);
  return (
    <span role="img" aria-label={`Rated ${rating} out of 5`} className="tracking-[2px]">
      {full}
      {empty}
    </span>
  );
}

export default function Reviews() {
  return (
    <section className="mx-auto w-full max-w-[1240px] px-7 pt-[120px] max-[640px]:pt-[84px]">
      <Reveal className="mb-[30px] flex flex-wrap items-end justify-between gap-5">
        <div className="flex flex-col gap-3.5">
          <Kicker>Customer reviews</Kicker>
          <h2 className="m-0 font-display text-[38px] leading-[0.98] font-extrabold tracking-[-0.045em] sm:text-[56px]">
            Rented, used, returned.
          </h2>
        </div>
        <div className="flex items-center gap-3.5 rounded-[24px] border border-border bg-card px-[18px] py-3">
          <b className="font-display text-[40px] leading-none tracking-[-0.05em]">{ratingSummary.avg}</b>
          <span>
            <span className="tracking-[2px] text-[#F59E0B]" aria-hidden="true">★★★★★</span>
            <span className="block text-[13px] text-muted-foreground">
              {ratingSummary.count} {ratingSummary.label}
            </span>
          </span>
        </div>
      </Reveal>
      <div className="columns-1 gap-3.5 sm:columns-2 lg:columns-3">
        {reviews.map((review, i) => {
          const featured = i === 1;
          const dark = i === 3;
          const avatar = AVATARS[i % AVATARS.length];
          return (
            <Reveal key={review.name} className="mb-3.5 break-inside-avoid">
              <figure
                className={cn(
                  "m-0 flex flex-col gap-3.5 rounded-[24px] border border-border bg-card p-[22px]",
                  featured && "border-[#111111] bg-brand text-[#111111] shadow-[inset_0_0_0_1px_#111111]",
                  dark && "border-[#111111] bg-[#111111] text-[#F5F3EE]"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className={featured ? "text-[#111111]" : "text-[#F59E0B]"}>
                    <Stars rating={review.rating} />
                  </span>
                  <span className="font-mono text-[11px] opacity-70">Rented {review.item}</span>
                </div>
                <blockquote className={cn("m-0 leading-[1.5]", featured ? "text-[22px]" : "text-base")}>
                  “{review.q}”
                </blockquote>
                <figcaption className="flex items-center gap-2.5">
                  <span className="relative block size-10 flex-none overflow-hidden rounded-full">
                    <Image
                      src={avatar.src}
                      alt=""
                      fill
                      sizes="40px"
                      className="object-cover"
                      style={{ objectPosition: avatar.pos }}
                    />
                  </span>
                  <span>
                    <b className="block text-sm">{review.name}</b>
                    <span className="text-[13px] opacity-75">{review.role}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
