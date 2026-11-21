import Image from "next/image";

// The three photo result cards clipped by the hero panel's bottom edge.
// Side cards are rotated and pushed down; only the centre card shows ≤640px.
export default function HeroCards() {
  return (
    <div aria-label="Example matches" className="mt-[30px] mb-[-28px] grid w-full grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_minmax(0,1fr)] items-end gap-[18px] max-sm:mx-auto max-sm:mb-[-22px] max-sm:max-w-[340px] max-sm:grid-cols-[minmax(0,1fr)]">
      <article className="hcard max-sm:hidden" style={{ transform: "rotate(-4deg) translateY(34px)" }}>
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
          <Image src="/images/cinema.jpg" alt="Cinema camera shoulder rig in use" fill sizes="280px" className="object-cover" style={{ objectPosition: "50% 45%" }} />
        </div>
        <div className="flex items-center justify-between gap-2.5 px-1.5 pt-2.5 pb-1 text-left text-[#111111]">
          <span className="min-w-0">
            <b className="block truncate font-display text-[15px] tracking-[-0.02em]">Cinema Camera Rig</b>
            <span className="text-xs text-[#57534E]">Gulshan · per day</span>
          </span>
          <b className="flex-none font-display text-[15px]">৳6,200</b>
        </div>
      </article>
      <article className="hcard">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
          <Image src="/images/excavator.jpg" alt="Yellow hydraulic excavator on a dirt site" fill sizes="(max-width: 640px) 340px, 420px" className="object-cover" style={{ objectPosition: "40% 55%" }} priority />
          <span className="absolute top-2.5 left-2.5 rounded-full bg-brand px-2.5 py-1 text-xs font-bold text-[#111111]">Best match</span>
          <span className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1.5 rounded-full bg-[#111111] px-2.5 py-1 text-xs font-semibold text-white">
            <span className="size-[7px] rounded-full bg-[#4ADE80]" aria-hidden="true" />2 available
          </span>
        </div>
        <div className="flex items-center justify-between gap-2.5 px-1.5 pt-2.5 pb-1 text-left text-[#111111]">
          <span className="min-w-0">
            <b className="block truncate font-display text-[17px] tracking-[-0.02em]">Hydraulic Excavator 20T</b>
            <span className="text-xs text-[#57534E]">Gazipur, Dhaka · per day</span>
          </span>
          <b className="flex-none font-display text-lg">৳18,500</b>
        </div>
      </article>
      <article className="hcard max-sm:hidden" style={{ transform: "rotate(4deg) translateY(34px)" }}>
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
          <Image src="/images/van.jpg" alt="White cargo van parked by trees" fill sizes="280px" className="object-cover" style={{ objectPosition: "60% 88%" }} />
        </div>
        <div className="flex items-center justify-between gap-2.5 px-1.5 pt-2.5 pb-1 text-left text-[#111111]">
          <span className="min-w-0">
            <b className="block truncate font-display text-[15px] tracking-[-0.02em]">Cargo Van 1.5T</b>
            <span className="text-xs text-[#57534E]">Chattogram · per week</span>
          </span>
          <b className="flex-none font-display text-[15px]">৳32,000</b>
        </div>
      </article>
    </div>
  );
}
