"use client";

import KpiCard from "@/components/dashboard/KpiCard";
import { useAdminAnalytics } from "@/lib/data/hooks";
import { formatCompactBDT } from "@/lib/money";

// Admin overview KPI row (F-20). Charts and the attention list land in F-25.
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

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <KpiCard label="Total users" value={a.totalUsers.toLocaleString("en-IN")} delta="+84 this month" deltaTone="success" />
      <KpiCard label="Total equipment" value={a.totalEquipment.toLocaleString("en-IN")} delta="+41 this month" deltaTone="success" />
      <KpiCard label="Total bookings" value={a.totalBookings.toLocaleString("en-IN")} delta="+112 this month" deltaTone="success" />
      <KpiCard label="Pending approvals" value={a.pendingApprovals} delta="Needs review" deltaTone="warning" />
      <KpiCard label="Completed rentals" value={a.completedRentals.toLocaleString("en-IN")} delta="97% completion" deltaTone="info" />
      <KpiCard label="Total revenue" value={formatCompactBDT(a.totalRevenue)} delta="+27% MoM" deltaTone="success" />
    </div>
  );
}
