"use client";

import { useRouter } from "next/navigation";
import { ChevronDown, MapPin, Search } from "lucide-react";
import { toCatalogSearch } from "@/lib/catalog-params";

// Name + location search bar with sort. Inputs are uncontrolled and keyed
// by their URL values, so typing never fights the URL and back/forward
// restores them; Search pushes page 1.
export default function SearchBar({ params, urlKey }) {
  const router = useRouter();

  function apply(next = {}) {
    router.push(toCatalogSearch({ ...params, page: 1, ...next }));
  }

  function onSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    apply({
      search: String(data.get("name") ?? "").trim(),
      location: String(data.get("location") ?? "").trim(),
    });
  }

  return (
    <form
      role="search"
      onSubmit={onSubmit}
      className="mx-auto mt-[22px] flex w-full max-w-[780px] flex-wrap items-stretch gap-1.5 rounded-[22px] border border-border bg-card p-2"
    >
      <label className="flex min-h-11 min-w-0 flex-[1_1_220px] items-center gap-2.5 px-3.5">
        <Search className="size-[18px] flex-none text-subtle" aria-hidden="true" />
        <span className="absolute h-px w-px overflow-hidden">Search by name</span>
        <input
          type="search"
          name="name"
          defaultValue={params.search}
          key={`n-${urlKey}`}
          placeholder="Equipment name…"
          className="min-h-11 w-full border-0 bg-transparent text-[15px] outline-0 placeholder:text-subtle"
        />
      </label>
      <label className="flex min-h-11 min-w-0 flex-[1_1_160px] items-center gap-2.5 border-border px-3.5 min-[640px]:border-l">
        <MapPin className="size-[18px] flex-none text-subtle" aria-hidden="true" />
        <span className="absolute h-px w-px overflow-hidden">Search by location</span>
        <input
          type="search"
          name="location"
          defaultValue={params.location}
          key={`l-${urlKey}`}
          placeholder="Location…"
          className="min-h-11 w-full border-0 bg-transparent text-[15px] outline-0 placeholder:text-subtle"
        />
      </label>
      <label className="flex min-h-11 items-center gap-2 border-border px-2.5 text-[13px] text-muted-foreground min-[640px]:border-l">
        Sort
        <span className="relative inline-flex items-center">
          <select
            value={params.sort}
            onChange={(e) => apply({ sort: e.target.value })}
            aria-label="Sort equipment"
            className="min-h-11 cursor-pointer appearance-none rounded-[14px] border border-input bg-card pr-8 pl-3 text-[13px] font-semibold text-foreground outline-0 focus-visible:border-foreground"
          >
            <option value="newest">Recently added</option>
            <option value="price_asc">Price: low to high</option>
            <option value="price_desc">Price: high to low</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 size-4" aria-hidden="true" />
        </span>
      </label>
      <button
        type="submit"
        className="inline-flex min-h-11 flex-none items-center justify-center rounded-[14px] bg-primary px-6 text-[15px] font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5"
      >
        Search
      </button>
    </form>
  );
}
