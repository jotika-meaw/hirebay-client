"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import ThemeToggle from "@/components/layout/ThemeToggle";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/equipment", label: "All Equipment" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

// Mobile menu for the hero navbar (sheet + theme row + auth links).
export default function HeroMobileMenu({ user, onLogout }) {
  return (
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
                <Button className="w-full" onClick={onLogout}>
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
  );
}
