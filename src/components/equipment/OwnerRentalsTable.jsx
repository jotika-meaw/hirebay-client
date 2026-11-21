"use client";

import Image from "next/image";
import { useState } from "react";
import DataCard from "@/components/dashboard/DataCard";
import Pager from "@/components/dashboard/Pager";
import StatusBadge, { titleCase } from "@/components/dashboard/StatusBadge";
import { useOwnerBookings } from "@/lib/data/hooks";
import { formatBDT } from "@/lib/money";

const LIMIT = 10;

function durationLine(b) {
  const s = new Date(b.startDate);
  const e = new Date(b.endDate);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(s.getUTCDate())}–${pad(e.getUTCDate())} ${months[s.getUTCMonth()]} · ${b.days} day${b.days === 1 ? "" : "s"}`;
}

// Rentals of the signed-in owner's equipment.
export default function OwnerRentalsTable() {
  const [page, setPage] = useState(1);
  const { data, isPending } = useOwnerBookings({ page, limit: LIMIT });
  const items = data?.items ?? [];

  return (
    <DataCard title="Rentals of my equipment">
      {isPending ? (
        <div className="flex flex-col gap-3" aria-label="Loading rentals">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[62px] animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="m-0 rounded-xl bg-muted px-4 py-10 text-center text-sm text-muted-foreground">
          No rentals on your equipment yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse text-sm">
            <thead>
              <tr className="text-left text-[11px] font-extrabold tracking-[0.06em] text-subtle uppercase">
                <th className="px-2 py-3">Customer</th>
                <th className="px-2 py-3">Equipment</th>
                <th className="px-2 py-3">Rental duration</th>
                <th className="px-2 py-3">Qty</th>
                <th className="px-2 py-3">Booking amount</th>
                <th className="px-2 py-3">Payment</th>
                <th className="px-2 py-3">Booking</th>
              </tr>
            </thead>
            <tbody>
              {items.map((b) => (
                <tr key={b.id} className="border-t border-border align-middle transition-colors hover:bg-muted/60">
                  <td className="px-2 py-3">
                    <b className="block">{b.customer?.name}</b>
                    <span className="block text-xs text-muted-foreground">
                      {b.customer?.email} · {b.phone}
                    </span>
                  </td>
                  <td className="px-2 py-3">
                    <span className="flex items-center gap-2.5">
                      <span className="relative block h-[38px] w-12 flex-none overflow-hidden rounded-[10px]">
                        <Image src={b.equipment?.image} alt="" fill sizes="48px" className="object-cover" />
                      </span>
                      <span>{b.equipment?.name?.split(" — ")[0]}</span>
                    </span>
                  </td>
                  <td className="px-2 py-3 font-mono text-[13px] whitespace-nowrap">{durationLine(b)}</td>
                  <td className="px-2 py-3">{b.quantity}</td>
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
      {!isPending && <Pager page={data?.page ?? 1} pages={data?.pages ?? 1} total={data?.total ?? 0} limit={LIMIT} onPage={setPage} />}
    </DataCard>
  );
}
