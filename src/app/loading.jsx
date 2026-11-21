import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-background px-6 py-20">
      <div
        role="status"
        aria-label="Loading Hirebay"
        className="w-full max-w-md rounded-[24px] border border-border bg-card p-8 text-center"
      >
        <span className="mx-auto inline-flex size-14 items-center justify-center rounded-2xl bg-brand text-brand-foreground">
          <Loader2 className="size-7 animate-spin" aria-hidden="true" />
        </span>
        <p className="mt-5 font-display text-2xl font-extrabold tracking-tight">
          Loading Hirebay…
        </p>
        <div
          className="mt-5 h-2 overflow-hidden rounded-full bg-muted"
          aria-hidden="true"
        >
          <div className="h-full w-1/2 animate-pulse rounded-full bg-brand" />
        </div>
        <div className="mt-6 grid grid-cols-3 gap-3" aria-hidden="true">
          <Skeleton className="aspect-[4/3] rounded-[18px]" />
          <Skeleton className="aspect-[4/3] rounded-[18px]" />
          <Skeleton className="aspect-[4/3] rounded-[18px]" />
        </div>
      </div>
    </main>
  );
}
