"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Home, LayoutGrid, LogOut, Moon, Package, Plus, ReceiptText, Search, Sun, User } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { authClient } from "@/lib/auth-client";
import { clearToken } from "@/lib/api";
import { useEquipmentList } from "@/lib/data/hooks";
import { useTheme } from "next-themes";

const ALWAYS = [
  { label: "Home", href: "/", Icon: Home },
  { label: "All Equipment", href: "/equipment", Icon: Package },
];

const ROLE_LINKS = {
  customer: [
    { label: "My rentals", href: "/dashboard/rentals" },
    { label: "Favorites", href: "/dashboard/favorites" },
    { label: "Profile", href: "/dashboard/profile" },
  ],
  owner: [
    { label: "Overview", href: "/dashboard" },
    { label: "Add equipment", href: "/dashboard/owner/add" },
    { label: "My equipment", href: "/dashboard/owner/equipment" },
    { label: "My equipment rentals", href: "/dashboard/owner/rentals" },
    { label: "My profile", href: "/dashboard/profile" },
  ],
  admin: [
    { label: "Overview", href: "/dashboard" },
    { label: "All users", href: "/dashboard/admin/users" },
    { label: "All equipment", href: "/dashboard/admin/equipment" },
    { label: "All rentals", href: "/dashboard/admin/rentals" },
    { label: "My profile", href: "/dashboard/profile" },
  ],
};

// ⌘K / Ctrl+K command menu: equipment search + quick links by role +
// theme toggle. Opens from the navbar/menu buttons via the
// "hirebay:open-command" window event.
export default function CommandMenu() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const { resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const user = session?.user ?? null;
  const role = user?.role ?? null;

  useEffect(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    function onOpen() {
      setOpen(true);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("hirebay:open-command", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("hirebay:open-command", onOpen);
    };
  }, []);

  const term = query.trim();
  const { data: results } = useEquipmentList(
    { search: term, page: 1, limit: 5 },
    { enabled: open && term.length > 1 }
  );
  const hits = term.length > 1 ? (results?.items ?? []) : [];
  const links = role ? ROLE_LINKS[role] ?? [] : [];

  function go(href) {
    setOpen(false);
    setQuery("");
    router.push(href);
  }

  async function logout() {
    await authClient.signOut();
    clearToken();
    go("/");
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) setQuery("");
      }}
    >
      <DialogContent className="max-w-lg overflow-hidden p-0" aria-label="Command menu">
        <DialogTitle className="sr-only">Command menu</DialogTitle>
        <Command label="Site commands" shouldFilter={false} className="bg-card">
          <div className="flex items-center gap-2 border-b border-border px-4">
            <Search className="size-4 flex-none text-subtle" aria-hidden="true" />
            <Command.Input
              value={query}
              onValueChange={setQuery}
              placeholder="Search equipment or jump to…"
              className="min-h-12 w-full border-0 bg-transparent text-[15px] outline-0 placeholder:text-subtle"
            />
            <kbd className="flex-none rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
              esc
            </kbd>
          </div>
          <Command.List className="max-h-[320px] overflow-y-auto p-2">
            <Command.Empty className="px-3 py-6 text-center text-sm text-muted-foreground">
              No results found.
            </Command.Empty>
            {hits.length > 0 && (
              <Command.Group heading="Equipment">
                {hits.map((item) => (
                  <Command.Item
                    key={item.id}
                    value={`${item.name} ${item.location} ${item.category}`}
                    onSelect={() => go(user ? `/equipment/${item.id}` : `/login?redirect=/equipment/${item.id}`)}
                    className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium aria-selected:bg-muted"
                  >
                    <Package className="size-4 flex-none text-subtle" aria-hidden="true" />
                    <span className="min-w-0 flex-1 truncate">{item.name}</span>
                    <span className="flex-none text-xs text-muted-foreground">{item.location}</span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}
            <Command.Group heading="Go to">
              {ALWAYS.map(({ label, href, Icon }) => (
                <Command.Item
                  key={href}
                  value={label}
                  onSelect={() => go(href)}
                  className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium aria-selected:bg-muted"
                >
                  <Icon className="size-4 flex-none text-subtle" aria-hidden="true" />
                  {label}
                </Command.Item>
              ))}
              {links.map(({ label, href }) => (
                <Command.Item
                  key={href + label}
                  value={label}
                  onSelect={() => go(href)}
                  className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium aria-selected:bg-muted"
                >
                  <LayoutGrid className="size-4 flex-none text-subtle" aria-hidden="true" />
                  {label}
                </Command.Item>
              ))}
            </Command.Group>
            <Command.Group heading="Actions">
              <Command.Item
                value="Toggle theme"
                onSelect={() => {
                  setTheme(resolvedTheme === "dark" ? "light" : "dark");
                  setOpen(false);
                  setQuery("");
                }}
                className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium aria-selected:bg-muted"
              >
                {resolvedTheme === "dark" ? (
                  <Sun className="size-4 flex-none text-subtle" aria-hidden="true" />
                ) : (
                  <Moon className="size-4 flex-none text-subtle" aria-hidden="true" />
                )}
                Toggle theme
              </Command.Item>
              {!user ? (
                <>
                  <Command.Item
                    value="Log in"
                    onSelect={() => go("/login")}
                    className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium aria-selected:bg-muted"
                  >
                    <User className="size-4 flex-none text-subtle" aria-hidden="true" />
                    Log in
                  </Command.Item>
                  <Command.Item
                    value="Create an account"
                    onSelect={() => go("/register")}
                    className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium aria-selected:bg-muted"
                  >
                    <User className="size-4 flex-none text-subtle" aria-hidden="true" />
                    Create an account
                  </Command.Item>
                </>
              ) : (
                <Command.Item
                  value="Logout"
                  onSelect={logout}
                  className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-danger aria-selected:bg-danger-bg"
                >
                  <LogOut className="size-4 flex-none" aria-hidden="true" />
                  Logout
                </Command.Item>
              )}
            </Command.Group>
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

export function openCommandMenu() {
  window.dispatchEvent(new CustomEvent("hirebay:open-command"));
}
