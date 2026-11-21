"use client";

import KpiCard from "@/components/dashboard/KpiCard";
import { useOwnerAnalytics } from "@/lib/data/hooks";
import { formatCompactBDT } from "@/lib/money";

// Owner overview KPI row (F-20). Charts and latest rentals land in F-22.
export default function OwnerOverview() {
  const { data, isPending } = useOwnerAnalytics();
  const a = data?.data;

  if (isPending || !a) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Loading overview">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-[132px] animate-pulse rounded-[22px] bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        label="Total listed equipment"
        value={a.listed}
        delta={`${a.approved} approved · ${a.pending} pending · ${a.rejected} rejected`}
      />
      <KpiCard label="Completed rentals" value={a.completedRentals} delta="+9 this month" deltaTone="success" />
      <KpiCard label="Total earnings" value={formatCompactBDT(a.totalEarnings)} delta="All paid bookings" />
      <KpiCard label="This month" value={formatCompactBDT(a.thisMonth)} delta={a.thisMonthDelta} deltaTone="success" />
    </div>
  );
}
