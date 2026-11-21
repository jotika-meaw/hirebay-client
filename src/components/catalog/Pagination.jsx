"use client";

import { useRouter } from "next/navigation";
import { toCatalogSearch } from "@/lib/catalog-params";
import { cn } from "@/lib/utils";

// Numbered pagination (‹ 1 2 3 … 15 ›). Current page is yellow with an
// ink ring. Navigating pushes the page into the URL so reload and the
// back button work.
export default function Pagination({ params, pages }) {
  const router = useRouter();
  const current = params.page;

  if (pages <= 1) return null;

  const numbers = [];
  for (let p = 1; p <= pages; p++) {
    if (p === 1 || p === pages || Math.abs(p - current) <= 1) numbers.push(p);
  }

  function go(page) {
    router.push(toCatalogSearch({ ...params, page }));
    const smooth = typeof window !== "undefined" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
  }

  const items = [];
  let prev = 0;
  for (const p of numbers) {
    if (p - prev > 1) {
      items.push(
        <span key={`e-${p}`} aria-hidden="true" className="inline-flex min-h-11 min-w-11 items-center justify-center text-muted-foreground">
          …
        </span>
      );
    }
    items.push(
      <button
        key={p}
        type="button"
        onClick={() => go(p)}
        aria-label={`Page ${p}`}
        aria-current={p === current ? "page" : undefined}
        className={cn(
          "inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border px-3 text-sm font-semibold transition-colors",
          p === current
            ? "border-[#111111] bg-brand text-[#111111] shadow-[0_0_0_1px_#111111]"
            : "border-border bg-card text-foreground hover:bg-muted"
        )}
      >
        {p}
      </button>
    );
    prev = p;
  }

  return (
    <nav aria-label="Pagination" className="mt-2.5 flex flex-wrap justify-center gap-2">
      <button
        type="button"
        onClick={() => go(current - 1)}
        disabled={current <= 1}
        aria-label="Previous page"
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-muted disabled:opacity-40"
      >
        ‹
      </button>
      {items}
      <button
        type="button"
        onClick={() => go(current + 1)}
        disabled={current >= pages}
        aria-label="Next page"
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-muted disabled:opacity-40"
      >
        ›
      </button>
    </nav>
  );
}
