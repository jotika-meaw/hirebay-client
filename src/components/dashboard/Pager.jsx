import { cn } from "@/lib/utils";

// Previous / Next pager with a "Showing x–y of z" label.
export default function Pager({ page, pages, total, limit, onPage, className }) {
  if (!pages || pages <= 1) {
    return total > 0 ? (
      <p className={cn("m-0 mt-4 text-[13px] text-muted-foreground", className)}>
        Showing 1–{total} of {total}
      </p>
    ) : null;
  }
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);
  return (
    <div className={cn("mt-4 flex flex-wrap items-center justify-between gap-3", className)}>
      <p className="m-0 text-[13px] text-muted-foreground">
        Showing {from}–{to} of {total}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onPage(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
          className="inline-flex min-h-11 items-center rounded-full border border-input bg-card px-5 text-sm font-semibold transition-colors hover:bg-muted disabled:opacity-40"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => onPage(page + 1)}
          disabled={page >= pages}
          aria-label="Next page"
          className="inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
