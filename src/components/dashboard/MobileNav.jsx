"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import Logo from "@/components/layout/Logo";
import { menuFor, useLogout } from "@/lib/dashboard-nav";
import { cn } from "@/lib/utils";

// Horizontal scroll strip replacing the sidebar at ≤ 860px.
export default function MobileNav({ user }) {
  const pathname = usePathname();
  const logout = useLogout();
  const items = menuFor(user?.role);

  return (
    <div className="flex items-center gap-2 overflow-x-auto rounded-full border border-border bg-card p-2 min-[860px]:hidden">
      <span className="flex-none pl-1">
        <Logo />
      </span>
      <nav aria-label="Dashboard" className="flex items-center gap-1">
        {items.map(({ href, label, Icon }) => {
          const active = href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "inline-flex min-h-11 flex-none items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap",
                active ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
              {label}
            </Link>
          );
        })}
      </nav>
      <button
        type="button"
        onClick={logout}
        aria-label="Logout"
        className="inline-flex size-11 flex-none items-center justify-center rounded-full text-danger transition-colors hover:bg-danger-bg"
      >
        <LogOut className="size-5" aria-hidden="true" />
      </button>
    </div>
  );
}
