import axios from "axios";

// Axios client for the Express API (used by api-source.js in Phase W).
// JWTs come from /api/token and live in an in-memory cache; the cache is
// refreshed when missing or under 60 s from expiry, retried once on 401,
// and cleared on logout. Logged-out visitors never touch /api/token:
// getToken() first checks the BetterAuth session and returns null
// (no Authorization header, no failing request) when there is none.
let cachedToken = null;
let cachedExpiry = 0;

export function clearToken() {
  cachedToken = null;
  cachedExpiry = 0;
}

// true = session, false = logged out, null = unknown (non-browser env).
// Whether a BetterAuth session exists, via a plain same-origin fetch —
// never the BetterAuth client store, so a stuck client can never block API
// calls. true = session, false = logged out, null = unknown (non-browser
// env or unreachable endpoint) → fall through to /api/token. In-flight
// checks are shared so a burst of API calls issues a single get-session.
let sessionCheck = null;

async function checkSession() {
  try {
    const res = await fetch("/api/auth/get-session", { credentials: "same-origin" });
    if (!res.ok) return false;
    const data = await res.json().catch(() => null);
    return Boolean(data?.user);
  } catch {
    return null;
  }
}

async function hasSession() {
  if (!sessionCheck) {
    sessionCheck = checkSession().finally(() => {
      sessionCheck = null;
    });
  }
  return sessionCheck;
}

async function fetchToken() {
  const res = await fetch("/api/token", { credentials: "same-origin" });
  if (!res.ok) throw new Error("Not authenticated");
  const { token, expiresAt } = await res.json();
  cachedToken = token;
  cachedExpiry = new Date(expiresAt).getTime();
  return token;
}

async function getToken() {
  if (cachedToken && Date.now() < cachedExpiry - 60 * 1000) return cachedToken;
  if ((await hasSession()) === false) return null;
  return fetchToken();
}

export const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });

api.interceptors.request.use(async (config) => {
  try {
    const token = await getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch {
    // No usable token: public requests go out without an Authorization header.
  }
  return config;
});

api.interceptors.response.use(null, async (error) => {
  const original = error.config;
  if (error.response?.status === 401 && original && !original._retry) {
    original._retry = true;
    clearToken();
    try {
      const token = await getToken();
      if (!token) throw error;
      original.headers.Authorization = `Bearer ${token}`;
    } catch {
      // No session (or bridge unreachable): rethrow the original 401 instead
      // of failing on /api/token.
      throw error;
    }
    return api(original);
  }
  throw error;
});
