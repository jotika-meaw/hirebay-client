"use client";

import { useState } from "react";
import Link from "next/link";
import Reveal from "@/components/fx/Reveal";
import Kicker from "@/components/home/Kicker";
import { faqs } from "@/lib/data/reviews";
import { cn } from "@/lib/utils";

// FAQ accordion with real <button> triggers. First item open.
export default function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="mx-auto grid w-full max-w-[1240px] scroll-mt-24 grid-cols-1 gap-14 px-7 pt-[120px] min-[1080px]:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] max-[640px]:pt-[84px]">
      <Reveal className="flex flex-col gap-3.5">
        <Kicker>FAQ</Kicker>
        <h2 className="m-0 font-display text-[38px] leading-[0.98] font-extrabold tracking-[-0.045em] sm:text-[56px]">
          Questions before you rent?
        </h2>
        <p className="m-0 text-muted-foreground">Still unsure? Our team replies within an hour.</p>
        <Link
          href="/#contact"
          className="inline-flex min-h-11 items-center self-start rounded-full border border-input bg-card px-[22px] py-3 text-[15px] font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:bg-muted"
        >
          Contact support
        </Link>
      </Reveal>
      <Reveal delay={0.08} className="flex flex-col gap-2.5">
        {faqs.map((faq, i) => {
          const isOpen = open === i;
          return (
            <div key={faq.q} className="rounded-[20px] border border-border bg-card">
              <h3 className="m-0">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  id={`faq-button-${i}`}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex min-h-[68px] w-full items-center justify-between gap-4 px-6 py-[22px] text-left text-[17px] font-semibold"
                >
                  {faq.q}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "flex size-[30px] flex-none items-center justify-center rounded-full text-lg transition-all duration-300",
                      isOpen ? "rotate-45 bg-brand text-[#111111]" : "bg-muted text-foreground"
                    )}
                  >
                    +
                  </span>
                </button>
              </h3>
              <div
                id={`faq-panel-${i}`}
                role="region"
                aria-labelledby={`faq-button-${i}`}
                className={cn(
                  "grid transition-all duration-300 ease-out",
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                )}
              >
                <div className="overflow-hidden">
                  <p className="m-0 px-6 pb-[22px] text-muted-foreground">{faq.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </Reveal>
    </section>
  );
}
