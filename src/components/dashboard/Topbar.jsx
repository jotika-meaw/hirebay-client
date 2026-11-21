"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import ThemeToggle from "@/components/layout/ThemeToggle";

const TITLES = {
  "/dashboard": null, // set by the page (greeting / overview title)
  "/dashboard/rentals": { crumb: "My rentals", title: "My rentals" },
  "/dashboard/favorites": { crumb: "Favorites", title: "Favorites" },
  "/dashboard/profile": { crumb: "My profile", title: "My profile" },
  "/dashboard/owner/add": { crumb: "Add equipment", title: "Add equipment" },
  "/dashboard/owner/equipment": { crumb: "My equipment", title: "My equipment" },
  "/dashboard/owner/rentals": { crumb: "My equipment rentals", title: "My equipment rentals" },
  "/dashboard/admin/users": { crumb: "All users", title: "All users" },
  "/dashboard/admin/equipment": { crumb: "All equipment", title: "All equipment" },
  "/dashboard/admin/rentals": { crumb: "All rentals", title: "All rentals" },
};

const ROLE_LABEL = { customer: "Customer", owner: "Owner", admin: "Admin" };

// Topbar: breadcrumb + page title; right side search, theme toggle,
// bell with a yellow dot; owners also get "+ Add equipment".
export default function Topbar({ user, heading, crumb }) {
  const pathname = usePathname();
  const router = useRouter();
  const [term, setTerm] = useState("");
  const role = user?.role ?? "customer";
  const entry = TITLES[pathname];
  const title = heading ?? entry?.title ?? "Dashboard";
  const crumbLabel = crumb ?? entry?.crumb ?? title;

  return (
    <header className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-[28px] border border-border bg-card px-6 py-4">
      <div className="min-w-0 flex-1 basis-48">
        <p className="m-0 truncate text-xs text-muted-foreground">
          Dashboard / {ROLE_LABEL[role] ?? role} / {crumbLabel}
        </p>
        <h1 className="m-0 font-display text-[28px] font-extrabold tracking-[-0.035em]">{title}</h1>
      </div>
      <form
        role="search"
        className="hidden min-w-0 flex-1 basis-40 items-center gap-2 rounded-full border border-input bg-background px-4 sm:flex"
        onSubmit={(e) => {
          e.preventDefault();
          router.push(`/equipment?search=${encodeURIComponent(term.trim())}`);
        }}
      >
        <Search className="size-4 flex-none text-subtle" aria-hidden="true" />
        <span className="absolute h-px w-px overflow-hidden">Search equipment</span>
        <input
          type="search"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Search…"
          aria-label="Search equipment"
          className="min-h-11 w-full border-0 bg-transparent text-sm outline-0 placeholder:text-subtle"
        />
      </form>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <button
          type="button"
          aria-label="Notifications"
          onClick={() => toast.success("You're all caught up")}
          className="relative inline-flex size-11 items-center justify-center rounded-full border border-input bg-card text-foreground transition-colors hover:bg-muted"
        >
          <Bell className="size-5" aria-hidden="true" />
          <span aria-hidden="true" className="absolute top-2.5 right-2.5 size-2 rounded-full bg-brand ring-2 ring-card" />
        </button>
        {role === "owner" && (
          <Link
            href="/dashboard/owner/add"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5"
          >
            <Plus className="size-4" aria-hidden="true" /> Add equipment
          </Link>
        )}
      </div>
    </header>
  );
}
