
// White card shell for dashboard tables and panels. Title row with an
// optional right-side action (filters, links).
export default function DataCard({ title, action, children, className = "" }) {
  return (
    <section className={`rounded-[22px] border border-border bg-card p-6 ${className}`}>
      {(title || action) && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          {title ? <h2 className="m-0 font-display text-xl font-extrabold tracking-tight">{title}</h2> : <span />}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
