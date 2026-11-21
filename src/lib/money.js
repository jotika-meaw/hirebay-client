// Money + date display. Amounts are integer BDT.

const bdt = new Intl.NumberFormat("en-IN");

export function formatBDT(amount) {
  return `৳${bdt.format(amount)}`;
}

function trim2(value) {
  return String(parseFloat(value.toFixed(2)));
}

// Lakh/crore shorthand for KPI cards only.
export function formatCompactBDT(amount) {
  if (amount >= 10000000) return `৳${trim2(amount / 10000000)} Cr`;
  if (amount >= 100000) return `৳${trim2(amount / 100000)}L`;
  return formatBDT(amount);
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function formatDate(iso) {
  const d = new Date(iso);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}
