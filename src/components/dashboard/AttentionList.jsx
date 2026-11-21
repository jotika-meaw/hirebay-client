"use client";

import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import DataCard from "@/components/dashboard/DataCard";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { useAdminEquipment, useUpdateEquipmentStatus } from "@/lib/data/hooks";

// "Needs your attention": pending equipment with Approve / Reject shortcuts.
export default function AttentionList() {
  const { data, isPending } = useAdminEquipment({ status: "pending", page: 1, limit: 6 });
  const updateStatus = useUpdateEquipmentStatus();
  const items = data?.items ?? [];

  function decide(id, status) {
    updateStatus.mutate(
      { id, status },
      {
        onSuccess: () => toast.success(status === "approved" ? "Listing approved" : "Listing rejected"),
        onError: (err) => toast.error(err?.message || "Could not update listing"),
      }
    );
  }

  return (
    <DataCard
      title="Needs your attention"
      action={
        <Link href="/dashboard/admin/equipment?status=pending" className="text-[13px] font-bold text-link hover:underline">
          Review all →
        </Link>
      }
    >
      {isPending ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3" aria-label="Loading pending equipment">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-[110px] animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="m-0 rounded-xl bg-muted px-4 py-8 text-center text-sm text-muted-foreground">
          Nothing needs review right now.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 rounded-2xl border border-border p-3">
              <span className="relative block size-[52px] flex-none overflow-hidden rounded-xl">
                <Image src={item.image} alt="" fill sizes="52px" className="object-cover" />
              </span>
              <span className="min-w-0 flex-1">
                <b className="block truncate text-sm">{item.name?.split(" — ")[0]}</b>
                <span className="block truncate text-xs text-muted-foreground">
                  {item.owner?.name} · {item.location}
                </span>
              </span>
              <span className="flex flex-none flex-col gap-1">
                <StatusBadge status={item.status}>{item.status[0].toUpperCase() + item.status.slice(1)}</StatusBadge>
                <span className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => decide(item.id, "approved")}
                    disabled={updateStatus.isPending}
                    aria-label={`Approve ${item.name}`}
                    className="rounded-full bg-success-bg px-2.5 py-1 text-[11px] font-bold text-success transition-transform hover:-translate-y-0.5 disabled:opacity-60"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => decide(item.id, "rejected")}
                    disabled={updateStatus.isPending}
                    aria-label={`Reject ${item.name}`}
                    className="rounded-full bg-danger-bg px-2.5 py-1 text-[11px] font-bold text-danger transition-transform hover:-translate-y-0.5 disabled:opacity-60"
                  >
                    Reject
                  </button>
                </span>
              </span>
            </div>
          ))}
        </div>
      )}
    </DataCard>
  );
}
