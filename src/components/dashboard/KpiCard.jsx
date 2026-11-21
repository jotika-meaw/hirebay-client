import { cn } from "@/lib/utils";

// White KPI card: 13px muted label, Bricolage 30px value, delta line.
export default function KpiCard({ label, value, delta, deltaTone = "muted", className }) {
  return (
    <div className={cn("rounded-[22px] border border-border bg-card p-6", className)}>
      <p className="m-0 text-[13px] text-muted-foreground">{label}</p>
      <p className="m-0 mt-1 font-display text-[30px] font-extrabold tracking-[-0.03em]">{value}</p>
      {delta ? (
        <p
          className={cn(
            "m-0 mt-1 text-[13px] font-semibold",
            deltaTone === "success" && "text-success",
            deltaTone === "warning" && "text-warning",
            deltaTone === "info" && "text-info",
            deltaTone === "muted" && "text-muted-foreground"
          )}
        >
          {delta}
        </p>
      ) : null}
    </div>
  );
}
