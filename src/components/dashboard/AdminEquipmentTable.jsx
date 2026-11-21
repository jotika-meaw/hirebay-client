"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import ConfirmDialog from "@/components/dashboard/ConfirmDialog";
import DataCard from "@/components/dashboard/DataCard";
import Pager from "@/components/dashboard/Pager";
import StatusBadge from "@/components/dashboard/StatusBadge";
import EquipmentEditDialog from "@/components/equipment/EquipmentEditDialog";
import { shortCategory } from "@/components/equipment/EquipmentCard";
import { useAdminEquipment, useDeleteEquipment, useUpdateEquipmentStatus } from "@/lib/data/hooks";
import { formatBDT } from "@/lib/money";
import { cn } from "@/lib/utils";

const LIMIT = 10;
const TABS = [
  { id: "all", label: "All", status: "" },
  { id: "pending", label: "Pending", status: "pending" },
  { id: "approved", label: "Approved", status: "approved" },
  { id: "rejected", label: "Rejected", status: "rejected" },
];

// Admin equipment moderation: status tabs, approve / reject / edit / delete.
export default function AdminEquipmentTable() {
  const searchParams = useSearchParams();
  const initialTab = ["approved", "pending", "rejected"].includes(searchParams.get("status") ?? "")
    ? TABS.find((t) => t.status === searchParams.get("status")).id
    : "all";
  const [tab, setTab] = useState(initialTab);
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const status = TABS.find((t) => t.id === tab)?.status ?? "";
  const { data, isPending } = useAdminEquipment({ status, page, limit: LIMIT });
  const { data: totals } = useAdminEquipment({ limit: 1 });
  const updateStatus = useUpdateEquipmentStatus();
  const deleteEquipment = useDeleteEquipment();
  const items = data?.items ?? [];

  function decide(id, next) {
    updateStatus.mutate(
      { id, status: next },
      {
        onSuccess: () => toast.success(next === "approved" ? "Listing approved" : "Listing rejected"),
        onError: (err) => toast.error(err?.message || "Could not update listing"),
      }
    );
  }

  function confirmDelete() {
    if (!deleting) return;
    deleteEquipment.mutate(deleting.id, {
      onSuccess: () => {
        toast.success("Listing deleted");
        setDeleting(null);
      },
      onError: (err) => toast.error(err?.message || "Could not delete listing"),
    });
  }

  return (
    <>
      <DataCard
        title="All equipment"
        action={
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by status">
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
                  tab === t.id ? "bg-warning-bg text-warning" : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {t.label}
                {t.id === "all" ? ` · ${(totals?.total ?? 0).toLocaleString("en-IN")}` : null}
              </button>
            ))}
          </div>
        }
      >
        {isPending ? (
          <div className="flex flex-col gap-3" aria-label="Loading equipment">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-[62px] animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="m-0 rounded-xl bg-muted px-4 py-10 text-center text-sm text-muted-foreground">
            No listings with this status.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-sm">
              <thead>
                <tr className="text-left text-[11px] font-extrabold tracking-[0.06em] text-subtle uppercase">
                  <th className="px-2 py-3">Equipment</th>
                  <th className="px-2 py-3">Owner</th>
                  <th className="px-2 py-3">Category</th>
                  <th className="px-2 py-3">Price</th>
                  <th className="px-2 py-3">Status</th>
                  <th className="px-2 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-t border-border align-middle transition-colors hover:bg-muted/60">
                    <td className="px-2 py-3">
                      <span className="flex items-center gap-2.5">
                        <span className="relative block h-[38px] w-12 flex-none overflow-hidden rounded-[10px]">
                          <Image src={item.image} alt="" fill sizes="48px" className="object-cover" />
                        </span>
                        <b className="text-sm">{item.name?.split(" — ")[0]}</b>
                      </span>
                    </td>
                    <td className="px-2 py-3">{item.owner?.name}</td>
                    <td className="px-2 py-3">{shortCategory(item.category)}</td>
                    <td className="px-2 py-3 font-bold whitespace-nowrap">
                      {formatBDT(item.price)} <span className="text-[13px] font-medium text-muted-foreground">/ {item.rentalType === "daily" ? "day" : item.rentalType === "weekly" ? "week" : "month"}</span>
                    </td>
                    <td className="px-2 py-3">
                      <StatusBadge status={item.status}>{item.status[0].toUpperCase() + item.status.slice(1)}</StatusBadge>
                    </td>
                    <td className="px-2 py-3">
                      <span className="flex justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => decide(item.id, "approved")}
                          disabled={updateStatus.isPending}
                          className="inline-flex min-h-9 items-center rounded-full bg-success-bg px-3.5 text-[13px] font-semibold text-success transition-transform hover:-translate-y-0.5 disabled:opacity-60"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => decide(item.id, "rejected")}
                          disabled={updateStatus.isPending}
                          className="inline-flex min-h-9 items-center rounded-full bg-danger-bg px-3.5 text-[13px] font-semibold text-danger transition-transform hover:-translate-y-0.5 disabled:opacity-60"
                        >
                          Reject
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditing(item)}
                          aria-label={`Edit ${item.name}`}
                          className="inline-flex size-11 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted"
                        >
                          <Pencil className="size-[18px]" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleting(item)}
                          aria-label={`Delete ${item.name}`}
                          className="inline-flex size-11 items-center justify-center rounded-full text-danger transition-colors hover:bg-danger-bg"
                        >
                          <Trash2 className="size-[18px]" aria-hidden="true" />
                        </button>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!isPending && <Pager page={data?.page ?? 1} pages={data?.pages ?? 1} total={data?.total ?? 0} limit={LIMIT} onPage={setPage} />}
      </DataCard>
      <EquipmentEditDialog item={editing} open={Boolean(editing)} onOpenChange={(v) => { if (!v) setEditing(null); }} showPendingNote={false} />
      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(v) => { if (!v) setDeleting(null); }}
        title="Delete this listing?"
        body={deleting ? `“${deleting.name?.split(" — ")[0]}” will be removed. Listings with upcoming paid bookings can't be deleted.` : ""}
        confirmLabel="Delete"
        pending={deleteEquipment.isPending}
        onConfirm={confirmDelete}
      />
    </>
  );
}
