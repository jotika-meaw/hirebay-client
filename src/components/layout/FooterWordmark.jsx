"use client";

import { useRef } from "react";

// Outlined footer wordmark with a cursor-reveal hover (Aceternity text-hover
// style): transparent fill + 1px ink stroke by default; a yellow radial
// gradient revealed only around the cursor via an overlay span. Touch
// devices and prefers-reduced-motion show the stroke only. Decorative:
// the real logo lives in the brand column.
export default function FooterWordmark() {
  const ref = useRef(null);

  function onMove(event) {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(hover: none), (prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    el.style.setProperty("--my", `${event.clientY - rect.top}px`);
    el.style.setProperty("--reveal", "1");
  }

  function onLeave() {
    ref.current?.style.setProperty("--reveal", "0");
  }

  const textClass =
    "px-2 py-6 text-center font-display text-[clamp(64px,12vw,180px)] leading-[0.9] font-extrabold lowercase tracking-[-0.05em] select-none";

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      aria-hidden="true"
      className="relative max-w-full overflow-hidden"
    >
      <p className={`${textClass} text-transparent [-webkit-text-stroke:1px_#2A2622]`}>
        hirebay
      </p>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 [opacity:var(--reveal,0)]"
      >
        <p
          className={`${textClass} text-transparent [-webkit-background-clip:text] [background-clip:text]`}
          style={{
            backgroundImage:
              "radial-gradient(circle 140px at var(--mx, 50%) var(--my, 50%), #FFC727 0%, transparent 70%)",
          }}
        >
          hirebay
        </p>
      </div>
    </div>
  );
}
