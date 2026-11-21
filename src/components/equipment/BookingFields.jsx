import { Minus, Plus } from "lucide-react";

function FieldError({ message }) {
  if (!message) return null;
  return <p role="alert" className="text-[13px] font-semibold text-danger">{String(message)}</p>;
}

const inputCls =
  "min-h-11 rounded-xl border border-input bg-card px-3.5 text-[15px] font-normal outline-0 placeholder:text-subtle focus-visible:border-foreground aria-[invalid=true]:border-danger";

// Left-column booking form fields (dates, quantity stepper, contact,
// address, notes) with inline zod errors. Props are the RHF bindings.
export default function BookingFields({ register, errors, qty, setQty, maxQty, minEnd, today }) {
  return (
    <>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Rental start date
          <input
            type="date"
            {...register("startDate")}
            min={today}
            aria-invalid={Boolean(errors.startDate)}
            className={inputCls}
          />
          <FieldError message={errors.startDate?.message} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Rental end date
          <input
            type="date"
            {...register("endDate")}
            min={minEnd}
            aria-invalid={Boolean(errors.endDate)}
            className={inputCls}
          />
          <FieldError message={errors.endDate?.message} />
        </label>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5 text-sm font-semibold">
          <span id="qty-label">Required quantity</span>
          <span className="flex overflow-hidden rounded-xl border border-input bg-card" role="group" aria-labelledby="qty-label">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="w-[46px] min-h-11 flex-none text-lg transition-colors hover:bg-muted"
            >
              <Minus className="mx-auto size-4" aria-hidden="true" />
            </button>
            <input
              aria-label="Quantity"
              value={qty}
              readOnly
              className="min-h-11 w-full min-w-0 border-0 bg-transparent text-center outline-0"
            />
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQty(Math.min(maxQty, qty + 1))}
              className="w-[46px] min-h-11 flex-none text-lg transition-colors hover:bg-muted"
            >
              <Plus className="mx-auto size-4" aria-hidden="true" />
            </button>
          </span>
          <FieldError message={errors.quantity?.message} />
          <span className="text-xs font-medium text-muted-foreground">
            Max {maxQty} unit{maxQty === 1 ? "" : "s"} available for these dates
          </span>
        </div>
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Contact number
          <input
            type="tel"
            {...register("phone")}
            placeholder="+880 1XXX-XXXXXX"
            aria-invalid={Boolean(errors.phone)}
            className={inputCls}
          />
          <FieldError message={errors.phone?.message} />
        </label>
      </div>
      <label className="flex flex-col gap-1.5 text-sm font-semibold">
        Delivery address
        <input
          type="text"
          {...register("address")}
          placeholder="House, road, area, city"
          aria-invalid={Boolean(errors.address)}
          className={inputCls}
        />
        <FieldError message={errors.address?.message} />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-semibold">
        Additional notes
        <textarea
          {...register("notes")}
          rows={3}
          placeholder="Gate timing, contact person, site notes…"
          aria-invalid={Boolean(errors.notes)}
          className="resize-none rounded-xl border border-input bg-card px-3.5 py-2.5 text-[15px] font-normal outline-0 placeholder:text-subtle focus-visible:border-foreground aria-[invalid=true]:border-danger"
        />
        <FieldError message={errors.notes?.message} />
      </label>
    </>
  );
}
