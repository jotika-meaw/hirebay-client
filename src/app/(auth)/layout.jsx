import Image from "next/image";
import Logo from "@/components/layout/Logo";

const COLLAGE_LEFT = ["/images/cinema.jpg", "/images/excavator.jpg", "/images/van.jpg"];
const COLLAGE_RIGHT = ["/images/generator.jpg", "/images/tractor.jpg", "/images/stage.jpg"];

// Split-screen shell for /login and /register: form column + photo collage.
// Copy: design/source/Site.dc.html (register/login).
export default function AuthLayout({ children }) {
  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-2">
      <main className="flex flex-col px-6 py-6 sm:px-14 sm:py-8">
        <Logo />
        <div className="m-auto w-full max-w-[470px] py-10">
          <div className="flex flex-col gap-4 rounded-[30px] border border-border bg-card p-6 sm:p-8">
            {children}
          </div>
        </div>
      </main>
      <aside
        aria-hidden="true"
        className="relative m-4 ml-0 hidden overflow-hidden rounded-[32px] bg-[#111111] lg:block"
      >
        <div className="absolute inset-x-6 -top-10 grid rotate-[-5deg] scale-108 grid-cols-2 gap-3.5">
          <div className="flex flex-col gap-3.5">
            {COLLAGE_LEFT.map((src) => (
              <div key={src} className="relative aspect-[3/4] overflow-hidden rounded-[20px]">
                <Image src={src} alt="" fill sizes="25vw" className="object-cover" />
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-3.5 pt-10">
            {COLLAGE_RIGHT.map((src) => (
              <div key={src} className="relative aspect-[3/4] overflow-hidden rounded-[20px]">
                <Image src={src} alt="" fill sizes="25vw" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(17,17,17,0.15)] to-[rgba(17,17,17,0.92)]" />
        <div className="absolute right-8 bottom-8 left-8 flex flex-col gap-3.5 text-white">
          <span className="inline-flex items-center gap-2 self-start rounded-full border border-white/30 bg-white/15 px-3 py-1.5 font-mono text-xs font-medium tracking-[0.1em] uppercase">
            <span className="size-2.5 bg-brand" aria-hidden="true" />
            1,240+ approved listings
          </span>
          <p className="font-display text-[38px] leading-[1.08] font-extrabold tracking-[-0.04em]">
            One account. Rent gear or list your own.
          </p>
          <figure className="rounded-[20px] border border-white/25 bg-white/14 p-4 backdrop-blur-md">
            <blockquote className="text-[15px]">
              “Listed two generators on a Friday. Both were booked by Monday.”
            </blockquote>
            <figcaption className="mt-2 text-xs opacity-85">
              Rakib U. · Owner · Narayanganj
            </figcaption>
          </figure>
        </div>
      </aside>
    </div>
  );
}
