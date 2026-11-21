import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export const metadata = {
  title: "Hirebay · Page not found",
};

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-background px-6 py-20 text-center">
      <p className="font-display text-[120px] leading-none font-extrabold tracking-[-0.05em] sm:text-[160px]">
        <span className="highlight">404</span>
      </p>
      <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
        This page is out on rent.
      </h1>
      <p className="mt-3 max-w-md text-[15px] leading-7 text-muted-foreground">
        The link may be broken or the listing was removed. Let&apos;s get you
        back to the yard.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className={buttonVariants()}>
          Back to home
        </Link>
        <Link
          href="/equipment"
          className={buttonVariants({ variant: "outline" })}
        >
          Browse equipment
        </Link>
      </div>
    </main>
  );
}
