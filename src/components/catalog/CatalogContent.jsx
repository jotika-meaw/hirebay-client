"use client";

import Link from "next/link";
import { SearchX } from "lucide-react";
import EquipmentCard from "@/components/equipment/EquipmentCard";
import Kicker from "@/components/home/Kicker";
import ActiveChips from "@/components/catalog/ActiveChips";
import FilterPanel from "@/components/catalog/FilterPanel";
import Pagination from "@/components/catalog/Pagination";
import SearchBar from "@/components/catalog/SearchBar";
import { catalogQuery, useCatalogParams } from "@/lib/catalog-params";
import { useEquipmentList } from "@/lib/data/hooks";

// /equipment: header, search bar, sticky filter card, active chips,
// 3-col EquipmentCard grid, numbered pagination, skeletons, empty state.
// All state lives in the URL (see catalog-params.js).
export default function CatalogContent() {
  const params = useCatalogParams();
  const urlKey = JSON.stringify(params);
  const { data, isPending, isError } = useEquipmentList(catalogQuery(params));
  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const pages = data?.pages ?? 1;

  return (
    <div className="mx-auto w-full max-w-[1240px] px-7 pt-14 pb-[90px]">
      <div className="flex flex-col items-center gap-3 text-center">
        <Kicker>Catalog · {total} approved listings</Kicker>
        <h1 className="m-0 font-display text-[56px] leading-[1.05] font-extrabold tracking-[-0.045em]">
          All <span className="highlight">equipment</span>
        </h1>
        <p className="m-0 max-w-[560px] text-[17px] text-muted-foreground">
          Search, filter and sort run on the server, so results stay fast with thousands of machines.
        </p>
        <SearchBar params={params} urlKey={urlKey} />
      </div>

      <div className="mt-10 flex flex-col gap-6 lg:flex-row lg:items-start">
        <FilterPanel params={params} urlKey={urlKey} />
        <div className="flex min-w-0 flex-1 flex-col gap-[22px]">
          <ActiveChips params={params} total={total} />
          {isPending || isError ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3" aria-label="Loading equipment">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-[380px] animate-pulse rounded-[24px] bg-muted" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-[24px] border border-border bg-card px-6 py-16 text-center">
              <SearchX className="size-10 text-subtle" aria-hidden="true" />
              <p className="m-0 font-display text-2xl font-extrabold">No equipment matches your filters.</p>
              <p className="m-0 text-sm text-muted-foreground">Try a different search or clear the filters.</p>
              <Link
                href="/equipment"
                className="mt-2 inline-flex min-h-11 items-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground"
              >
                Clear all filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
                <EquipmentCard key={item.id} item={item} />
              ))}
            </div>
          )}
          {!isPending && !isError && <Pagination params={params} pages={pages} />}
        </div>
      </div>
    </div>
  );
}
