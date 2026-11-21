"use client";

import { useRouter } from "next/navigation";
import { useCategories } from "@/lib/data/hooks";
import { toCatalogSearch } from "@/lib/catalog-params";
import PriceRange from "@/components/catalog/PriceRange";
import { cn } from "@/lib/utils";

// Canonical category order (02 §4). Names double as the exact filter values.
const CATEGORY_ORDER = [
  "Construction Equipment",
  "Photography Equipment",
  "Vehicles & Transportation",
  "Agriculture Equipment",
  "Electronics",
  "Event Equipment",
];

const RENTAL_TYPES = [
  { id: "", label: "All" },
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
];

const AVAILABILITY = [
  { id: "", label: "Any" },
  { id: "available", label: "Available" },
  { id: "unavailable", label: "Unavailable" },
];

// Sticky filter card. Checkboxes and chips apply immediately; the price
// numbers are drafts applied by "Apply filters". Reset clears everything.
export default function FilterPanel({ params, urlKey }) {
  const router = useRouter();
  const { data: counts } = useCategories();
  const byCategory = {};
  for (const row of counts?.data ?? []) byCategory[row.category] = row.count;

  const selected = params.category ? params.category.split(",") : [];

  function push(next) {
    router.push(toCatalogSearch({ ...params, ...next, page: 1 }));
  }

  function toggleCategory(category) {
    const next = selected.includes(category)
      ? selected.filter((c) => c !== category)
      : [...selected, category];
    push({ category: next.join(",") });
  }

  function onApply(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let min = String(data.get("minPrice") ?? "").trim();
    let max = String(data.get("maxPrice") ?? "").trim();
    if (min !== "" && (Number.isNaN(Number(min)) || Number(min) < 0)) min = "";
    if (max !== "" && (Number.isNaN(Number(max)) || Number(max) < 0)) max = "";
    if (min !== "" && max !== "" && Number(min) > Number(max)) [min, max] = [max, min];
    push({ minPrice: min, maxPrice: max });
  }

  return (
    <aside
      aria-label="Filters"
      className="flex w-full flex-col gap-[22px] self-start rounded-[24px] border border-border bg-card p-[22px] lg:sticky lg:top-24 lg:w-[280px] lg:flex-none"
    >
      <div className="flex items-center justify-between">
        <b className="text-[17px]">Filters</b>
        <button
          type="button"
          onClick={() => router.push("/equipment")}
          className="min-h-11 px-2 text-sm font-bold text-link"
        >
          Reset
        </button>
      </div>
      <fieldset className="m-0 flex flex-col gap-1.5 border-0 p-0">
        <legend className="mb-2 text-xs font-extrabold tracking-[0.06em] text-subtle uppercase">
          Category
        </legend>
        {CATEGORY_ORDER.map((category) => (
          <label key={category} className="flex min-h-[34px] cursor-pointer items-center gap-2.5 text-sm">
            <input
              type="checkbox"
              checked={selected.includes(category)}
              onChange={() => toggleCategory(category)}
              className="size-[18px] flex-none accent-brand"
            />
            <span className="flex-1">{category}</span>
            <span className="font-mono text-xs text-subtle">{byCategory[category] ?? 0}</span>
          </label>
        ))}
      </fieldset>
      <fieldset className="m-0 border-0 p-0">
        <legend className="mb-2 text-xs font-extrabold tracking-[0.06em] text-subtle uppercase">
          Rental type
        </legend>
        <div className="flex flex-wrap gap-1.5">
          {RENTAL_TYPES.map((t) => {
            const on = (params.rentalType || "") === t.id;
            return (
              <button
                key={t.id}
                type="button"
                aria-pressed={on}
                onClick={() => push({ rentalType: t.id })}
                className={cn(
                  "min-h-11 rounded-full border px-4 text-sm font-semibold transition-colors",
                  on
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:bg-muted"
                )}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </fieldset>
      <form onSubmit={onApply} className="m-0 border-0 p-0">
        <fieldset className="m-0 flex flex-col gap-3 border-0 p-0">
          <legend className="text-xs font-extrabold tracking-[0.06em] text-subtle uppercase">
            Price range (৳)
          </legend>
          <PriceRange key={urlKey} min={params.minPrice} max={params.maxPrice} />
          <button
            type="submit"
            className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-primary px-4 text-[15px] font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5"
          >
            Apply filters
          </button>
        </fieldset>
      </form>
      <fieldset className="m-0 border-0 p-0">
        <legend className="mb-2 text-xs font-extrabold tracking-[0.06em] text-subtle uppercase">
          Availability
        </legend>
        <div className="flex flex-wrap gap-1.5">
          {AVAILABILITY.map((a) => {
            const on = (params.availability || "") === a.id;
            return (
              <button
                key={a.id}
                type="button"
                aria-pressed={on}
                onClick={() => push({ availability: a.id })}
                className={cn(
                  "min-h-11 rounded-full border px-4 text-sm font-semibold transition-colors",
                  on
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:bg-muted"
                )}
              >
                {a.label}
              </button>
            );
          })}
        </div>
      </fieldset>
    </aside>
  );
}
