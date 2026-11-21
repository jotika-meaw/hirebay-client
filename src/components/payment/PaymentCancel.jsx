"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useCheckout, useMyBookings } from "@/lib/data/hooks";
import { formatBDT } from "@/lib/money";

function shortRange(startISO, endISO) {
  const s = new Date(startISO);
  const e = new Date(endISO);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  if (s.getUTCMonth() === e.getUTCMonth()) return `${s.getUTCDate()}–${e.getUTCDate()} ${months[s.getUTCMonth()]}`;
  return `${s.getUTCDate()} ${months[s.getUTCMonth()]} – ${e.getUTCDate()} ${months[e.getUTCMonth()]}`;
}

// /payment/cancel?booking=<id>: "Pay now" retry (mock goes back to the
// demo success page) and "Change dates" back to the equipment page.
export default function PaymentCancel() {
  const router = useRouter();
  const sp = useSearchParams();
  const bookingId = sp.get("booking");
  const { data, isPending } = useMyBookings();
  const checkout = useCheckout();

  const booking = bookingId ? (data?.items ?? []).find((b) => b.id === bookingId) ?? null : null;

  // Minutes left on the hold, snapshotted on first render (pure render rule).
  const [minsLeft] = useState(() =>
    booking?.holdExpiresAt
      ? Math.max(1, Math.ceil((new Date(booking.holdExpiresAt) - Date.now()) / 60000))
      : null
  );

  function payNow() {
    if (!bookingId) return;
    checkout.mutate(
      { bookingId },
      {
        onSuccess: (res) => router.push(res.data.url),
        onError: (err) => toast.error(err?.message || "Could not start checkout"),
      }
    );
  }

  if (isPending && bookingId) {
    return (
      <div className="mx-auto w-full max-w-[620px] animate-pulse rounded-[32px] border border-border bg-card px-6 py-10 text-center sm:px-10" aria-label="Loading booking">
        <div className="mx-auto size-[76px] rounded-full bg-muted" />
        <div className="mx-auto mt-4 h-8 w-2/3 rounded-xl bg-muted" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="mx-auto flex w-full max-w-[620px] flex-col items-center gap-[18px] rounded-[32px] border border-border bg-card px-6 py-10 text-center sm:px-10">
        <span className="flex size-[76px] items-center justify-center rounded-full bg-warning-bg text-4xl font-extrabold text-warning" aria-hidden="true">
          !
        </span>
        <h1 className="m-0 font-display text-4xl font-extrabold tracking-[-0.04em]">Payment not completed</h1>
        <p className="m-0 text-muted-foreground">
          No money was taken. This booking hold may have expired — start a new booking from the catalog.
        </p>
        <div className="flex flex-wrap justify-center gap-2.5">
          <Link
            href="/equipment"
            className="inline-flex min-h-11 items-center rounded-full bg-primary px-6 text-[15px] font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5"
          >
            Browse equipment
          </Link>
          <Link
            href="/dashboard/rentals"
            className="inline-flex min-h-11 items-center rounded-full border border-input bg-card px-6 text-[15px] font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:bg-muted"
          >
            My rentals
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[620px] flex-col items-center gap-[18px] rounded-[32px] border border-border bg-card px-6 py-10 text-center sm:px-10">
      <span className="flex size-[76px] items-center justify-center rounded-full bg-warning-bg text-4xl font-extrabold text-warning" aria-hidden="true">
        !
      </span>
      <h1 className="m-0 font-display text-4xl font-extrabold tracking-[-0.04em]">Payment not completed</h1>
      <p className="m-0 text-muted-foreground">
        No money was taken. We&apos;re holding{" "}
        <b className="text-foreground">
          {booking.quantity} × {booking.equipment?.name?.split(" — ")[0]}
        </b>{" "}
        for {shortRange(booking.startDate, booking.endDate)}
        {minsLeft !== null && (
          <>
            {" "}for the next <b className="text-foreground">{minsLeft} minute{minsLeft === 1 ? "" : "s"}</b>
          </>
        )}
        .
      </p>
      <div className="flex flex-wrap justify-center gap-2.5">
        <button
          type="button"
          onClick={payNow}
          disabled={checkout.isPending}
          className="inline-flex min-h-11 items-center rounded-full bg-primary px-6 text-[15px] font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60"
        >
          {checkout.isPending ? "Starting checkout…" : `Pay now · ${formatBDT(booking.totalAmount)}`}
        </button>
        <Link
          href={`/equipment/${booking.equipmentId}`}
          className="inline-flex min-h-11 items-center rounded-full border border-input bg-card px-6 text-[15px] font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:bg-muted"
        >
          Change dates
        </Link>
      </div>
    </div>
  );
}
