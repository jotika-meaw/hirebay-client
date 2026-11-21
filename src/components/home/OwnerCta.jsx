"use client";

import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/fx/Reveal";
import { authClient } from "@/lib/auth-client";

// Yellow owner CTA with the generator photo and a floating earnings card.
// "List your equipment" routes owners to the add form, everyone else to
// register with the owner role preselected (01 decision 9).
export default function OwnerCta() {
  const { data: session } = authClient.useSession();
  const listHref =
    session?.user?.role === "owner" ? "/dashboard/owner/add" : "/register?role=owner";

  return (
    <section className="mx-auto w-full max-w-[1240px] px-7 pt-[120px] pb-[120px] max-[640px]:pt-[84px] max-[640px]:pb-[84px]">
      <Reveal className="grid grid-cols-1 overflow-hidden rounded-[36px] bg-brand text-[#111111] shadow-[inset_0_0_0_2px_#111111] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="flex flex-col justify-center gap-5 p-8 min-[640px]:p-14">
          <span className="inline-flex items-center gap-2 font-mono text-xs font-medium tracking-[0.1em] uppercase">
            <i aria-hidden="true" className="h-2.5 w-2.5 rounded-[2px] bg-[#111111]" />
            For equipment owners
          </span>
          <h2 className="m-0 font-display text-[40px] leading-[0.98] font-extrabold tracking-[-0.045em] min-[640px]:text-[62px]">
            Idle machines don’t pay the bills. Listings do.
          </h2>
          <p className="m-0 max-w-[480px] text-lg">
            List in minutes, get approved, and track every booking and monthly earning from your owner dashboard.
          </p>
          <div className="flex flex-wrap gap-2.5">
            <Link
              href={listHref}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#111111] px-[22px] py-3 text-[15px] font-semibold text-white transition-all duration-200 hover:-translate-y-0.5"
            >
              List your equipment
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-[22px] py-3 text-[15px] font-semibold text-[#111111] shadow-[inset_0_0_0_1px_#D6D3D1] transition-all duration-200 hover:-translate-y-0.5"
            >
              See owner dashboard
            </Link>
          </div>
        </div>
        <div className="relative min-h-[280px] lg:min-h-[420px]">
          <Image
            src="/images/generator.jpg"
            alt="Mobile generator ready for hire"
            fill
            sizes="(max-width: 1080px) 100vw, 45vw"
            className="object-cover"
            style={{ objectPosition: "50% 55%" }}
          />
          <div className="hazard absolute top-0 bottom-0 left-0 w-[14px]" aria-hidden="true" />
          <div className="float absolute right-6 bottom-6 rounded-[24px] border border-border bg-card p-4 text-[#111111] shadow-[0_24px_40px_-20px_rgba(17,17,17,0.5)]">
            <span className="font-mono text-[11px] text-[#78716C]">NOVEMBER EARNINGS</span>
            <b className="block font-display text-[30px] tracking-[-0.04em]">৳1,42,000</b>
            <span className="text-xs font-semibold text-[#15803D]">+18 rentals completed</span>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
