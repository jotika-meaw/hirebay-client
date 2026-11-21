"use client";

import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function Error({ reset }) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-background px-6 py-20 text-center">
      <div className="w-full max-w-md rounded-[24px] border border-border bg-card p-8">
        <span className="mx-auto inline-flex size-14 items-center justify-center rounded-2xl bg-danger-bg text-danger">
          <TriangleAlert className="size-7" aria-hidden="true" />
        </span>
        <h1 className="mt-5 font-display text-3xl font-extrabold tracking-tight">
          Something went wrong
        </h1>
        <p className="mt-3 text-[15px] leading-7 text-muted-foreground">
          We couldn&apos;t load this page. Your data is safe — try again, or
          head home.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className={buttonVariants()}
          >
            Try again
          </button>
          <Link
            href="/"
            className={buttonVariants({ variant: "outline" })}
          >
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
