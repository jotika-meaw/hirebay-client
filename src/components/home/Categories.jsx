"use client";

import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/fx/Reveal";
import Kicker from "@/components/home/Kicker";
import { useCategories } from "@/lib/data/hooks";

// Bento tile meta keyed by exact category (links use the exact string).
const TILES = {
  "Construction Equipment": {
    title: "Construction Equipment",
    hint: "Excavators · loaders · breakers",
    image: "/images/excavator.jpg",
    pos: "40% 55%",
    span: true,
    big: true,
  },
  "Photography Equipment": {
    title: "Photography",
    hint: "Cinema rigs · lenses",
    image: "/images/camera-rig-fx3.jpg",
    pos: "55% 50%",
  },
  "Vehicles & Transportation": {
    title: "Vehicles & Transport",
    hint: "Vans · trucks",
    image: "/images/van.jpg",
    pos: "60% 90%",
  },
  "Agriculture Equipment": {
    title: "Agriculture",
    hint: "Tractors · harvesters",
    image: "/images/tractor.jpg",
    pos: "45% 40%",
  },
  Electronics: {
    title: "Electronics",
    hint: "Drones · generators",
    image: "/images/drone.jpg",
    pos: "30% 50%",
  },
  "Event Equipment": {
    title: "Event Equipment",
    hint: "Sound · stage · lights",
    image: "/images/stage.jpg",
    pos: "50% 50%",
    span: true,
    big: true,
  },
};

const ORDER = [
  "Construction Equipment",
  "Photography Equipment",
  "Vehicles & Transportation",
  "Agriculture Equipment",
  "Electronics",
  "Event Equipment",
];

export default function Categories() {
  const { data, isPending } = useCategories();
  const counts = {};
  for (const row of data?.data ?? []) counts[row.category] = row.count;

  return (
    <section className="mx-auto w-full max-w-[1240px] px-7 pt-[120px] max-[640px]:pt-[84px]">
      <Reveal className="mb-[30px] flex flex-wrap items-end justify-between gap-5">
        <div className="flex flex-col gap-3.5">
          <Kicker>Popular categories</Kicker>
          <h2 className="m-0 font-display text-[38px] leading-[0.98] font-extrabold tracking-[-0.045em] sm:text-[56px]">
            Six aisles of
            <br />
            the yard.
          </h2>
        </div>
        <p className="m-0 max-w-[360px] text-muted-foreground">
          From 20-tonne excavators to pocket drones — every listing is checked by an admin before it goes live.
        </p>
      </Reveal>
      {isPending ? (
        <div className="grid grid-cols-1 gap-3.5 min-[640px]:grid-cols-2 min-[1080px]:grid-cols-4" aria-label="Loading categories">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-60 animate-pulse rounded-[24px] bg-muted" />
          ))}
        </div>
      ) : (
        <div className="grid auto-rows-[240px] grid-cols-1 gap-3.5 min-[640px]:grid-cols-2 min-[1080px]:auto-rows-[280px] min-[1080px]:grid-cols-4 min-[1080px]:grid-rows-[280px_280px]">
          {ORDER.map((category, i) => {
            const tile = TILES[category];
            return (
              <Reveal key={category} delay={i * 0.06} className={tile.span ? "min-[1080px]:col-span-2" : ""}>
                <Link
                  href={`/equipment?category=${encodeURIComponent(category)}`}
                  className="group relative block h-full min-h-[240px] overflow-hidden rounded-[24px] min-[1080px]:min-h-0"
                >
                  <Image
                    src={tile.image}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1080px) 50vw, 25vw"
                    className="object-cover transition-transform duration-1000 ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-[1.07]"
                    style={{ objectPosition: tile.pos }}
                  />
                  <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(0deg,rgba(17,17,17,0.78),transparent_55%)]" />
                  <span className="absolute top-3.5 left-3.5 rounded-full bg-white px-2.5 py-[5px] font-mono text-[11px] font-semibold text-[#111111]">
                    {counts[category] ?? 0} listings
                  </span>
                  <span className="absolute right-5 bottom-[18px] left-5 flex items-end justify-between gap-3 text-white">
                    <span>
                      <b className={`block font-display leading-none tracking-[-0.035em] ${tile.big ? "text-2xl min-[1080px]:text-[36px]" : "text-2xl"}`}>
                        {tile.title}
                      </b>
                      <span className="text-[13px] opacity-85">{tile.hint}</span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="inline-flex size-11 flex-none items-center justify-center rounded-full bg-brand text-[18px] text-[#111111] transition-transform duration-300 group-hover:-rotate-45"
                    >
                      →
                    </span>
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      )}
    </section>
  );
}
