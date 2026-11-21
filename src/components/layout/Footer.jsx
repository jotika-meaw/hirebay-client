import Link from "next/link";
import Logo from "@/components/layout/Logo";
import FooterWordmark from "@/components/layout/FooterWordmark";

function XLogo({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z" />
    </svg>
  );
}

function FacebookLogo({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073Z" />
    </svg>
  );
}

function LinkedInLogo({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
    </svg>
  );
}

function DockButton({ href, label, children }) {
  const inner = (
    <>
      {children}
      <span className="sr-only">{label}</span>
    </>
  );
  const className =
    "inline-flex size-11 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-brand hover:text-brand";
  if (href.startsWith("mailto:")) {
    return (
      <a
        href={href}
        aria-label={label}
        className="inline-flex size-11 items-center justify-center rounded-full bg-brand text-[#111111] transition-transform hover:-translate-y-0.5"
      >
        {children}
        <span className="sr-only">{label}</span>
      </a>
    );
  }
  return (
    <a href={href} aria-label={label} className={className}>
      {inner}
    </a>
  );
}

export function CompactFooter() {
  return (
    <footer className="bg-[#111111] text-white">
      <div className="hazard h-2.5" aria-hidden="true" />
      <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center justify-between gap-3 px-6 py-4">
        <Logo className="text-white [&_span:last-child]:text-lg" />
        <p className="text-sm text-white/70">
          © 2026 Hirebay · support@hirebay.app · Banani, Dhaka
        </p>
        <div className="flex items-center gap-2">
          <a
            href="https://x.com"
            aria-label="Hirebay on X"
            className="inline-flex size-11 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-brand hover:text-brand"
          >
            <XLogo className="size-4" />
          </a>
          <a
            href="https://facebook.com"
            aria-label="Hirebay on Facebook"
            className="inline-flex size-11 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-brand hover:text-brand"
          >
            <FacebookLogo className="size-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export function FullFooter() {
  return (
    <footer id="contact" className="bg-[#111111] text-white">
      <div className="hazard h-2.5" aria-hidden="true" />
      <div className="mx-auto grid w-full max-w-[1200px] gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo className="text-white" />
          <p className="mt-3 max-w-xs text-[15px] leading-7 text-white/70">
            The rental marketplace connecting equipment owners with the people
            who need their gear — across Bangladesh.
          </p>
          <div className="mt-5 flex items-center gap-2">
            <DockButton href="https://x.com" label="Hirebay on X">
              <XLogo className="size-4" />
            </DockButton>
            <DockButton href="https://facebook.com" label="Hirebay on Facebook">
              <FacebookLogo className="size-4" />
            </DockButton>
            <DockButton href="https://linkedin.com" label="Hirebay on LinkedIn">
              <LinkedInLogo className="size-4" />
            </DockButton>
            <DockButton href="mailto:support@hirebay.app" label="Email Hirebay">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="size-4"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </DockButton>
          </div>
        </div>
        <nav aria-label="Explore">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.1em] text-white/50">
            Explore
          </p>
          <ul className="mt-4 space-y-1 text-[15px] font-semibold">
            <li><Link href="/" className="inline-flex min-h-11 items-center hover:text-brand">Home</Link></li>
            <li><Link href="/equipment" className="inline-flex min-h-11 items-center hover:text-brand">All Equipment</Link></li>
            <li><Link href="/#how-it-works" className="inline-flex min-h-11 items-center hover:text-brand">How it works</Link></li>
            <li><Link href="/register?role=owner" className="inline-flex min-h-11 items-center hover:text-brand">Become an owner</Link></li>
          </ul>
        </nav>
        <nav aria-label="Categories">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.1em] text-white/50">
            Categories
          </p>
          <ul className="mt-4 space-y-1 text-[15px] font-semibold">
            <li><Link href="/equipment?category=Construction%20Equipment" className="inline-flex min-h-11 items-center hover:text-brand">Construction</Link></li>
            <li><Link href="/equipment?category=Photography%20Equipment" className="inline-flex min-h-11 items-center hover:text-brand">Photography</Link></li>
            <li><Link href="/equipment?category=Vehicles%20%26%20Transportation" className="inline-flex min-h-11 items-center hover:text-brand">Vehicles</Link></li>
            <li><Link href="/equipment?category=Event%20Equipment" className="inline-flex min-h-11 items-center hover:text-brand">Event equipment</Link></li>
          </ul>
        </nav>
        <div>
          <p className="font-mono text-xs font-medium uppercase tracking-[0.1em] text-white/50">
            Contact
          </p>
          <ul className="mt-4 space-y-1 text-[15px] font-semibold">
            <li><a href="mailto:support@hirebay.app" className="inline-flex min-h-11 items-center hover:text-brand">support@hirebay.app</a></li>
            <li><a href="tel:+8801700000000" className="inline-flex min-h-11 items-center hover:text-brand">+880 1700-000000</a></li>
            <li className="inline-flex min-h-11 items-center text-white/70">Banani, Dhaka 1213</li>
          </ul>
        </div>
      </div>
      <FooterWordmark />
      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center justify-between gap-2 px-6 py-4 text-sm text-white/60">
          <p>© 2026 Hirebay. All rights reserved.</p>
          <p className="font-mono text-xs tracking-wider">
            NEXT.JS · EXPRESS · MONGODB · STRIPE
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function Footer({ variant = "compact" }) {
  if (variant === "full") return <FullFooter />;
  return <CompactFooter />;
}
