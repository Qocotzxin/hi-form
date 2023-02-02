import { describe, expect, it, vi } from "vitest";
import { generateForm, generateFormData } from "../utils/testing";
import { FormulaValidators, validationFns } from "../validation";

const { fields } = generateForm();

describe("Validation functions.", () => {
  describe("applyFieldValidation", () => {
    it("Should update then formData value for isValid field and use it to set the data error related attribute.", () => {
      const inputSpy = vi.spyOn(fields[0], "setAttribute");
      const formData = generateFormData();

      validationFns.applyFieldValidation(fields[0], formData);

      expect(formData.email.isValid).toBe(true);
      expect(formData.email.errors).toEqual([]);
      expect(inputSpy).toHaveBeenCalledWith("aria-invalid", "false");
    });

    it("Should call isInputValid and pass undefined when no validators are set.", () => {
      const isInputValidSpy = vi.spyOn(validationFns, "isInputValid");
      const formData = generateFormData();

      validationFns.applyFieldValidation(fields[0], formData);

      expect(isInputValidSpy).toHaveBeenCalledWith("", undefined);
    });

    it("Should call isInputValid and pass the validators when set.", () => {
      const isInputValidSpy = vi.spyOn(validationFns, "isInputValid");
      const formData = generateFormData({
        email: {
          errors: [],
          value: "test",
          isValid: true,
          isTouched: true,
          isFocused: true,
          isDirty: true,
          _inputType: null,
        },
      });

      validationFns.applyFieldValidation(fields[0], formData, {
        validators: [(e: string) => !!e],
      });

      expect(isInputValidSpy).toHaveBeenCalledWith("test", [
        expect.any(Function),
      ]);
    });

    it("Should update the errors field in formData when a validation fails.", () => {
      const formData = generateFormData({
        email: {
          value: "test",
          errors: [],
          isValid: true,
          isTouched: true,
          isFocused: true,
          isDirty: true,
          _inputType: null,
        },
      });

      validationFns.applyFieldValidation(fields[0], formData, {
        validators: [(e: string) => e.length > 10 || "Error"],
      });

      expect(formData.email.errors).toEqual(["Error"]);
    });
  });

  describe("isInputValid", () => {
    it("Should return true if there are no validations to run.", () => {
      const isValid = validationFns.isInputValid("", []);

      expect(isValid).toEqual({ isValid: true, errors: [] });
    });

    it("Should return true if all validations provided pass.", () => {
      const isValid = validationFns.isInputValid("test", [
        (v: string) => v.length > 1,
      ]);

      expect(isValid).toEqual({ isValid: true, errors: [] });
    });

    it("Should return false if at least one of the validations provided fails.", () => {
      const isValid = validationFns.isInputValid("test", [
        (v: string) => v.length > 1 || "Should have more than 1 char",
        (v: string) => v.length < 4 || "Should have less than 4 chars",
      ]);

      expect(isValid).toEqual({
        isValid: false,
        errors: ["Should have less than 4 chars"],
      });
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

  describe("Custom validators", () => {
    describe("required", () => {
      it("Should return false if value is an empty string and no error message is provided.", () => {
        const required = FormulaValidators.required();
        expect(required("")).toBe(false);
      });

      it("Should return the error message when one is passed and the value is an empty string.", () => {
        const required = FormulaValidators.required("Error");
        expect(required("")).toBe("Error");
      });

      it("Should return true when there is a value and no error message is passed.", () => {
        const required = FormulaValidators.required();
        expect(required("test")).toBe(true);
      });

      it("Should return true when there is a value, even if an error message is passed.", () => {
        const required = FormulaValidators.required("Error");
        expect(required("test")).toBe(true);
      });
    });

    describe("minLength", () => {
      it("Should return false if value has less characters than specified and no error message is provided.", () => {
        const minLength = FormulaValidators.minLength(2);
        expect(minLength("a")).toBe(false);
      });

      it("Should return the error message when one is passed and the value has less characters than specified.", () => {
        const minLength = FormulaValidators.minLength(2, "Error");
        expect(minLength("a")).toBe("Error");
      });

      it("Should return true when the value has at least the amount of characters specified and no error message is passed.", () => {
        const minLength = FormulaValidators.minLength(2);
        expect(minLength("ab")).toBe(true);
      });

      it("Should return true when the value has more characters than specified and no error message is passed.", () => {
        const minLength = FormulaValidators.minLength(2);
        expect(minLength("abc")).toBe(true);
      });

      it("Should return true when the value has at least the amount of characters specified, even if an error message is passed.", () => {
        const minLength = FormulaValidators.minLength(2, "Error");
        expect(minLength("ab")).toBe(true);
      });
    });

    describe("maxLength", () => {
      it("Should return false if value has more characters than specified and no error message is provided.", () => {
        const maxLength = FormulaValidators.maxLength(2);
        expect(maxLength("abc")).toBe(false);
      });

      it("Should return the error message when one is passed and the value has more characters than specified.", () => {
        const maxLength = FormulaValidators.maxLength(2, "Error");
        expect(maxLength("abc")).toBe("Error");
      });

      it("Should return true when the value has at most the amount of characters specified and no error message is passed.", () => {
        const maxLength = FormulaValidators.maxLength(2);
        expect(maxLength("ab")).toBe(true);
      });

      it("Should return true when the value has less characters than specified and no error message is passed.", () => {
        const maxLength = FormulaValidators.maxLength(2);
        expect(maxLength("a")).toBe(true);
      });

      it("Should return true when the value has at least the amount of characters specified, even if an error message is passed.", () => {
        const maxLength = FormulaValidators.maxLength(2, "Error");
        expect(maxLength("ab")).toBe(true);
      });
    });

    describe("pattern", () => {
      it("Should return false if value does not match the provided pattern and no error message is provided.", () => {
        const pattern = FormulaValidators.pattern(/a/);
        expect(pattern("b")).toBe(false);
      });

      it("Should return the error message when one is passed and the value does not match the provided pattern.", () => {
        const pattern = FormulaValidators.pattern(/a/, "Error");
        expect(pattern("b")).toBe("Error");
      });

      it("Should return true when the value matches the provided pattern and no error message is passed.", () => {
        const pattern = FormulaValidators.pattern(/a/);
        expect(pattern("a")).toBe(true);
      });

      it("Should return true when there is a value, even if an error message is passed.", () => {
        const pattern = FormulaValidators.pattern(/a/, "Error");
        expect(pattern("a")).toBe(true);
      });
    });

    describe("email", () => {
      // These tests cover only the function since the regex is the RFC 2822 standard email validation.
      it("Should return false if value does not match the provided email and no error message is provided.", () => {
        const email = FormulaValidators.email();
        expect(email("test")).toBe(false);
      });

      it("Should return the error message when one is passed and the value does not match the provided email.", () => {
        const email = FormulaValidators.email("Error");
        expect(email("test")).toBe("Error");
      });

      it("Should return true when the value matches the provided email and no error message is passed.", () => {
        const email = FormulaValidators.email();
        expect(email("test@test.com")).toBe(true);
      });

      it("Should return true when there is a value, even if an error message is passed.", () => {
        const email = FormulaValidators.email("Error");
        expect(email("test@test.com")).toBe(true);
      });
    });
  });
});
