// Fluid gradient backdrop: four drifting radial blobs, a dark vertical
// overlay, then an SVG-noise grain. Blobs animate transform-only; under
// prefers-reduced-motion the global CSS rule freezes them in place.
export default function FluidGradient() {
  return (
    <div aria-hidden="true" className="absolute inset-0 -z-0 overflow-hidden">
      <span className="fb f1" />
      <span className="fb f2" />
      <span className="fb f3" />
      <span className="fb f4" />
      <span className="absolute inset-0 bg-[linear-gradient(180deg,#111111_0%,rgba(17,17,17,.78)_34%,rgba(17,17,17,.1)_78%,transparent_100%)]" />
      <span className="grain" />
    </div>
  );
}
