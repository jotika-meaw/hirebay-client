import axios from "axios";

// Axios client for the Express API (used by api-source.js in Phase W).
// JWTs come from /api/token and live in an in-memory cache; the cache is
// refreshed when missing or under 60 s from expiry, retried once on 401,
// and cleared on logout.
let cachedToken = null;
let cachedExpiry = 0;

export function clearToken() {
  cachedToken = null;
  cachedExpiry = 0;
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
  return fetchToken();
}

export const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });

api.interceptors.request.use(async (config) => {
  try {
    config.headers.Authorization = `Bearer ${await getToken()}`;
  } catch {
    // Logged out: public requests go out without an Authorization header.
  }
  return config;
});

api.interceptors.response.use(null, async (error) => {
  const original = error.config;
  if (error.response?.status === 401 && original && !original._retry) {
    original._retry = true;
    clearToken();
    try {
      original.headers.Authorization = `Bearer ${await getToken()}`;
    } catch {
      // Still logged out: rethrow the original 401 instead of failing on /api/token.
      throw error;
    }
    return api(original);
  }
  throw error;
});
