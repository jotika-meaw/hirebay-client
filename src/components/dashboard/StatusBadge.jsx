import { Badge } from "@/components/ui/badge";

// Status → badge variant mapping (03 §3). The label is passed as children
// so tables control exact text ("● 2 available", "Paid", ...).
const MAP = {
  approved: "success",
  paid: "success",
  available: "success",
  pending: "warning",
  unpaid: "warning",
  rejected: "danger",
  cancelled: "danger",
  unavailable: "danger",
  confirmed: "info",
  owner: "info",
  completed: "neutral",
  customer: "neutral",
  admin: "brand",
};

export function statusVariant(status) {
  return MAP[String(status ?? "").toLowerCase()] ?? "neutral";
}

export function titleCase(value) {
  return String(value ?? "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function StatusBadge({ status, children, className }) {
  return (
    <Badge variant={statusVariant(status)} className={className}>
      {children ?? titleCase(status)}
    </Badge>
  );
}
