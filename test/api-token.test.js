import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";

// The request interceptor must send public requests without a token when
// logged out, and the 401 retry must rethrow the original 401 when no
// token can be fetched. fetch (used for /api/token) and the API transport
// (axios adapter) are both stubbed — no browser, no network.
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
});
