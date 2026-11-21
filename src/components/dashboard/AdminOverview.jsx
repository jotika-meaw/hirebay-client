"use client";

import AdminBookingsChart from "@/components/dashboard/AdminBookingsChart";
import AdminRevenueChart from "@/components/dashboard/AdminRevenueChart";
import AttentionList from "@/components/dashboard/AttentionList";
import DataCard from "@/components/dashboard/DataCard";
import KpiCard from "@/components/dashboard/KpiCard";
import { useAdminAnalytics } from "@/lib/data/hooks";
import { completionRate, monthOverMonth } from "@/lib/analytics";
import { formatCompactBDT } from "@/lib/money";

// Admin overview: 6 KPIs, monthly bookings bars, revenue area chart,
// "Needs your attention" pending list. Every caption is derived from the
// analytics payload; captions that cannot be computed are omitted.
export default function AdminOverview() {
  const { data, isPending } = useAdminAnalytics();
  const a = data?.data;

  if (isPending || !a) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label="Loading overview">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-[132px] animate-pulse rounded-[22px] bg-muted" />
        ))}
      </div>
    );
  }

  const months = Array.isArray(a.monthly) ? a.monthly : [];
  const thisMonthBookings = months.length ? Number(months[months.length - 1]?.bookings) || 0 : 0;
  const revenueMoM = monthOverMonth(months, "revenue");
  const revenueCaption =
    revenueMoM == null ? undefined : `${revenueMoM.pct >= 0 ? "+" : ""}${revenueMoM.pct}% MoM`;
  const revenueTone = revenueMoM == null ? undefined : revenueMoM.pct >= 0 ? "success" : "warning";
  const completion = completionRate(a.completedRentals, a.totalBookings);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard label="Total users" value={a.totalUsers.toLocaleString("en-IN")} />
        <KpiCard label="Total equipment" value={a.totalEquipment.toLocaleString("en-IN")} />
        <KpiCard
          label="Total bookings"
          value={a.totalBookings.toLocaleString("en-IN")}
          delta={months.length ? `+${thisMonthBookings.toLocaleString("en-IN")} this month` : undefined}
          deltaTone="success"
        />
        <KpiCard label="Pending approvals" value={a.pendingApprovals} delta="Needs review" deltaTone="warning" />
        <KpiCard
          label="Completed rentals"
          value={a.completedRentals.toLocaleString("en-IN")}
          delta={completion ?? undefined}
          deltaTone="info"
        />
        <KpiCard label="Total revenue" value={formatCompactBDT(a.totalRevenue)} delta={revenueCaption} deltaTone={revenueTone} />
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <DataCard
          title="Monthly bookings"
          action={<span className="text-xs text-muted-foreground">Last 6 months</span>}
        >
          <AdminBookingsChart monthly={a.monthly} />
        </DataCard>
        <DataCard
          title="Revenue (৳ lakh)"
          action={
            revenueCaption ? (
              <span className="rounded-full bg-success-bg px-2.5 py-1 text-xs font-bold text-success">{revenueCaption}</span>
            ) : undefined
          }
        >
          <AdminRevenueChart monthly={a.monthly} />
        </DataCard>
      </div>
      <AttentionList />
    </div>
  );
}
