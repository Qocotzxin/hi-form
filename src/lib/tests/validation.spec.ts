import { describe, expect, it, vi } from "vitest";
import { generateForm, generateFormData } from "../utils/testing";
import { validationFns } from "../validation";

const { fields } = generateForm();

describe("Validation functions.", () => {
  describe("applyFieldValidation", () => {
    it("Should update then formData value for isValid field and use it to set the data error related attribute.", () => {
      const inputSpy = vi.spyOn(fields[0], "setAttribute");
      const formData = generateFormData();

      validationFns.applyFieldValidation(fields[0], formData);

      expect(formData.email.isValid).toBe(true);
      expect(formData.email.errors).toEqual([]);
      expect(inputSpy).toHaveBeenCalledWith("data-formula-error", "false");
    });

    it("Should call isInputValid and pass undefined when no validators are set.", () => {
      const isInputValidSpy = vi.spyOn(validationFns, "isInputValid");
      const formData = generateFormData();

      validationFns.applyFieldValidation(fields[0], formData);

      expect(isInputValidSpy).toHaveBeenCalledWith("", undefined);
    });

    it("Should call isInputValid and pass the validators when set.", () => {
      const isInputValidSpy = vi.spyOn(validationFns, "isInputValid");
      const formData = generateFormData({ email: { value: "test" } });

      validationFns.applyFieldValidation(fields[0], formData, {
        validators: [(e: string) => !!e],
      });

      expect(isInputValidSpy).toHaveBeenCalledWith("test", [
        expect.any(Function),
      ]);
    });

    it("Should update the errors field in formData when a validation fails.", () => {
      const formData = generateFormData({ email: { value: "test" } });

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
});
