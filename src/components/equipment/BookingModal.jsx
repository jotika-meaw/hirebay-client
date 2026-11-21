"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Minus, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import BookingFields from "@/components/equipment/BookingFields";
import BookingSummary from "@/components/equipment/BookingSummary";
import { PHOTO_POSITIONS } from "@/components/equipment/EquipmentCard";
import { useCreateBooking } from "@/lib/data/hooks";
import { bookingSchema } from "@/lib/validators";
import { computePricing } from "@/lib/pricing";

function todayStr() {
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

const TODAY = todayStr();

const formSchema = bookingSchema
  .refine((v) => !v.startDate || v.startDate >= TODAY, {
    message: "Start date cannot be in the past",
    path: ["startDate"],
  })
  .refine((v) => !v.startDate || !v.endDate || v.endDate >= v.startDate, {
    message: "End date cannot be before the start date",
    path: ["endDate"],
  });

// Booking modal (customers): dates (no past dates, end ≥ start), quantity
// stepper (max = stock), BD phone, address (5–200), notes (≤ 500) with zod
// inline errors, live total from pricing.js, availability line,
// "Continue to Stripe payment" → reservation → mock success page.
export default function BookingModal({ item, open, onOpenChange }) {
  const router = useRouter();
  const createBooking = useCreateBooking();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      equipmentId: item.id,
      startDate: "",
      endDate: "",
      quantity: 1,
      phone: "",
      address: "",
      notes: "",
    },
  });

  const startDate = useWatch({ control, name: "startDate" }) ?? "";
  const endDate = useWatch({ control, name: "endDate" }) ?? "";
  const quantity = useWatch({ control, name: "quantity" }) ?? 1;
  const qty = Math.min(Math.max(1, Number(quantity) || 1), item.quantity);
  const datesValid = startDate && endDate && endDate >= startDate && startDate >= TODAY;
  const preview = datesValid
    ? computePricing({ startDate, endDate, price: item.price, rentalType: item.rentalType, quantity: qty })
    : null;

  function onInvalid() {
    toast.error("Check the highlighted fields and try again");
  }

  function onSubmit(values) {
    createBooking.mutate(
      { ...values, equipmentId: item.id, quantity: qty },
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
      <DialogContent className="max-h-[90vh] max-w-[1000px] overflow-y-auto p-0 sm:max-w-[1000px]" aria-label={`Book ${item.name}`}>
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
          <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="flex flex-col gap-3.5 p-7" noValidate>
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
            <BookingFields
              register={register}
              errors={errors}
              qty={qty}
              setQty={(next) => setValue("quantity", next, { shouldValidate: true })}
              maxQty={item.quantity}
              minEnd={startDate || TODAY}
              today={TODAY}
            />
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
          <BookingSummary
            item={item}
            preview={preview}
            rangeLabel={datesValid ? shortRange(startDate, endDate) : ""}
            quantity={qty}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
