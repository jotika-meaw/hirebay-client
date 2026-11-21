import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Logo({ className }) {
  return (
    <Link
      href="/"
      aria-label="Hirebay home"
      className={cn("inline-flex min-h-11 items-center gap-2", className)}
    >
      <span
        aria-hidden="true"
        className="inline-flex size-9 items-center justify-center rounded-full bg-brand ring-2 ring-inset ring-[#111111]"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path
            d="M3 3v12M15 3v12M3 9h12M6 6.5 3 9l3 2.5M12 6.5 15 9l-3 2.5"
            stroke="#111111"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="font-display text-[21px] font-extrabold lowercase tracking-tight">
        hirebay
      </span>
    </Link>
  );
}
