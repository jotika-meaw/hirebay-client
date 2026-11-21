import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { safeRedirect } from "../src/lib/redirect.js";

const FALLBACK = "/dashboard";
const NL = String.fromCharCode(10);
const TAB = String.fromCharCode(9);

describe("safeRedirect", () => {
  it("allows same-origin relative paths", () => {
    assert.equal(safeRedirect("/dashboard/rentals"), "/dashboard/rentals");
    assert.equal(safeRedirect("/equipment?search=drill"), "/equipment?search=drill");
    assert.equal(safeRedirect("/"), "/");
  });

  it("rejects protocol-relative and backslash hosts", () => {
    assert.equal(safeRedirect("//evil.com"), FALLBACK);
    assert.equal(safeRedirect("//evil.com/path"), FALLBACK);
    assert.equal(safeRedirect("/\\evil.com"), FALLBACK);
  });

  it("rejects schemes and absolute URLs", () => {
    assert.equal(safeRedirect("javascript:alert(1)"), FALLBACK);
    assert.equal(safeRedirect("data:text/html,hi"), FALLBACK);
    assert.equal(safeRedirect("https://evil.com"), FALLBACK);
    assert.equal(safeRedirect("http://evil.com/x"), FALLBACK);
    assert.equal(safeRedirect("evil.com/path"), FALLBACK);
  });

  it("rejects control characters", () => {
    assert.equal(safeRedirect("/" + NL + "/evil.com"), FALLBACK);
    assert.equal(safeRedirect(TAB + "/dashboard"), FALLBACK);
  });

  it("rejects empty and non-string values", () => {
    assert.equal(safeRedirect(""), FALLBACK);
    assert.equal(safeRedirect("   "), FALLBACK);
    assert.equal(safeRedirect(null), FALLBACK);
    assert.equal(safeRedirect(undefined), FALLBACK);
    assert.equal(safeRedirect(123), FALLBACK);
  });

  it("honours a custom fallback", () => {
    assert.equal(safeRedirect("//evil.com", "/login"), "/login");
  });
});
