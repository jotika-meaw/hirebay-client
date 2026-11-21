"use client";

import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import DataCard from "@/components/dashboard/DataCard";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { shortCategory } from "@/components/equipment/EquipmentCard";
import { useFavorites, useToggleFavorite } from "@/lib/data/hooks";
import { formatBDT } from "@/lib/money";

const UNIT_LABEL = { daily: "day", weekly: "week", monthly: "month" };

// Customer favorites table: View details + Remove.
export default function FavoritesTable() {
  const { data, isPending } = useFavorites();
  const toggleFavorite = useToggleFavorite();
  const rows = data?.data ?? [];

  function remove(equipmentId, name) {
    toggleFavorite.mutate(
      { equipmentId, isFavorite: true },
      {
        onSuccess: () => toast.success(`Removed ${name?.split(" — ")[0] ?? "item"} from favorites`),
        onError: (err) => toast.error(err?.message || "Could not remove favorite"),
      }
    );
  }

  return (
    <DataCard
      title="Favorites"
      action={
        <span className="rounded-full bg-neutral-bg px-3 py-1 text-xs font-bold text-neutral">
          {rows.length} saved
        </span>
      }
    >
      {isPending ? (
        <div className="flex flex-col gap-3" aria-label="Loading favorites">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-[62px] animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <p className="m-0 rounded-xl bg-muted px-4 py-10 text-center text-sm text-muted-foreground">
          No favorites yet. Tap the heart on any equipment to save it here.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-sm">
            <thead>
              <tr className="text-left text-[11px] font-extrabold tracking-[0.06em] text-subtle uppercase">
                <th className="px-2 py-3">Equipment</th>
                <th className="px-2 py-3">Category</th>
                <th className="px-2 py-3">Rental price</th>
                <th className="px-2 py-3">Location</th>
                <th className="px-2 py-3">Availability</th>
                <th className="px-2 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ equipment }) => {
                const item = equipment;
                if (!item) return null;
                const available = item.quantity > 0;
                return (
                  <tr key={item.id} className="border-t border-border align-middle transition-colors hover:bg-muted/60">
                    <td className="px-2 py-3">
                      <span className="flex items-center gap-2.5">
                        <span className="relative block h-[38px] w-12 flex-none overflow-hidden rounded-[10px]">
                          <Image src={item.image} alt="" fill sizes="48px" className="object-cover" />
                        </span>
                        <b className="text-sm">{item.name?.split(" — ")[0]}</b>
                      </span>
                    </td>
                    <td className="px-2 py-3">{shortCategory(item.category)}</td>
                    <td className="px-2 py-3 font-bold whitespace-nowrap">
                      {formatBDT(item.price)} <span className="text-[13px] font-medium text-muted-foreground">/ {UNIT_LABEL[item.rentalType] ?? item.rentalType}</span>
                    </td>
                    <td className="px-2 py-3">{item.location}</td>
                    <td className="px-2 py-3">
                      {available ? (
                        <StatusBadge status="available">● {item.quantity} available</StatusBadge>
                      ) : (
                        <StatusBadge status="unavailable">Unavailable</StatusBadge>
                      )}
                    </td>
                    <td className="px-2 py-3">
                      <span className="flex justify-end gap-2">
                        <Link
                          href={`/equipment/${item.id}`}
                          className="inline-flex min-h-9 items-center rounded-full bg-primary px-4 text-[13px] font-semibold text-primary-foreground transition-all hover:-translate-y-0.5"
                        >
                          View details
                        </Link>
                        <button
                          type="button"
                          onClick={() => remove(item.id, item.name)}
                          disabled={toggleFavorite.isPending}
                          className="inline-flex min-h-9 items-center rounded-full border border-input bg-card px-4 text-[13px] font-semibold text-danger transition-colors hover:bg-danger-bg disabled:opacity-60"
                        >
                          Remove
                        </button>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </DataCard>
  );
}
