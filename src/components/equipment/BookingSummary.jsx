import Image from "next/image";
import { PHOTO_POSITIONS } from "@/components/equipment/EquipmentCard";
import { formatBDT } from "@/lib/money";

// Right-hand summary card: item, rate, duration, quantity, delivery,
// highlighted total and the availability line.
export default function BookingSummary({ item, preview, rangeLabel, quantity }) {
  return (
    <aside className="flex flex-col gap-3.5 border-border bg-[linear-gradient(160deg,rgba(255,199,39,0.12),rgba(37,99,235,0.08))] p-7 lg:border-l">
      <b className="text-[13px] tracking-[0.06em] text-subtle">SUMMARY</b>
      <div className="flex items-center gap-3">
        <span className="relative block h-[50px] w-16 flex-none overflow-hidden rounded-xl">
          <Image
            src={item.image}
            alt=""
            fill
            sizes="64px"
            className="object-cover"
            style={{ objectPosition: PHOTO_POSITIONS[item.image?.split("/").pop()] ?? "50% 50%" }}
          />
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
        <dd className="m-0 font-bold">{preview ? `${preview.days} day${preview.days === 1 ? "" : "s"} (${rangeLabel})` : "—"}</dd>
        <dt className="text-muted-foreground">Quantity</dt>
        <dd className="m-0 font-bold">× {quantity}</dd>
        <dt className="text-muted-foreground">Delivery</dt>
        <dd className="m-0 font-bold">Included</dd>
      </dl>
      <div className="flex items-baseline justify-between border-t border-dashed border-input pt-3.5">
        <span className="text-muted-foreground">Total</span>
        <span className="highlight font-display text-[40px] leading-none font-extrabold tracking-[-0.04em]">
          {preview ? formatBDT(preview.total) : "—"}
        </span>
      </div>
      {preview ? (
        <span className="rounded-xl bg-success-bg px-3 py-2.5 text-[13px] font-semibold text-success">
          ✓ Availability checked · {item.quantity} unit{item.quantity === 1 ? "" : "s"} free for {rangeLabel}
        </span>
      ) : (
        <span className="rounded-xl bg-muted px-3 py-2.5 text-[13px] font-semibold text-muted-foreground">
          Pick valid dates to check availability
        </span>
      )}
    </aside>
  );
}
