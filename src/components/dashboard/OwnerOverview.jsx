"use client";

import DataCard from "@/components/dashboard/DataCard";
import KpiCard from "@/components/dashboard/KpiCard";
import LatestRentals from "@/components/dashboard/LatestRentals";
import MonthlyEarnings from "@/components/dashboard/MonthlyEarnings";
import StatusDonut from "@/components/dashboard/StatusDonut";
import { useOwnerAnalytics } from "@/lib/data/hooks";
import { formatCompactBDT } from "@/lib/money";

// Owner overview: 4 KPIs, monthly earnings bars (latest yellow),
// rental-status donut, latest rentals table.
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

  const total = (a.statusMix?.completed ?? 0) + (a.statusMix?.confirmed ?? 0) + (a.statusMix?.pending ?? 0);

  return (
    <div className="flex flex-col gap-4">
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
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <DataCard
          title="Monthly earnings (৳ thousand)"
          action={
            <span className="rounded-full bg-success-bg px-3 py-1 text-xs font-bold text-success">+16% vs Oct</span>
          }
        >
          <MonthlyEarnings monthly={a.monthly} />
        </DataCard>
        <DataCard
          title="Rental status"
          action={<span className="text-xs text-muted-foreground">{total} rentals</span>}
        >
          <StatusDonut mix={a.statusMix} />
        </DataCard>
      </div>
      <LatestRentals />
    </div>
  );
}
