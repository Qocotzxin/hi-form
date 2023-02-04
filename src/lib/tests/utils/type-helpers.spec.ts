import { describe, expect, it } from "vitest";
import {
  isString,
  isRadio,
  isCheckbox,
  returnValueOrType,
} from "../../utils/type-helpers";

const checkbox = document.createElement("input");
checkbox.setAttribute("type", "checkbox");

const radio = document.createElement("input");
radio.setAttribute("type", "radio");

const div = document.createElement("div");

describe("Type helper functions.", () => {
  describe("isString", () => {
    it("Should return true if the value is a string.", () => {
      expect(isString("a")).toBe(true);
    });

    it("Should return true if the value is NOT a string.", () => {
      expect(isString(1)).toBe(false);
    });
  });

  describe("isRadio", () => {
    it("Should return true if the element is an input of type radio.", () => {
      expect(isRadio(radio)).toBe(true);
    });

    it("Should return false if the element is NOT an input.", () => {
      // @ts-ignore - Ignore to test a scenario with different element.
      expect(isRadio(div)).toBe(false);
    });

    it("Should return false if the element is an input with a type other than radio.", () => {
      expect(isRadio(checkbox)).toBe(false);
    });
  });

  describe("isCheckbox", () => {
    it("Should return true if the element is an input of type checkbox.", () => {
      expect(isCheckbox(checkbox)).toBe(true);
    });

    it("Should return false if the element is NOT an input.", () => {
      // @ts-ignore - Ignore to test a scenario with different element.
      expect(isCheckbox(div)).toBe(false);
    });

    it("Should return false if the element is an input with a type other than checkbox.", () => {
      expect(isCheckbox(radio)).toBe(false);
    });
  });

  describe("returnValueOrType", () => {
    it("Should return the default boolean when value is undefined.", () => {
      expect(returnValueOrType(undefined, true)).toBe(true);
    });

    it("Should return the value when it's defined.", () => {
      expect(returnValueOrType(true, false)).toBe(true);
    });
  });
});
