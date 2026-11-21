"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useConfirmPayment, useMyBookings } from "@/lib/data/hooks";
import { formatBDT } from "@/lib/money";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function periodLine(booking) {
  const s = new Date(booking.startDate);
  const e = new Date(booking.endDate);
  const sameMonth = s.getUTCMonth() === e.getUTCMonth();
  const range = sameMonth
    ? `${s.getUTCDate()} – ${e.getUTCDate()} ${MONTHS[s.getUTCMonth()]} ${s.getUTCFullYear()}`
    : `${s.getUTCDate()} ${MONTHS[s.getUTCMonth()]} – ${e.getUTCDate()} ${MONTHS[e.getUTCMonth()]} ${e.getUTCFullYear()}`;
  return `${range} · ${booking.days} day${booking.days === 1 ? "" : "s"} · ${booking.quantity} unit${booking.quantity === 1 ? "" : "s"}`;
}

// /payment/success: confirms the reservation (mock) then shows the paid
// summary. `demo=1` adds the "no payment taken" badge.
export default function PaymentSuccess() {
  const sp = useSearchParams();
  const bookingId = sp.get("booking") ?? sp.get("bookingId");
  const demo = sp.get("demo") === "1";
  const confirmPayment = useConfirmPayment();
  const { data: mine } = useMyBookings();
  const [confirmed, setConfirmed] = useState(null);
  const [failed, setFailed] = useState(null);
  const started = useRef(null);

  useEffect(() => {
    if (!bookingId || started.current === bookingId) return;
    started.current = bookingId;
    confirmPayment.mutate(
      { bookingId },
      {
        onSuccess: (res) => setConfirmed(res.data.booking),
        onError: (err) => setFailed(err?.message || "Payment confirmation failed"),
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  const fallback = !bookingId ? null : (mine?.items ?? []).find((b) => b.id === bookingId) ?? null;
  const booking = confirmed ?? fallback;

  if (!bookingId) {
    return (
      <StatusCard title="Missing booking reference" tone="error">
        <p className="m-0 text-muted-foreground">We couldn&apos;t find which booking this payment was for.</p>
        <CardLinks />
      </StatusCard>
    );
  }

  if (failed && !booking) {
    return (
      <StatusCard title="Confirmation failed" tone="error">
        <p className="m-0 text-muted-foreground">{failed}</p>
        <CardLinks />
      </StatusCard>
    );
  }

  if (!booking) {
    return (
      <StatusCard title="Confirming payment…" tone="loading">
        <p className="m-0 text-muted-foreground">Talking to the payment provider…</p>
      </StatusCard>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[620px] flex-col items-center gap-[18px] rounded-[32px] border border-border bg-card px-6 py-10 text-center sm:px-10">
      <span className="flex size-[76px] items-center justify-center rounded-full bg-[linear-gradient(135deg,#10B981,#059669)]" aria-hidden="true">
        <Check className="size-9 text-white" strokeWidth={3} aria-hidden="true" />
      </span>
      <h1 className="m-0 font-display text-4xl font-extrabold tracking-[-0.04em]">Payment successful</h1>
      <p className="m-0 text-muted-foreground">Your booking is confirmed and the transaction is saved to your rentals.</p>
      {demo && (
        <span className="rounded-full bg-warning-bg px-3 py-1.5 text-xs font-bold text-warning">
          Demo mode — no payment taken
        </span>
      )}
      <dl className="m-0 grid w-full grid-cols-[auto_1fr] gap-x-4 gap-y-2.5 rounded-[20px] border border-border bg-muted/50 px-5 py-[18px] text-left text-sm">
        <dt className="text-muted-foreground">Equipment</dt>
        <dd className="m-0 text-right font-bold">{booking.equipment?.name}</dd>
        <dt className="text-muted-foreground">Rental period</dt>
        <dd className="m-0 text-right">{periodLine(booking)}</dd>
        <dt className="text-muted-foreground">Payment status</dt>
        <dd className="m-0 text-right"><Badge variant="success">{booking.paymentStatus === "paid" ? "Paid" : "Unpaid"}</Badge></dd>
        <dt className="text-muted-foreground">Booking status</dt>
        <dd className="m-0 text-right">
          <Badge variant={booking.status === "confirmed" ? "info" : "neutral"}>
            {booking.status[0].toUpperCase() + booking.status.slice(1)}
          </Badge>
        </dd>
        <dt className="text-muted-foreground">Transaction ID</dt>
        <dd className="m-0 text-right font-mono text-[13px]">{booking.transactionId ?? "—"}</dd>
        <dt className="border-t border-border pt-2.5 text-muted-foreground">Total paid</dt>
        <dd className="m-0 border-t border-border pt-2.5 text-right font-display text-[22px] font-extrabold">
          {formatBDT(booking.totalAmount)}
        </dd>
      </dl>
      <div className="flex flex-wrap justify-center gap-2.5">
        <Link
          href="/dashboard/rentals"
          className="inline-flex min-h-11 items-center rounded-full bg-primary px-6 text-[15px] font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5"
        >
          View my rentals
        </Link>
        <Link
          href="/equipment"
          className="inline-flex min-h-11 items-center rounded-full border border-input bg-card px-6 text-[15px] font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:bg-muted"
        >
          Keep browsing
        </Link>
      </div>
    </div>
  );
}

function StatusCard({ title, tone, children }) {
  return (
    <div className="mx-auto flex w-full max-w-[620px] flex-col items-center gap-[18px] rounded-[32px] border border-border bg-card px-6 py-10 text-center sm:px-10">
      {tone === "loading" ? (
        <span className="size-[76px] animate-pulse rounded-full bg-muted" aria-hidden="true" />
      ) : (
        <span className="flex size-[76px] items-center justify-center rounded-full bg-danger-bg text-4xl font-extrabold text-danger" aria-hidden="true">
          !
        </span>
      )}
      <h1 className="m-0 font-display text-4xl font-extrabold tracking-[-0.04em]">{title}</h1>
      {children}
    </div>
  );
}

function CardLinks() {
  return (
    <div className="flex flex-wrap justify-center gap-2.5">
      <Link
        href="/dashboard/rentals"
        className="inline-flex min-h-11 items-center rounded-full bg-primary px-6 text-[15px] font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5"
      >
        View my rentals
      </Link>
      <Link
        href="/equipment"
        className="inline-flex min-h-11 items-center rounded-full border border-input bg-card px-6 text-[15px] font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:bg-muted"
      >
        Keep browsing
      </Link>
    </div>
  );
}
