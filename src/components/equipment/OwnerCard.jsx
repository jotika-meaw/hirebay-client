import Link from "next/link";
import { Badge } from "@/components/ui/badge";

function initials(name) {
  return String(name || "?")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// Owner card: avatar, name + verified badge, email · phone · since.
export default function OwnerCard({ owner }) {
  return (
    <div className="flex items-center gap-3.5 rounded-[20px] border border-border bg-card p-4">
      <span
        aria-hidden="true"
        className="flex size-[50px] flex-none items-center justify-center rounded-full bg-[#111111] font-extrabold text-white"
      >
        {initials(owner?.name)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] font-extrabold tracking-[0.06em] text-subtle">OWNER</span>
        <b className="block truncate">{owner?.name}</b>
        <span className="block truncate text-[13px] text-muted-foreground">
          {owner?.email} · {owner?.phone}{owner?.since ? ` · since ${owner.since}` : ""}
        </span>
      </span>
      <Badge variant="success" className="flex-none">✓ Verified</Badge>
    </div>
  );
}

// 404 state for unknown ids / non-approved items a visitor may not see.
export function EquipmentNotFound() {
  return (
    <div className="mx-auto flex w-full max-w-[1240px] flex-1 flex-col items-center justify-center px-7 py-20 text-center">
      <p className="font-display text-[96px] leading-none font-extrabold tracking-[-0.05em]">
        <span className="highlight">404</span>
      </p>
      <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight">
        This equipment is not available.
      </h1>
      <p className="mt-3 max-w-md text-[15px] leading-7 text-muted-foreground">
        The listing may have been removed or is awaiting approval. Let&apos;s get you back to the catalog.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-6 text-[15px] font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5"
        >
          Back to home
        </Link>
        <Link
          href="/equipment"
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-input bg-card px-6 text-[15px] font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:bg-muted"
        >
          Browse equipment
        </Link>
      </div>
    </div>
  );
}
