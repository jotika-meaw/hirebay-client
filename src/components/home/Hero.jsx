"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUp, CornerDownRight, Plus, ShoppingBasket } from "lucide-react";
import FluidGradient from "@/components/fx/FluidGradient";
import TextGenerate from "@/components/fx/TextGenerate";
import HeroCards from "@/components/home/HeroCards";
import HeroNavbar from "@/components/layout/HeroNavbar";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const SUB =
  "Tell Hirebay what you need and where. We match you with verified owners, check the dates and settle the price before you pay with Stripe.";

const PLACEHOLDERS = {
  rent: [
    "Excavator in Gazipur, 3 days, under ৳20k…",
    "Cinema rig for a Friday shoot in Gulshan…",
    "Cargo van for a week in Chattogram…",
    "PA system for a 600-guest wedding…",
  ],
  list: [
    "List my 60kVA generator in Comilla…",
    "List a Sony FX3 kit, ৳4,100 a day…",
    "List a tractor for harvest season…",
    "List stage truss + 8 moving heads…",
  ],
};

const TRY_QUERY = {
  rent: "hydraulic excavator in Gazipur for 3 days",
  list: "60kVA generator in Comilla",
};

const EASE = [0.2, 0.7, 0.2, 1];

function Rise({ delay, className, children }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export default function Hero() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const { data: session } = authClient.useSession();
  const [mode, setMode] = useState("rent");
  const [query, setQuery] = useState("");
  const [pi, setPi] = useState(0);

  const placeholders = PLACEHOLDERS[mode];
  const modeLabel = mode === "rent" ? "Describe the equipment you need" : "Describe the equipment you want to list";

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setPi((v) => (v + 1) % placeholders.length), 3000);
    return () => clearInterval(t);
  }, [reduce, mode, placeholders.length]);

  function pickMode(next) {
    setMode(next);
    setPi(0);
  }

  function submit(text) {
    if (mode === "rent") {
      router.push(`/equipment?search=${encodeURIComponent(text)}`);
      return;
    }
    // 01 decision 9: owners go to the add form, everyone else registers.
    if (session?.user?.role === "owner") {
      router.push(`/dashboard/owner/add?name=${encodeURIComponent(text)}`);
    } else {
      router.push("/register?role=owner");
    }
  }

  function onSubmit(event) {
    event.preventDefault();
    submit(query.trim() || TRY_QUERY[mode]);
  }

  return (
    <section className="px-3 pt-3">
      <div className="relative flex min-h-[640px] flex-col overflow-hidden rounded-[24px] bg-[#111111] text-white md:min-h-[780px] md:rounded-[32px]">
        <FluidGradient />
        <div className="relative">
          <HeroNavbar />
        </div>
        <div className="relative mx-auto flex w-full max-w-[1240px] flex-1 flex-col items-center justify-center gap-[22px] px-7 pt-[30px] pb-0 text-center">
          <motion.h1
            className="m-0 max-w-[960px] font-display text-[46px] leading-[0.95] font-extrabold tracking-[-0.05em] sm:text-6xl lg:text-[82px]"
            initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          >
            Rent the machine.
            <br />
            Skip the <span className="text-brand">mortgage.</span>
          </motion.h1>
          <p className="m-0 max-w-[560px] text-[18px] text-white/72">
            <TextGenerate text={SUB} baseDelay={0.3} />
          </p>
          <Rise delay={0.6}>
            <div role="tablist" aria-label="What do you want to do?" className="inline-flex gap-0.5 rounded-full border border-white/14 bg-white/8 p-1 backdrop-blur-[10px]">
              {[
                { id: "rent", label: "Rent gear", Icon: ShoppingBasket },
                { id: "list", label: "List gear", Icon: Plus },
              ].map(({ id, label, Icon }) => {
                const on = mode === id;
                return (
                  <button
                    key={id}
                    role="tab"
                    aria-selected={on}
                    onClick={() => pickMode(id)}
                    className={cn(
                      "inline-flex min-h-11 items-center justify-center gap-[7px] rounded-full border-0 px-4 text-sm font-semibold transition-colors duration-300",
                      on ? "bg-white text-[#111111]" : "bg-transparent text-white/75 hover:text-white"
                    )}
                  >
                    <Icon className="size-[15px]" strokeWidth={2.2} aria-hidden="true" />
                    {label}
                  </button>
                );
              })}
            </div>
          </Rise>
          <Rise delay={0.75} className="w-full max-w-[600px]">
            <form
              role="search"
              onSubmit={onSubmit}
              className="relative flex w-full items-center gap-2.5 rounded-[18px] border border-white/16 bg-[rgba(17,17,17,0.62)] py-2 pr-2 pl-5 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-[14px] focus-within:border-[rgba(255,199,39,0.7)] focus-within:shadow-[0_0_0_4px_rgba(255,199,39,0.2),0_30px_60px_-30px_rgba(0,0,0,0.8)]"
            >
              <label className="relative flex min-w-0 flex-1 items-center">
                <span className="absolute h-px w-px overflow-hidden">{modeLabel}</span>
                <input
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="min-h-11 w-full border-0 bg-transparent text-base text-white outline-0 placeholder-transparent"
                  placeholder={placeholders[0]}
                />
                <span aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center overflow-hidden text-left text-base text-white/50">
                  {!query && (
                    reduce ? (
                      <span className="truncate">{placeholders[0]}</span>
                    ) : (
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={`${mode}-${pi}`}
                          className="truncate"
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -12 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                          {placeholders[pi]}
                        </motion.span>
                      </AnimatePresence>
                    )
                  )}
                </span>
              </label>
              <button
                type="submit"
                aria-label={modeLabel}
                className="inline-flex size-11 flex-none items-center justify-center rounded-full border-0 bg-brand text-[#111111] shadow-[0_0_0_4px_rgba(255,199,39,0.18)] transition-transform duration-200 hover:-translate-y-0.5"
              >
                <ArrowUp className="size-[18px]" strokeWidth={2.6} aria-hidden="true" />
              </button>
            </form>
          </Rise>
          <Rise delay={0.9}>
            <button
              type="button"
              onClick={() => submit(TRY_QUERY[mode])}
              className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-white/88 transition-colors hover:text-white"
            >
              <CornerDownRight className="size-[15px]" strokeWidth={2.2} aria-hidden="true" />
              {mode === "rent" ? "Try: hydraulic excavator in Gazipur for 3 days" : "Try: list a 60kVA generator in Comilla"}
            </button>
          </Rise>
          <Rise delay={1} className="w-full max-w-[980px]">
            <HeroCards />
          </Rise>
        </div>
      </div>
    </section>
  );
}
