"use client";

import { useState } from "react";
import { toast } from "sonner";
import DataCard from "@/components/dashboard/DataCard";
import Pager from "@/components/dashboard/Pager";
import StatusBadge, { titleCase } from "@/components/dashboard/StatusBadge";
import { useAdminBookings, useUpdateBookingStatus } from "@/lib/data/hooks";
import { formatBDT } from "@/lib/money";

const LIMIT = 10;
const STATUSES = ["", "pending", "confirmed", "completed", "cancelled"];

function shortRange(startISO, endISO) {
  const s = new Date(startISO);
  const e = new Date(endISO);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${s.getUTCDate()}–${e.getUTCDate()} ${months[s.getUTCMonth()]}`;
}

// Admin rentals: every booking with customer, owner, equipment, duration,
// amount, payment status and an editable booking status.
export default function AdminRentalsTable() {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const { data, isPending } = useAdminBookings({ status: status || undefined, page, limit: LIMIT });
  const updateStatus = useUpdateBookingStatus();
  const items = data?.items ?? [];

  function changeStatus(id, next) {
    updateStatus.mutate(
      { id, status: next },
      {
        onSuccess: () => toast.success(`Booking marked ${next}`),
        onError: (err) => toast.error(err?.message || "Could not update booking"),
      }
    );
  }

  return (
    <DataCard
      title={`All rentals · ${(data?.total ?? 0).toLocaleString("en-IN")}`}
      action={
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          aria-label="Filter by booking status"
          className="min-h-11 cursor-pointer appearance-none rounded-xl border border-input bg-card px-3.5 pr-8 text-sm font-semibold outline-0 focus-visible:border-foreground"
        >
          <option value="">All statuses</option>
          {STATUSES.filter(Boolean).map((s) => (
            <option key={s} value={s}>
              {s[0].toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      }
    >
      {isPending ? (
        <div className="flex flex-col gap-3" aria-label="Loading rentals">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-[62px] animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="m-0 rounded-xl bg-muted px-4 py-10 text-center text-sm text-muted-foreground">
          No rentals with this status.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse text-sm">
            <thead>
              <tr className="text-left text-[11px] font-extrabold tracking-[0.06em] text-subtle uppercase">
                <th className="px-2 py-3">Customer</th>
                <th className="px-2 py-3">Owner</th>
                <th className="px-2 py-3">Equipment</th>
                <th className="px-2 py-3">Rental duration</th>
                <th className="px-2 py-3">Amount</th>
                <th className="px-2 py-3">Payment</th>
                <th className="px-2 py-3">Booking status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((b) => (
                <tr key={b.id} className="border-t border-border align-middle transition-colors hover:bg-muted/60">
                  <td className="px-2 py-3">
                    <b className="block">{b.customer?.name}</b>
                    <span className="block text-xs text-muted-foreground">{b.customer?.email}</span>
                  </td>
                  <td className="px-2 py-3">
                    <b className="block">{b.owner?.name}</b>
                    <span className="block text-xs text-muted-foreground">{b.owner?.email}</span>
                  </td>
                  <td className="px-2 py-3">{b.equipment?.name?.split(" — ")[0]}</td>
                  <td className="px-2 py-3 font-mono text-[13px] whitespace-nowrap">
                    {shortRange(b.startDate, b.endDate)}
                  </td>
                  <td className="px-2 py-3 font-bold whitespace-nowrap">{formatBDT(b.totalAmount)}</td>
                  <td className="px-2 py-3">
                    <StatusBadge status={b.paymentStatus}>{titleCase(b.paymentStatus)}</StatusBadge>
                  </td>
                  <td className="px-2 py-3">
                    <select
                      value={b.status}
                      onChange={(e) => changeStatus(b.id, e.target.value)}
                      disabled={updateStatus.isPending}
                      aria-label={`Booking status for ${b.equipment?.name}`}
                      className="min-h-9 cursor-pointer rounded-xl border border-input bg-card px-2.5 text-sm font-semibold outline-0 disabled:opacity-60"
                    >
                      {["pending", "confirmed", "completed", "cancelled"].map((s) => (
                        <option key={s} value={s}>
                          {s[0].toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
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
