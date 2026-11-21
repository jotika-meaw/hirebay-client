import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";

// The request interceptor must send public requests without a token when
// logged out, and the 401 retry must rethrow the original 401 when no
// token can be fetched. fetch (used for /api/auth/get-session and
// /api/token) and the API transport (axios adapter) are both stubbed —
// no browser, no network.
//
// A4/A7: the session check is a plain same-origin fetch (no BetterAuth
// client), so "no session → no /api/token fetch" and the in-flight dedupe
// are provable without a browser.
describe("api token handling (audit A1)", () => {
  let realFetch;
  let tokenFetch;

  function fakeApi(status, data) {
    return async (config) => {
      if (status >= 400) {
        const error = new Error(`Request failed with status code ${status}`);
        error.config = config;
        error.response = { status, data, headers: {} };
        throw error;
      }
      return { data, status, statusText: "OK", headers: {}, config };
    };
  }

  function jsonResponse(payload, ok = true, status = 200) {
    return {
      ok,
      status,
      statusText: ok ? "OK" : "Error",
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => payload,
      text: async () => JSON.stringify(payload),
      clone() {
        return this;
      },
    };
  }

  // Routes get-session vs /api/token; anything else throws.
  function sessionAwareFetch({ sessionData, onToken, onSession }) {
    return async (url) => {
      const target = String(url);
      if (target.includes("/get-session")) {
        onSession?.();
        return jsonResponse(sessionData === undefined ? null : sessionData);
      }
      if (target.endsWith("/api/token")) {
        onToken?.();
        return jsonResponse({
          token: "test-jwt",
          expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
        });
      }
      throw new Error(`unexpected fetch: ${target}`);
    };
  }

  beforeEach(() => {
    realFetch = globalThis.fetch;
    tokenFetch = async () => {
      throw new Error("Not authenticated");
    };
    globalThis.fetch = (...args) => tokenFetch(...args);
  });

  afterEach(() => {
    globalThis.fetch = realFetch;
  });

  it("sends public requests without Authorization when logged out", async () => {
    const { api, clearToken } = await import("../src/lib/api.js");
    clearToken();
    let seen;
    await api.get("/equipment", {
      adapter: async (config) => {
        seen = config.headers?.get?.("Authorization") ?? config.headers?.Authorization;
        return { data: { items: [] }, status: 200, statusText: "OK", headers: {}, config };
      },
    });
    assert.equal(seen, undefined);
  });

  it("attaches the Bearer token when a session exists and /api/token succeeds", async () => {
    tokenFetch = sessionAwareFetch({ sessionData: { user: { id: "u1" } } });
    const { api, clearToken } = await import("../src/lib/api.js");
    clearToken();
    let seen;
    await api.get("/equipment", {
      adapter: async (config) => {
        seen = config.headers?.get?.("Authorization") ?? config.headers?.Authorization;
        return { data: { items: [] }, status: 200, statusText: "OK", headers: {}, config };
      },
    });
    assert.equal(seen, "Bearer test-jwt");
  });

  it("rethrows the original 401 when the retry cannot get a token", async () => {
    const { api, clearToken } = await import("../src/lib/api.js");
    clearToken();
    await assert.rejects(
      api.get("/equipment", { adapter: fakeApi(401, { message: "Unauthorized" }) }),
      (error) => error?.response?.status === 401
    );
  });

  it("no session → no /api/token fetch, no Authorization header (audit A4)", async () => {
    let tokenCalls = 0;
    tokenFetch = sessionAwareFetch({
      sessionData: null,
      onToken: () => {
        tokenCalls += 1;
      },
    });
    const { api, clearToken } = await import("../src/lib/api.js");
    clearToken();
    let seen = "unset";
    await api.get("/equipment", {
      adapter: async (config) => {
        seen = config.headers?.get?.("Authorization") ?? config.headers?.Authorization;
        return { data: { items: [] }, status: 200, statusText: "OK", headers: {}, config };
      },
    });
    assert.equal(seen, undefined);
    assert.equal(tokenCalls, 0);
  });

  it("dedupes in-flight session checks across concurrent requests (audit A7)", async () => {
    let sessionCalls = 0;
    let tokenCalls = 0;
    tokenFetch = sessionAwareFetch({
      sessionData: null,
      onSession: () => {
        sessionCalls += 1;
      },
      onToken: () => {
        tokenCalls += 1;
      },
    });
    const { api, clearToken } = await import("../src/lib/api.js");
    clearToken();
    const adapter = async (config) => ({ data: { items: [] }, status: 200, statusText: "OK", headers: {}, config });
    await Promise.all([api.get("/equipment", { adapter }), api.get("/stats/public", { adapter })]);
    assert.equal(sessionCalls, 1);
    assert.equal(tokenCalls, 0);
  });
});
