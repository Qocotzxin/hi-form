import { describe, it, expect } from "vitest";
import { mergeOptions, mergeMaybeArray } from "../../utils/options";
import { HiFormValidators } from "../../validation";

describe("Options helpers.", () => {
  describe("mergeMaybeArray", () => {
    it("Should always return an array with both parameters included in the same order they are passed.", () => {
      expect(mergeMaybeArray([1], [2])).toStrictEqual([1, 2]);
    });

    it("Should always return the first array passed if the other is not defined.", () => {
      expect(mergeMaybeArray([1], undefined)).toEqual([1]);
    });

    it("Should always return the second array passed if the other is not defined.", () => {
      expect(mergeMaybeArray(undefined, [1])).toEqual([1]);
    });

    it("Should always return an empty array if both are undefined.", () => {
      expect(mergeMaybeArray(undefined, undefined)).toEqual([]);
    });
  });

  describe("mergeOptions", () => {
    it("Should return field options for primitive values and global options first and field options last in case of arrays.", () => {
      const required = HiFormValidators.required();
      const minLength = HiFormValidators.minLength(2);

      expect(
        mergeOptions(
          {
            validateOn: "input",
            validateDirtyOnly: false,
            validators: [required],
            emitOn: ["blur"],
          },
          {
            validateOn: "change",
            validateDirtyOnly: true,
            validators: [minLength],
            emitOn: ["focus"],
          }
        )
      ).toEqual({
        validateOn: "change",
        validateDirtyOnly: true,
        validators: [required, minLength],
        emitOn: ["blur", "focus"],
      });
    });

    it("Should return validateOn from globalOptions when field is undefined.", () => {
      expect(
        mergeOptions(
          {
            validateOn: "input",
          },
          {}
        )
      ).toEqual({
        validateOn: "input",
        emitOn: undefined,
        isInitiallyDirty: undefined,
        isInitiallyTouched: undefined,
        isInitiallyValid: undefined,
        validateDirtyOnly: undefined,
        validators: [],
      });
    });

    it("Should return emitOn field in undefined if the result of mergeMaybeArray is an empty array for that field.", () => {
      const required = HiFormValidators.required();
      const minLength = HiFormValidators.minLength(2);

      expect(
        mergeOptions(
          {
            validateOn: "input",
            validateDirtyOnly: false,
            validators: [required],
            emitOn: undefined,
          },
          {
            validateOn: "change",
            validateDirtyOnly: true,
            validators: [minLength],
            emitOn: [],
          }
        )
      ).toEqual({
        validateOn: "change",
        validateDirtyOnly: true,
        validators: [required, minLength],
        emitOn: undefined,
      });
    });
  });
});
