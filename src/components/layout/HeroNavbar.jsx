"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useReducedMotion } from "motion/react";
import { Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Logo from "@/components/layout/Logo";
import HeroMobileMenu from "@/components/layout/HeroMobileMenu";
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

// Transparent navbar that lives inside the dark hero panel. Past ~80px of
// scroll it pins to the viewport top as a dark glass pill (sentinel +
// IntersectionObserver); a placeholder keeps the page from jumping.
export default function HeroNavbar() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user ?? null;
  const [stuck, setStuck] = useState(false);
  const [barHeight, setBarHeight] = useState(0);
  const barRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const sentinel = document.getElementById("hero-navbar-sentinel");
    if (!sentinel) return;
    const io = new IntersectionObserver(([entry]) => setStuck(!entry.isIntersecting), {
      threshold: 0,
    });
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (stuck) return;
    const measure = () => {
      if (barRef.current) setBarHeight(barRef.current.offsetHeight);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [stuck]);

  async function handleLogout() {
    await authClient.signOut();
    clearToken();
    router.push("/");
    router.refresh();
  }

  return (
    <>
      {stuck && barHeight > 0 ? <div aria-hidden="true" style={{ height: barHeight }} /> : null}
      <nav
        ref={barRef}
        aria-label="Main"
        className={cn(
          "grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-5 py-5 sm:px-7 sm:py-6",
          reduceMotion
            ? "transition-none"
            : "transition-[background-color,border-color,padding,border-radius,box-shadow] duration-200",
          stuck
            ? "fixed top-3 left-1/2 z-40 w-[min(1200px,calc(100%-1.5rem))] -translate-x-1/2 rounded-full border border-white/[0.08] bg-[#111111]/85 py-2 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:py-2"
            : "border border-transparent bg-transparent"
        )}
      >
      <Link
        href="/"
        aria-label="Hirebay home"
        className="col-start-1 inline-flex min-h-11 items-center justify-self-start gap-2 pr-2 font-display text-[21px] font-extrabold lowercase tracking-[-0.04em] text-white"
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
      <div className="col-start-2 hidden items-center justify-self-center gap-0.5 min-[1080px]:flex">
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
      <div className="col-start-3 flex items-center justify-self-end gap-2">
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
      <HeroMobileMenu user={user} onLogout={handleLogout} />
      </div>
      </nav>
    </>
  );
}
