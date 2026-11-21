// Kicker pattern (03 §2): 10×10 yellow square with a 1px ink ring,
// then the mono uppercase label.
export default function Kicker({ children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-2 font-mono text-xs font-medium tracking-[0.1em] text-muted-foreground uppercase ${className}`}
    >
      <i aria-hidden="true" className="h-2.5 w-2.5 rounded-[2px] bg-brand shadow-[0_0_0_1px_#111111]" />
      {children}
    </span>
  );
}
