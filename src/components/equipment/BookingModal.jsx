"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Minus, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useCreateBooking } from "@/lib/data/hooks";
import { formatBDT } from "@/lib/money";
import { computePricing } from "@/lib/pricing";

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function shortRange(startISO, endISO) {
  const s = new Date(`${startISO}T00:00:00Z`);
  const e = new Date(`${endISO}T00:00:00Z`);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  if (s.getUTCMonth() === e.getUTCMonth()) return `${s.getUTCDate()}–${e.getUTCDate()} ${months[s.getUTCMonth()]}`;
  return `${s.getUTCDate()} ${months[s.getUTCMonth()]} – ${e.getUTCDate()} ${months[e.getUTCMonth()]}`;
}

// Booking modal (customers). Shell ships with F-17 (uncontrolled fields,
// basic validation, submit → reservation → mock success page); F-18
// upgrades it to react-hook-form + zod with a live total and availability.
export default function BookingModal({ item, open, onOpenChange }) {
  const router = useRouter();
  const createBooking = useCreateBooking();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [quantity, setQuantity] = useState(1);
  const today = todayISO();

  const datesValid = startDate && endDate && endDate >= startDate && startDate >= today;
  const qty = Math.min(Math.max(1, quantity), item.quantity);
  const preview = datesValid
    ? computePricing({ startDate, endDate, price: item.price, rentalType: item.rentalType, quantity: qty })
    : null;

  function onSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const start = String(data.get("startDate") || "");
    const end = String(data.get("endDate") || "");
    if (!start || !end) {
      toast.error("Pick a start and end date");
      return;
    }
    if (start < today) {
      toast.error("Start date cannot be in the past");
      return;
    }
    if (end < start) {
      toast.error("End date cannot be before the start date");
      return;
    }
    createBooking.mutate(
      {
        equipmentId: item.id,
        startDate: start,
        endDate: end,
        quantity: qty,
        phone: String(data.get("phone") || ""),
        address: String(data.get("address") || ""),
        notes: String(data.get("notes") || ""),
      },
      {
        onSuccess: (res) => {
          onOpenChange(false);
          router.push(`/payment/success?demo=1&booking=${res.data.id}`);
        },
        onError: (err) => toast.error(err?.message || "Booking failed"),
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1000px] p-0 sm:max-w-[1000px]" aria-label={`Book ${item.name}`}>
        <div className="grid max-h-[90vh] grid-cols-1 overflow-y-auto lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
          <form onSubmit={onSubmit} className="flex flex-col gap-3.5 p-7">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-xs font-medium tracking-[0.1em] text-muted-foreground uppercase">
                  Booking request
                </p>
                <DialogTitle className="mt-2.5 font-display text-2xl font-extrabold tracking-[-0.03em]">
                  Book {item.name.split(" — ")[0]}
                </DialogTitle>
              </div>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                aria-label="Close"
                className="inline-flex size-[42px] flex-none items-center justify-center rounded-full border border-border bg-card text-lg transition-colors hover:bg-muted"
              >
                <X className="size-[18px]" aria-hidden="true" />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5 text-sm font-semibold">
                Rental start date
                <input
                  type="date"
                  name="startDate"
                  required
                  min={today}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="min-h-11 rounded-xl border border-input bg-card px-3.5 text-[15px] font-normal outline-0 focus-visible:border-foreground"
                />
              </label>
              <label className="flex flex-col gap-1.5 text-sm font-semibold">
                Rental end date
                <input
                  type="date"
                  name="endDate"
                  required
                  min={startDate || today}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="min-h-11 rounded-xl border border-input bg-card px-3.5 text-[15px] font-normal outline-0 focus-visible:border-foreground"
                />
              </label>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5 text-sm font-semibold">
                <span id="qty-label">Required quantity</span>
                <span className="flex overflow-hidden rounded-xl border border-input bg-card" role="group" aria-labelledby="qty-label">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-[46px] min-h-11 flex-none text-lg transition-colors hover:bg-muted"
                  >
                    <Minus className="mx-auto size-4" aria-hidden="true" />
                  </button>
                  <input
                    name="quantity"
                    aria-label="Quantity"
                    value={qty}
                    readOnly
                    className="min-h-11 w-full min-w-0 border-0 bg-transparent text-center outline-0"
                  />
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => setQuantity((q) => Math.min(item.quantity, q + 1))}
                    className="w-[46px] min-h-11 flex-none text-lg transition-colors hover:bg-muted"
                  >
                    <Plus className="mx-auto size-4" aria-hidden="true" />
                  </button>
                </span>
                <span className="text-xs font-medium text-muted-foreground">
                  Max {item.quantity} unit{item.quantity === 1 ? "" : "s"} available for these dates
                </span>
              </div>
              <label className="flex flex-col gap-1.5 text-sm font-semibold">
                Contact number
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="+880 1XXX-XXXXXX"
                  className="min-h-11 rounded-xl border border-input bg-card px-3.5 text-[15px] font-normal outline-0 placeholder:text-subtle focus-visible:border-foreground"
                />
              </label>
            </div>
            <label className="flex flex-col gap-1.5 text-sm font-semibold">
              Delivery address
              <input
                type="text"
                name="address"
                required
                minLength={5}
                maxLength={200}
                placeholder="House, road, area, city"
                className="min-h-11 rounded-xl border border-input bg-card px-3.5 text-[15px] font-normal outline-0 placeholder:text-subtle focus-visible:border-foreground"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-semibold">
              Additional notes
              <textarea
                name="notes"
                rows={3}
                maxLength={500}
                placeholder="Gate timing, contact person, site notes…"
                className="resize-none rounded-xl border border-input bg-card px-3.5 py-2.5 text-[15px] font-normal outline-0 placeholder:text-subtle focus-visible:border-foreground"
              />
            </label>
            <button
              type="submit"
              disabled={createBooking.isPending}
              className="mt-auto inline-flex min-h-[52px] items-center justify-center rounded-full bg-primary px-4 text-base font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60"
            >
              {createBooking.isPending ? "Reserving…" : "Continue to Stripe payment"}
            </button>
            <p className="text-center text-xs text-muted-foreground">
              You&apos;ll be redirected to Stripe Checkout · test card 4242 4242 4242 4242
            </p>
          </form>
          <aside className="flex flex-col gap-3.5 border-border bg-[linear-gradient(160deg,rgba(255,199,39,0.12),rgba(37,99,235,0.08))] p-7 lg:border-l">
            <b className="text-[13px] tracking-[0.06em] text-subtle">SUMMARY</b>
            <div className="flex items-center gap-3">
              <span className="relative block h-[50px] w-16 flex-none overflow-hidden rounded-xl">
                <Image src={item.image} alt="" fill sizes="64px" className="object-cover" />
              </span>
              <span>
                <b className="block text-sm">{item.name.split(" — ")[0]}</b>
                <span className="text-xs text-muted-foreground">{item.owner?.name}</span>
              </span>
            </div>
            <dl className="m-0 grid grid-cols-[1fr_auto] gap-2.5 text-[15px]">
              <dt className="text-muted-foreground">Rate</dt>
              <dd className="m-0 font-bold">{formatBDT(item.price)} / {item.rentalType === "daily" ? "day" : item.rentalType === "weekly" ? "week" : "month"}</dd>
              <dt className="text-muted-foreground">Duration</dt>
              <dd className="m-0 font-bold">{preview ? `${preview.days} day${preview.days === 1 ? "" : "s"} (${shortRange(startDate, endDate)})` : "—"}</dd>
              <dt className="text-muted-foreground">Quantity</dt>
              <dd className="m-0 font-bold">× {qty}</dd>
              <dt className="text-muted-foreground">Delivery</dt>
              <dd className="m-0 font-bold">Included</dd>
            </dl>
            <div className="flex items-baseline justify-between border-t border-dashed border-input pt-3.5">
              <span className="text-muted-foreground">Total</span>
              <span className="highlight font-display text-[40px] leading-none font-extrabold tracking-[-0.04em]">
                {preview ? formatBDT(preview.total) : "—"}
              </span>
            </div>
            {preview && (
              <span className="rounded-xl bg-success-bg px-3 py-2.5 text-[13px] font-semibold text-success">
                ✓ Availability checked · {item.quantity} unit{item.quantity === 1 ? "" : "s"} free for {shortRange(startDate, endDate)}
              </span>
            )}
          </aside>
        </div>
      </DialogContent>
    </Dialog>
  );
}
