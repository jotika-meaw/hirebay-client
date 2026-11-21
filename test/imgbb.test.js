import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { validateImage } from "../src/lib/imgbb.js";

const MB = 1024 * 1024;

describe("validateImage (audit follow-up)", () => {
  it("accepts images at or under 5 MB", () => {
    assert.equal(validateImage({ type: "image/jpeg", size: 1024 }), true);
    assert.equal(validateImage({ type: "image/png", size: 5 * MB }), true);
    assert.equal(validateImage({ type: "image/webp", size: 5 * MB - 1 }), true);
  });

  it("rejects non-image files", () => {
    assert.throws(() => validateImage({ type: "text/plain", size: 10 }), /image file/i);
    assert.throws(() => validateImage({ type: "application/pdf", size: 10 }), /image file/i);
    assert.throws(() => validateImage(null), /image file/i);
    assert.throws(() => validateImage({}), /image file/i);
  });

  it("rejects files over 5 MB", () => {
    assert.throws(() => validateImage({ type: "image/jpeg", size: 5 * MB + 1 }), /5 MB/);
    assert.throws(() => validateImage({ type: "image/png", size: 50 * MB }), /5 MB/);
  });
});
