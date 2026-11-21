"use client";

import { CalendarDays, Clock, Heart, Tag } from "lucide-react";
import Reveal from "@/components/fx/Reveal";
import Kicker from "@/components/home/Kicker";

// November 2026 mini calendar: booked days hatched + struck, the 20th
// ink, the 21st–23rd yellow. Replicates the design board cell algorithm.
function AvailabilityCalendar() {
  const cells = [];
  for (let c = 0; c < 35; c++) {
    const day = c - 5;
    if (day < 1 || day > 30) {
      cells.push({ t: "", cls: "bg-transparent" });
      continue;
    }
    let cls = "bg-background text-foreground";
    if ([9, 10, 11, 16, 17].includes(day)) {
      cls = "bg-[repeating-linear-gradient(-45deg,#E7E5E4_0_4px,#FFFFFF_4px_8px)] text-subtle line-through";
    }
    if (day === 20) cls = "bg-primary font-bold text-primary-foreground";
    if (day >= 21 && day <= 23) {
      cls = "bg-brand font-bold text-brand-foreground shadow-[inset_0_0_0_1.5px_#111111]";
    }
    cells.push({ t: String(day), cls });
  }
  return (
    <div>
      <div className="mb-2.5 flex justify-between text-[13px] font-semibold">
        <span>November 2026</span>
        <span className="text-subtle">21–23 Nov · ৳55,500</span>
      </div>
      <div className="grid grid-cols-7 gap-[5px]">
        {cells.map((d, i) => (
          <span
            key={i}
            className={`flex aspect-square items-center justify-center rounded-lg text-xs font-medium ${d.cls}`}
          >
            {d.t}
          </span>
        ))}
      </div>
    </div>
  );
}

const OWNER_ROWS = [
  { initials: "KH", name: "Karim Heavy Machinery", bg: "#111111", status: "Approved", badge: "bg-success-bg text-success" },
  { initials: "LB", name: "LensBox BD", bg: "#C2410C", status: "Approved", badge: "bg-success-bg text-success" },
  { initials: "PH", name: "PowerHub Comilla", bg: "#57534E", status: "Pending", badge: "bg-warning-bg text-warning" },
];

const PINS = [
  { name: "Dhaka", left: "48%", top: "52%", labelLeft: "calc(48% + 16px)", labelTop: "calc(52% - 7px)" },
  { name: "Gazipur", left: "52%", top: "30%", labelLeft: "calc(52% + 16px)", labelTop: "calc(30% - 7px)" },
  { name: "Chattogram", left: "78%", top: "80%", labelLeft: "calc(78% - 92px)", labelTop: "calc(80% - 7px)" },
  { name: "Rajshahi", left: "14%", top: "28%", labelLeft: "calc(14% + 16px)", labelTop: "calc(28% - 7px)" },
  { name: "Sylhet", left: "82%", top: "20%", labelLeft: "calc(82% - 62px)", labelTop: "calc(20% - 7px)" },
  { name: "Khulna", left: "24%", top: "78%", labelLeft: "calc(24% + 16px)", labelTop: "calc(78% - 7px)" },
];

const BENEFITS = [
  { t: "Affordable rates", d: "A fraction of buying, billed per day, week or month.", Icon: Tag },
  { t: "Flexible periods", d: "A weekend shoot or a six-month site.", Icon: CalendarDays },
  { t: "Saved favorites", d: "Shortlist machines and compare later.", Icon: Heart },
  { t: "Auto-completion", d: "Rentals close themselves after the end date.", Icon: Clock },
];

export default function WhyUs() {
  return (
    <section id="about" className="mx-auto w-full max-w-[1240px] scroll-mt-24 px-7 pt-[120px] max-[640px]:pt-[84px]">
      <Reveal className="mb-8 flex flex-col gap-3.5">
        <Kicker>Why choose Hirebay</Kicker>
        <h2 className="m-0 font-display text-[38px] leading-[0.98] font-extrabold tracking-[-0.045em] sm:text-[56px]">
          Owning is expensive.
          <br />
          Renting shouldn’t be stressful.
        </h2>
      </Reveal>
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        <Reveal className="sm:col-span-2">
          <article className="grid h-full grid-cols-1 items-center gap-6 rounded-[24px] border border-border bg-card p-[26px] min-[640px]:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div className="flex flex-col gap-2.5">
              <span className="font-mono text-[11px] text-subtle">01 · LIVE AVAILABILITY</span>
              <h3 className="m-0 font-display text-[28px] leading-[1.05] tracking-[-0.035em]">Dates are checked before you pay.</h3>
              <p className="m-0 text-[15px] text-muted-foreground">Paid bookings block their days, so double-booking can’t happen.</p>
            </div>
            <div className="rounded-[18px] bg-muted p-4">
              <AvailabilityCalendar />
            </div>
          </article>
        </Reveal>
        <Reveal delay={0.06}>
          <article className="flex h-full flex-col gap-4 rounded-[24px] border border-[#111111] bg-[#111111] p-[26px] text-[#F5F3EE]">
            <span className="font-mono text-[11px] text-[#A8A29E]">02 · SECURE PAYMENTS</span>
            <h3 className="m-0 font-display text-[28px] leading-[1.05] tracking-[-0.035em]">Stripe Checkout. Zero card storage.</h3>
            <div className="mt-auto flex flex-col gap-2 rounded-2xl border border-[#292524] bg-[#1C1917] p-3.5 text-[13px]">
              <div className="flex justify-between"><span className="text-[#A8A29E]">Card</span><span className="font-mono">•••• 4242</span></div>
              <div className="flex justify-between"><span className="text-[#A8A29E]">Transaction</span><span className="font-mono">pi_3QxF…8kLm</span></div>
              <div className="flex items-center justify-between border-t border-[#292524] pt-2">
                <b className="font-display text-[22px] text-brand">৳55,500</b>
                <span className="rounded-full bg-[rgba(74,222,128,0.12)] px-2.5 py-[3px] text-xs font-bold text-[#4ADE80]">Paid</span>
              </div>
            </div>
          </article>
        </Reveal>
        <Reveal>
          <article className="flex h-full flex-col gap-3.5 rounded-[24px] border border-border bg-card p-[26px]">
            <span className="font-mono text-[11px] text-subtle">03 · VERIFIED OWNERS</span>
            <h3 className="m-0 font-display text-[26px] leading-[1.05] tracking-[-0.035em]">Every listing is admin-approved.</h3>
            <div className="mt-auto flex flex-col gap-2">
              {OWNER_ROWS.map((row) => (
                <div key={row.name} className="flex items-center gap-2.5 rounded-[14px] bg-muted p-2 pr-2.5">
                  <span
                    aria-hidden="true"
                    className="flex size-8 flex-none items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: row.bg }}
                  >
                    {row.initials}
                  </span>
                  <span className="flex-1 text-[13px] font-semibold">{row.name}</span>
                  <span className={`rounded-full px-[9px] py-[3px] text-[11px] font-bold ${row.badge}`}>{row.status}</span>
                </div>
              ))}
            </div>
          </article>
        </Reveal>
        <Reveal delay={0.06}>
          <article className="flex h-full flex-col gap-3 rounded-[24px] border border-border bg-card p-[26px]">
            <span className="font-mono text-[11px] text-subtle">04 · OWNER ANALYTICS</span>
            <h3 className="m-0 font-display text-[26px] leading-[1.05] tracking-[-0.035em]">Earnings, month by month.</h3>
            <div className="mt-auto">
              <b className="font-display text-[34px] tracking-[-0.04em]">৳4.2L</b>{" "}
              <span className="text-[13px] font-semibold text-success">+27% this month</span>
            </div>
            <svg viewBox="0 0 300 110" className="h-[110px] w-full text-foreground" aria-hidden="true">
              <defs>
                <linearGradient id="why-spark" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#FFC727" stopOpacity=".7" />
                  <stop offset="1" stopColor="#FFC727" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0 92 L50 80 L100 84 L150 60 L200 52 L250 34 L300 14 L300 110 L0 110Z" fill="url(#why-spark)" />
              <path d="M0 92 L50 80 L100 84 L150 60 L200 52 L250 34 L300 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
              <circle cx="294" cy="16" r="5" fill="#FFC727" stroke="currentColor" strokeWidth="2" />
            </svg>
          </article>
        </Reveal>
        <Reveal delay={0.12}>
          <article className="flex h-full flex-col gap-3 rounded-[24px] border border-[#111111] bg-brand p-[26px] text-[#111111] shadow-[inset_0_0_0_1px_#111111]">
            <span className="font-mono text-[11px]">05 · DELIVERED TO SITE</span>
            <h3 className="m-0 font-display text-[26px] leading-[1.05] tracking-[-0.035em]">38 cities, Dhaka to Rajshahi.</h3>
            <div
              className="relative mt-auto h-[130px] rounded-[14px]"
              style={{
                backgroundColor: "rgba(17,17,17,.06)",
                backgroundImage: "radial-gradient(rgba(17,17,17,.35) 1.2px, transparent 1.2px)",
                backgroundSize: "12px 12px",
              }}
            >
              {PINS.map((pin) => (
                <span key={pin.name}>
                  <span className="pin" style={{ left: pin.left, top: pin.top }} aria-hidden="true" />
                  <span className="absolute font-mono text-[10px] font-semibold" style={{ left: pin.labelLeft, top: pin.labelTop }}>
                    {pin.name}
                  </span>
                </span>
              ))}
            </div>
          </article>
        </Reveal>
      </div>
      <div className="mt-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {BENEFITS.map((benefit, i) => (
          <Reveal key={benefit.t} delay={i * 0.06}>
            <div className="flex h-full items-start gap-3.5 rounded-[24px] border border-border bg-card px-5 py-[18px]">
              <span aria-hidden="true" className="flex size-10 flex-none items-center justify-center rounded-xl bg-muted">
                <benefit.Icon className="size-5" strokeWidth={2} />
              </span>
              <span>
                <b className="block text-[15px]">{benefit.t}</b>
                <span className="text-[13px] text-muted-foreground">{benefit.d}</span>
              </span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
