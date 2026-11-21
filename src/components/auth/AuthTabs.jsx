import Link from "next/link";
import { cn } from "@/lib/utils";

// Segmented Register / Log in control. The active tab is a yellow pill.
export default function AuthTabs({ active, redirect }) {
  const suffix = redirect ? `?redirect=${encodeURIComponent(redirect)}` : "";
  return (
    <div
      role="tablist"
      aria-label="Account"
      className="flex rounded-full border border-border bg-muted p-1"
    >
      <Link
        href={`/register${suffix}`}
        role="tab"
        aria-selected={active === "register"}
        className={cn(
          "flex-1 rounded-full py-3 text-center text-sm font-bold transition-colors",
          active === "register"
            ? "bg-brand text-brand-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Register
      </Link>
      <Link
        href={`/login${suffix}`}
        role="tab"
        aria-selected={active === "login"}
        className={cn(
          "flex-1 rounded-full py-3 text-center text-sm font-bold transition-colors",
          active === "login"
            ? "bg-brand text-brand-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Log in
      </Link>
    </div>
  );
}
