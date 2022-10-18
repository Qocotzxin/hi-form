import { describe, expect, it } from "vitest";
import { createFormData } from "../data";
import { generateForm } from "../utils/testing";

const { fields } = generateForm();

describe("Data functions.", () => {
  describe("createFormData", () => {
    it("Should return an object of type FormulaForm per input/textarea/select.", () => {
      expect(createFormData(fields)).toEqual({
        email: {
          value: "",
          isValid: true,
          isTouched: false,
          isFocused: false,
          isDirty: false,
        },
        comments: {
          value: "",
          isValid: true,
          isTouched: false,
          isFocused: false,
          isDirty: false,
        },
      });
    });

    it("Should return an empty object when an empty array is passed (no inputs provided).", () => {
      expect(createFormData([])).toEqual({});
    });
  });
});
