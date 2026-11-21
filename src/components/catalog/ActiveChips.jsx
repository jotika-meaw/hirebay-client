"use client";

import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { formatPriceShort, LIMIT, toCatalogSearch } from "@/lib/catalog-params";

// Removable info chips for the active filters (design shows search,
// location, rental type, price range and availability — no endpoint chips).
export default function ActiveChips({ params, total }) {
  const router = useRouter();

  function remove(patch) {
    router.push(toCatalogSearch({ ...params, ...patch, page: 1 }));
  }

  const chips = [];
  if (params.search) {
    chips.push({ key: "search", label: `“${params.search}”`, patch: { search: "" } });
  }
  if (params.location) {
    chips.push({ key: "location", label: params.location, patch: { location: "" } });
  }
  if (params.rentalType) {
    const label = params.rentalType[0].toUpperCase() + params.rentalType.slice(1);
    chips.push({ key: "rentalType", label, patch: { rentalType: "" } });
  }
  if (params.minPrice || params.maxPrice) {
    const lo = params.minPrice ? `৳${formatPriceShort(params.minPrice)}` : "";
    const hi = params.maxPrice ? `৳${formatPriceShort(params.maxPrice)}` : "";
    const label = params.minPrice && params.maxPrice ? `${lo}–${hi}` : params.minPrice ? `${lo}+` : `up to ${hi}`;
    chips.push({ key: "price", label, patch: { minPrice: "", maxPrice: "" } });
  }
  if (params.availability) {
    const label = params.availability[0].toUpperCase() + params.availability.slice(1);
    chips.push({ key: "availability", label, patch: { availability: "" } });
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-[13px]">
      <span className="text-muted-foreground">
        Showing{" "}
        <b className="text-foreground">
          {total === 0 ? "0" : `${(params.page - 1) * LIMIT + 1}–${Math.min(params.page * LIMIT, total)}`}
        </b>{" "}
        of {total}
      </span>
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={() => remove(chip.patch)}
          aria-label={`Remove filter ${chip.label}`}
          className="inline-flex min-h-11 items-center gap-1 rounded-full bg-info-bg px-3 py-1.5 text-xs font-semibold text-info transition-colors hover:bg-info-bg/70"
        >
          {chip.label}
          <X className="size-3.5" aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}
