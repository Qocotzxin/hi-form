import { describe, expect, it } from "vitest";
import { isString } from "../../utils/type-helpers";

describe("Type helper functions.", () => {
  describe("isString", () => {
    it("Should return true if the value is a string.", () => {
      expect(isString("a")).toBe(true);
    });

    it("Should return true if the value is NOT a string.", () => {
      expect(isString(1)).toBe(false);
    });
  });
});
