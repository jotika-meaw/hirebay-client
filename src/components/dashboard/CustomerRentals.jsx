"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import DataCard from "@/components/dashboard/DataCard";
import KpiCard from "@/components/dashboard/KpiCard";
import Pager from "@/components/dashboard/Pager";
import StatusBadge, { titleCase } from "@/components/dashboard/StatusBadge";
import { useCheckout, useFavoriteIds, useMyBookings } from "@/lib/data/hooks";
import { formatBDT, formatDate } from "@/lib/money";
import { cn } from "@/lib/utils";

const LIMIT = 5;
const TABS = [
  { id: "all", label: "All", status: "" },
  { id: "active", label: "Active", status: "pending,confirmed" },
  { id: "completed", label: "Completed", status: "completed" },
];

// Customer rentals: KPI row + status filter + paginated table.
// "Pay now" resumes payment on unpaid live holds via useCheckout.
export default function CustomerRentals() {
  const [tab, setTab] = useState("all");
  const [page, setPage] = useState(1);
  const status = TABS.find((t) => t.id === tab)?.status ?? "";
  const { data, isPending } = useMyBookings({ status, page, limit: LIMIT });
  const { data: favoriteIds } = useFavoriteIds();
  const checkout = useCheckout();
  const router = useRouter();

  const items = data?.items ?? [];

  function payNow(bookingId) {
    checkout.mutate(
      { bookingId },
      {
        onSuccess: (res) => router.push(res.data.url),
        onError: (err) => toast.error(err?.message || "Could not start checkout"),
      }
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <RentalsKpis favorites={favoriteIds?.data?.length ?? 0} />
      <DataCard
        title="My rentals"
        action={
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter rentals by status">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                aria-pressed={tab === t.id}
                onClick={() => {
                  setTab(t.id);
                  setPage(1);
                }}
                className={cn(
                  "inline-flex min-h-9 items-center rounded-full px-3.5 text-[13px] font-semibold transition-colors",
                  tab === t.id ? "bg-info-bg text-info" : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
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
            No rentals here yet. Browse the catalog to book your first machine.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-sm">
              <thead>
                <tr className="text-left text-[11px] font-extrabold tracking-[0.06em] text-subtle uppercase">
                  <th className="px-2 py-3">Equipment</th>
                  <th className="px-2 py-3">Start date</th>
                  <th className="px-2 py-3">End date</th>
                  <th className="px-2 py-3">Booked on</th>
                  <th className="px-2 py-3">Total</th>
                  <th className="px-2 py-3">Payment</th>
                  <th className="px-2 py-3">Booking</th>
                </tr>
              </thead>
              <tbody>
                {items.map((b) => (
                  <tr key={b.id} className="border-t border-border align-middle transition-colors hover:bg-muted/60">
                    <td className="px-2 py-3">
                      <span className="flex items-center gap-2.5">
                        <span className="relative block h-[38px] w-12 flex-none overflow-hidden rounded-[10px]">
                          <Image
                            src={b.equipment?.image}
                            alt=""
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </span>
                        <b className="text-sm">{b.equipment?.name?.split(" — ")[0]}</b>
                      </span>
                    </td>
                    <td className="px-2 py-3 font-mono text-[13px] whitespace-nowrap">{formatDate(b.startDate)}</td>
                    <td className="px-2 py-3 font-mono text-[13px] whitespace-nowrap">{formatDate(b.endDate)}</td>
                    <td className="px-2 py-3 font-mono text-[13px] whitespace-nowrap">{formatDate(b.createdAt)}</td>
                    <td className="px-2 py-3 font-bold whitespace-nowrap">{formatBDT(b.totalAmount)}</td>
                    <td className="px-2 py-3">
                      <StatusBadge status={b.paymentStatus}>{titleCase(b.paymentStatus)}</StatusBadge>
                    </td>
                    <td className="px-2 py-3">
                      <span className="inline-flex items-center gap-2">
                        <StatusBadge status={b.status}>{titleCase(b.status)}</StatusBadge>
                        {b.paymentStatus === "unpaid" && b.status === "pending" && (
                          <button
                            type="button"
                            onClick={() => payNow(b.id)}
                            disabled={checkout.isPending}
                            className="inline-flex min-h-9 items-center rounded-full bg-primary px-3.5 text-[13px] font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 disabled:opacity-60"
                          >
                            Pay now
                          </button>
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!isPending && (
          <Pager page={data?.page ?? 1} pages={data?.pages ?? 1} total={data?.total ?? 0} limit={LIMIT} onPage={setPage} />
        )}
      </DataCard>
    </div>
  );
}

function RentalsKpis({ favorites }) {
  const { data } = useMyBookings({ status: "", limit: 100 });
  const all = data?.items ?? [];
  const active = all.filter((b) => b.status === "confirmed").length;
  const spent = all.filter((b) => b.paymentStatus === "paid").reduce((sum, b) => sum + b.totalAmount, 0);
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <KpiCard label="Active rentals" value={active} />
      <KpiCard label="Total spent" value={formatBDT(spent)} />
      <KpiCard label="Saved favorites" value={favorites} />
    </div>
  );
}
