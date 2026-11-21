"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Logo from "@/components/layout/Logo";
import { initials, menuFor, useLogout } from "@/lib/dashboard-nav";
import { cn } from "@/lib/utils";

const ROLE_BADGE = { customer: "success", owner: "info", admin: "brand" };

// Role-aware sidebar (03 §3). No "View as" switcher — the menu always
// reflects the signed-in user's role.
export default function Sidebar({ user }) {
  const pathname = usePathname();
  const logout = useLogout();
  const role = user?.role ?? "customer";
  const items = menuFor(role);

  return (
    <aside className="sticky top-4 hidden h-[calc(100vh-2rem)] w-64 flex-none flex-col gap-2 overflow-y-auto rounded-[28px] border border-border bg-card p-4 min-[860px]:flex">
      <div className="flex items-center gap-2 px-2 pt-1">
        <Logo />
        <Badge variant={ROLE_BADGE[role] ?? "neutral"} className="ml-auto capitalize">
          {role}
        </Badge>
      </div>
      <nav aria-label="Dashboard" className="mt-2 flex flex-col gap-1">
        {items.map(({ href, label, Icon }) => {
          const active = href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "inline-flex min-h-11 items-center gap-2.5 rounded-[14px] px-2.5 py-2 text-sm font-semibold transition-all",
                active ? "bg-primary text-primary-foreground" : "text-foreground hover:translate-x-[3px] hover:bg-muted"
              )}
            >
              <Icon className="size-[18px]" aria-hidden="true" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto flex flex-col gap-1 border-t border-border pt-3">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-2.5 rounded-[14px] px-2.5 py-2 text-sm font-semibold transition-all hover:translate-x-[3px] hover:bg-muted"
        >
          <House className="size-[18px]" aria-hidden="true" />
          Back to site
        </Link>
        <button
          type="button"
          onClick={logout}
          className="inline-flex min-h-11 items-center gap-2.5 rounded-[14px] px-2.5 py-2 text-sm font-semibold text-danger transition-all hover:translate-x-[3px] hover:bg-danger-bg"
        >
          <LogOut className="size-[18px]" aria-hidden="true" />
          Logout
        </button>
        <div className="mt-1 flex items-center gap-2.5 rounded-2xl border border-border p-2.5">
          <Avatar className="size-10">
            <AvatarFallback className="bg-brand font-display text-xs font-extrabold text-brand-foreground">
              {initials(user?.name)}
            </AvatarFallback>
          </Avatar>
          <span className="min-w-0">
            <b className="block truncate text-sm">{user?.name}</b>
            <span className="block truncate text-xs text-muted-foreground">{user?.email}</span>
          </span>
        </div>
      </div>
    </aside>
  );
}
