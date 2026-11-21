import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";

// The request interceptor must send public requests without a token when
// logged out, and the 401 retry must rethrow the original 401 when no
// token can be fetched. fetch (used for /api/token) and the API transport
// (axios adapter) are both stubbed — no browser, no network.
//
// A4: with NEXT_PUBLIC_AUTH_URL set, the auth client's get-session call
// resolves through the same fetch stub, so "no session → no /api/token
// fetch" is provable without a browser.
process.env.NEXT_PUBLIC_AUTH_URL = "http://test.local";

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

  it("attaches the Bearer token when /api/token succeeds", async () => {
    tokenFetch = async () => ({
      ok: true,
      json: async () => ({
        token: "test-jwt",
        expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
      }),
    });
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

  function sessionAwareFetch({ sessionData, onToken }) {
    return async (url, options) => {
      const target = String(url);
      if (target.includes("/get-session")) {
        const payload = sessionData === undefined ? null : sessionData;
        return {
          ok: true,
          status: 200,
          statusText: "OK",
          headers: new Headers({ "content-type": "application/json" }),
          json: async () => payload,
          text: async () => JSON.stringify(payload),
          clone() {
            return this;
          },
        };
      }
      if (target.endsWith("/api/token")) {
        onToken?.();
        return {
          ok: true,
          status: 200,
          statusText: "OK",
          headers: new Headers({ "content-type": "application/json" }),
          json: async () => ({
            token: "test-jwt",
            expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
          }),
          text: async () =>
            JSON.stringify({
              token: "test-jwt",
              expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
            }),
          clone() {
            return this;
          },
        };
      }
      throw new Error(`unexpected fetch: ${target}`);
    };
  }

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
});
