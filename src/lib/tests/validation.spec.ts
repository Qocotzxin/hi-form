import { describe, expect, it, vi } from "vitest";
import { FormulaForm } from "../types";
import { generateForm } from "../utils/testing";
import { validationFns } from "../validation";

const { fields } = generateForm();

describe("Validation functions.", () => {
  describe("applyFieldValidation", () => {
    it("Should update then formData value for isValid field and use it to set the data error related attribute.", () => {
      const inputSpy = vi.spyOn(fields[0], "setAttribute");
      const formData: FormulaForm = {
        email: {
          isFocused: false,
          value: "",
          isValid: false,
          isTouched: false,
          isDirty: false,
        },
      };

      validationFns.applyFieldValidation(fields[0], formData);

      expect(formData.email.isValid).toBe(true);
      expect(inputSpy).toHaveBeenCalledWith("data-formula-error", "false");
    });

    it("Should call isInputValid and pass undefined when no validators are set.", () => {
      const isInputValidSpy = vi.spyOn(validationFns, "isInputValid");
      const formData: FormulaForm = {
        email: {
          isFocused: false,
          value: "",
          isValid: false,
          isTouched: false,
          isDirty: false,
        },
      };

      validationFns.applyFieldValidation(fields[0], formData);

      expect(isInputValidSpy).toHaveBeenCalledWith("", undefined);
    });

    it("Should call isInputValid and pass the validators when set.", () => {
      const isInputValidSpy = vi.spyOn(validationFns, "isInputValid");
      const formData: FormulaForm = {
        email: {
          isFocused: false,
          value: "test",
          isValid: false,
          isTouched: false,
          isDirty: false,
        },
      };

      validationFns.applyFieldValidation(fields[0], formData, {
        validators: [(e: string) => !!e],
      });

      expect(isInputValidSpy).toHaveBeenCalledWith("test", [
        expect.any(Function),
      ]);
    });
  });

  describe("isInputValid", () => {
    it("Should return true if there are no validations to run.", () => {
      const isValid = validationFns.isInputValid("", []);

      expect(isValid).toBe(true);
    });

    it("Should return true if all validations provided pass.", () => {
      const isValid = validationFns.isInputValid("test", [
        (v: string) => v.length > 1,
      ]);

      expect(isValid).toBe(true);
    });

    it("Should return false if at least one of the validations provided fails.", () => {
      const isValid = validationFns.isInputValid("test", [
        (v: string) => v.length > 1,
        (v: string) => v.length < 4,
      ]);

      expect(isValid).toBe(false);
    });
  });

  describe("required", () => {
    it("Should return true is there is a truthy value", () => {
      expect(validationFns.required("a")).toBe(true);
    });

    it("Should return false is there is a falsy value", () => {
      expect(validationFns.required("")).toBe(false);
    });
  });
});
