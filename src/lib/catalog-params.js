import { useSearchParams } from "next/navigation";

// Single source of truth for the catalog URL params (F-16). Every filter,
// search, sort and page lives in the URL: reload restores them and the back
// button works. `sort=newest` and `page=1` are defaults and stay out of
// the URL; everything else round-trips verbatim.
export const LIMIT = 9;

export function readCatalogParams(sp) {
  const get = (key) => sp.get(key) ?? "";
  return {
    search: get("search"),
    location: get("location"),
    category: get("category"),
    rentalType: get("rentalType"),
    minPrice: get("minPrice"),
    maxPrice: get("maxPrice"),
    availability: get("availability"),
    sort: get("sort") || "newest",
    page: Math.max(1, Number(sp.get("page")) || 1),
  };
}

export function catalogQuery(params) {
  return {
    search: params.search || undefined,
    location: params.location || undefined,
    category: params.category || undefined,
    rentalType: params.rentalType || undefined,
    minPrice: params.minPrice || undefined,
    maxPrice: params.maxPrice || undefined,
    availability: params.availability || undefined,
    sort: params.sort,
    page: params.page,
    limit: LIMIT,
  };
}

// Serialize back to a query string, omitting defaults and empties.
export function toCatalogSearch(params) {
  const out = new URLSearchParams();
  for (const key of ["search", "location", "category", "rentalType", "minPrice", "maxPrice", "availability"]) {
    if (params[key]) out.set(key, params[key]);
  }
  if (params.sort && params.sort !== "newest") out.set("sort", params.sort);
  if (params.page && params.page > 1) out.set("page", String(params.page));
  const s = out.toString();
  return s ? `/equipment?${s}` : "/equipment";
}

export function useCatalogParams() {
  return readCatalogParams(useSearchParams());
}

export function formatPriceShort(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "";
  return n >= 1000 ? `${Math.round(n / 100) / 10}k`.replace(/\.0k$/, "k") : String(n);
}
