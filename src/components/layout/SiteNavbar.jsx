"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Logo from "@/components/layout/Logo";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { authClient } from "@/lib/auth-client";
import { clearToken } from "@/lib/api";
import { openCommandMenu } from "@/components/layout/CommandMenu";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/equipment", label: "All Equipment" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

function isActiveLink(href, pathname) {
  if (href === "/") return pathname === "/";
  if (href === "/equipment") return pathname.startsWith("/equipment");
  return false;
}

function initials(name) {
  return String(name || "?")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function NavLink({ href, label, pathname, onNavigate }) {
  const active = isActiveLink(href, pathname);
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex min-h-11 items-center rounded-full px-4 py-2 text-sm font-semibold transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {label}
    </Link>
  );
}

export default function SiteNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user ?? null;
  const isLoggedIn = Boolean(user);

  async function handleLogout() {
    await authClient.signOut();
    clearToken();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-3 z-40 mx-auto w-full max-w-[1200px] px-3">
      <nav
        aria-label="Site"
        className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-full border border-border bg-card/90 py-2 pr-2 pl-4 shadow-sm backdrop-blur"
      >
        <Logo className="justify-self-start" />

        <div className="hidden items-center justify-self-center gap-1 min-[1080px]:flex">
          {LINKS.map((link) => (
            <NavLink key={link.href} {...link} pathname={pathname} />
          ))}
        </div>

        <div className="flex items-center justify-self-end gap-2">
          <button
            type="button"
            onClick={openCommandMenu}
            aria-label="Search equipment"
            className="hidden h-11 cursor-pointer items-center gap-2 rounded-full border border-input bg-card px-4 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:inline-flex"
          >
            <Search className="size-4" aria-hidden="true" />
            Search
            <kbd className="rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-[11px]">
              ⌘K
            </kbd>
          </button>
          <ThemeToggle />
          {isLoggedIn ? (
            <>
              <Link
                href="/dashboard"
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                Dashboard
              </Link>
              <Avatar className="size-11">
                <AvatarFallback className="bg-brand font-display text-sm font-extrabold text-brand-foreground">
                  {initials(user?.name)}
                </AvatarFallback>
              </Avatar>
              <Button size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden min-h-11 items-center rounded-full px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted sm:inline-flex"
              >
                Login
              </Link>
              <Link href="/register" className={buttonVariants({ size: "sm" })}>
                Register
              </Link>
            </>
          )}
          <Sheet>
            <SheetTrigger
              aria-label="Open menu"
              className="inline-flex size-11 items-center justify-center rounded-full border border-input bg-card text-foreground transition-colors hover:bg-muted min-[1080px]:hidden"
            >
              <Menu className="size-5" aria-hidden="true" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <div className="flex flex-col gap-1 p-4 pt-12">
                {LINKS.map((link) => (
                  <NavLink key={link.href} {...link} pathname={pathname} />
                ))}
                <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
                  {isLoggedIn ? (
                    <>
                      <Link
                        href="/dashboard"
                        className={buttonVariants({ className: "w-full" })}
                      >
                        Dashboard
                      </Link>
                      <Button className="w-full" onClick={handleLogout}>
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className={buttonVariants({
                          variant: "outline",
                          className: "w-full",
                        })}
                      >
                        Login
                      </Link>
                      <Link
                        href="/register"
                        className={buttonVariants({ className: "w-full" })}
                      >
                        Register
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
