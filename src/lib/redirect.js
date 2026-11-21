// safeRedirect: only same-origin relative paths starting with a single slash.
// Rejects protocol-relative URLs, backslash hosts, schemes, control
// characters and non-strings. Fallback is /dashboard.

function hasControlChars(value) {
  for (const ch of value) {
    const code = ch.codePointAt(0);
    if (code < 32 || code === 127) return true;
  }
  return false;
}

export function safeRedirect(value, fallback = "/dashboard") {
  if (typeof value !== "string") return fallback;
  if (hasControlChars(value)) return fallback;
  const v = value.trim();
  if (!v.startsWith("/")) return fallback;
  if (v.startsWith("//") || v.startsWith("/\\")) return fallback;
  let url;
  try {
    url = new URL(v, "https://hirebay.local");
  } catch {
    return fallback;
  }
  if (url.origin !== "https://hirebay.local") return fallback;
  if (url.pathname.startsWith("//")) return fallback;
  return v || fallback;
}
