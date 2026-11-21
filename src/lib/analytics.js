// Pure helpers that turn the §5 analytics shapes into honest UI captions.
// Every number shown comes from the payload: monthly[] supplies this-month
// vs last-month counts, and completion divides completed by total bookings.
// Anything that cannot be derived returns null so callers hide the line.

const SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function monthLabel(yyyyMM) {
  const m = Number(String(yyyyMM ?? "").slice(5, 7));
  if (!Number.isInteger(m) || m < 1 || m > 12) return "";
  return SHORT_MONTHS[m - 1];
}

// Compare the last two months of a monthly[] list on `key`.
// Returns { pct, label, current, previous } or null when there are fewer
// than two months or the previous month is zero.
export function monthOverMonth(monthly, key) {
  if (!Array.isArray(monthly) || monthly.length < 2) return null;
  const cur = monthly[monthly.length - 1];
  const prev = monthly[monthly.length - 2];
  const current = Number(cur?.[key]);
  const previous = Number(prev?.[key]);
  if (!Number.isFinite(current) || !Number.isFinite(previous) || previous <= 0) return null;
  return {
    pct: Math.round(((current - previous) / previous) * 100),
    label: monthLabel(prev?.month),
    current,
    previous,
  };
}

// "56% completion" from completed/total; null when total is zero.
export function completionRate(completed, total) {
  const done = Number(completed) || 0;
  const all = Number(total) || 0;
  if (all <= 0) return null;
  return `${Math.round((done / all) * 100)}% completion`;
}
