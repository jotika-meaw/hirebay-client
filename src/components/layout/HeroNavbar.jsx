"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Logo from "@/components/layout/Logo";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { openCommandMenu } from "@/components/layout/CommandMenu";
import { authClient } from "@/lib/auth-client";
import { clearToken } from "@/lib/api";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/equipment", label: "All Equipment" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

function initials(name) {
  return String(name || "?")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// Transparent navbar that lives inside the dark hero panel.
export default function HeroNavbar() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user ?? null;

  async function handleLogout() {
    await authClient.signOut();
    clearToken();
    router.push("/");
    router.refresh();
  }

  return (
    <nav aria-label="Main" className="flex items-center gap-2 px-5 py-5 sm:px-7 sm:py-6">
      <Link
        href="/"
        aria-label="Hirebay home"
        className="inline-flex min-h-11 items-center gap-2 pr-2 font-display text-[21px] font-extrabold lowercase tracking-[-0.04em] text-white"
      >
        <span
          aria-hidden="true"
          className="inline-flex size-[34px] items-center justify-center rounded-full bg-brand"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 4v16M18 4v16M6 12h12" />
          </svg>
        </span>
        hirebay
      </Link>
      <div className="mx-auto hidden items-center gap-0.5 min-[1080px]:flex">
        {LINKS.map((link, i) => (
          <Link
            key={link.href}
            href={link.href}
            aria-current={link.href === "/" ? "page" : undefined}
            className={cn(
              "rounded-full px-3.5 py-2 text-sm font-medium transition-colors hover:bg-white/10 hover:text-white",
              i === 0 ? "text-white" : "text-white/70"
            )}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <button
        type="button"
        onClick={openCommandMenu}
        aria-label="Search equipment, command menu"
        className="hidden h-11 cursor-pointer items-center gap-2 rounded-full border border-white/16 bg-white/6 px-3.5 text-[13px] text-white/75 transition-colors hover:bg-white/10 hover:text-white sm:inline-flex"
      >
        <Search className="size-[15px]" aria-hidden="true" />
        Search
        <kbd className="rounded-md border border-white/20 px-1.5 py-0.5 font-mono text-[11px]">
          ⌘K
        </kbd>
      </button>
      <ThemeToggle className="hidden border-white/16 bg-white/6 text-white hover:bg-white/10 hover:text-white sm:inline-flex" />
      {user ? (
        <>
          <Link
            href="/dashboard"
            className="hidden h-11 items-center rounded-full border border-white/25 px-4 text-sm font-semibold text-white transition-colors hover:bg-white/10 sm:inline-flex"
          >
            Dashboard
          </Link>
          <Avatar className="size-11">
            <AvatarFallback className="bg-brand font-display text-sm font-extrabold text-brand-foreground">
              {initials(user.name)}
            </AvatarFallback>
          </Avatar>
          <Button
            onClick={handleLogout}
            className="h-11 rounded-full bg-white px-[18px] text-sm text-[#111111] hover:bg-white/85"
          >
            Logout
          </Button>
        </>
      ) : (
        <>
          <Link
            href="/login"
            className="hidden min-h-11 items-center px-3 text-sm font-semibold text-white/85 transition-colors hover:text-white sm:inline-flex"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="inline-flex min-h-11 items-center rounded-full bg-white px-[18px] text-sm font-semibold text-[#111111] transition-transform duration-200 hover:-translate-y-0.5"
          >
            Register
          </Link>
        </>
      )}
      <Sheet>
        <SheetTrigger
          aria-label="Open menu"
          className="inline-flex size-11 items-center justify-center rounded-full border border-white/16 bg-white/6 text-white min-[1080px]:hidden"
        >
          <Menu className="size-5" aria-hidden="true" />
        </SheetTrigger>
        <SheetContent side="right" className="w-72">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <div className="flex flex-col gap-1 p-4 pt-12">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex min-h-11 items-center rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
              <div className="flex min-h-11 items-center justify-between px-4">
                <span className="text-sm font-semibold">Theme</span>
                <ThemeToggle />
              </div>
              {user ? (
                <>
                  <Link href="/dashboard" className="inline-flex min-h-11 items-center justify-center rounded-full border border-input bg-card px-4 text-sm font-semibold">
                    Dashboard
                  </Link>
                  <Button className="w-full" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" className="inline-flex min-h-11 items-center justify-center rounded-full border border-input bg-card px-4 text-sm font-semibold">
                    Login
                  </Link>
                  <Link href="/register" className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
}
