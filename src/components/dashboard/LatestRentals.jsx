"use client";

import Link from "next/link";
import DataCard from "@/components/dashboard/DataCard";
import StatusBadge, { titleCase } from "@/components/dashboard/StatusBadge";
import { useOwnerBookings } from "@/lib/data/hooks";
import { formatBDT } from "@/lib/money";

function shortRange(startISO, endISO, days) {
  const s = new Date(startISO);
  const e = new Date(endISO);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const left = `${String(s.getUTCDate()).padStart(2, "0")}–${String(e.getUTCDate()).padStart(2, "0")}`;
  return `${left} ${months[s.getUTCMonth()]} · ${days} day${days === 1 ? "" : "s"}`;
}

// Latest rentals of the owner's equipment (newest 3) + "View all".
export default function LatestRentals() {
  const { data, isPending } = useOwnerBookings({ page: 1, limit: 3 });
  const items = data?.items ?? [];

  return (
    <DataCard
      title="Latest rentals of my equipment"
      action={
        <Link href="/dashboard/owner/rentals" className="text-[13px] font-bold text-link hover:underline">
          View all →
        </Link>
      }
    >
      {isPending ? (
        <div className="flex flex-col gap-3" aria-label="Loading latest rentals">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-[52px] animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="m-0 rounded-xl bg-muted px-4 py-8 text-center text-sm text-muted-foreground">
          No rentals on your equipment yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="text-left text-[11px] font-extrabold tracking-[0.06em] text-subtle uppercase">
                <th className="px-2 py-3">Customer</th>
                <th className="px-2 py-3">Equipment</th>
                <th className="px-2 py-3">Duration</th>
                <th className="px-2 py-3">Amount</th>
                <th className="px-2 py-3">Payment</th>
                <th className="px-2 py-3">Booking</th>
              </tr>
            </thead>
            <tbody>
              {items.map((b) => (
                <tr key={b.id} className="border-t border-border align-middle transition-colors hover:bg-muted/60">
                  <td className="px-2 py-3 font-bold whitespace-nowrap">{b.customer?.name}</td>
                  <td className="px-2 py-3 whitespace-nowrap">{b.equipment?.name?.split(" — ")[0]}</td>
                  <td className="px-2 py-3 font-mono text-[13px] whitespace-nowrap">
                    {shortRange(b.startDate, b.endDate, b.days)}
                  </td>
                  <td className="px-2 py-3 font-bold whitespace-nowrap">{formatBDT(b.totalAmount)}</td>
                  <td className="px-2 py-3">
                    <StatusBadge status={b.paymentStatus}>{titleCase(b.paymentStatus)}</StatusBadge>
                  </td>
                  <td className="px-2 py-3">
                    <StatusBadge status={b.status}>{titleCase(b.status)}</StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DataCard>
  );
}
