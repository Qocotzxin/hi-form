import { describe, expect, it, vi } from "vitest";
import { formDataFns } from "../data";
import { InputTypes } from "../types";
import {
  generateForm,
  generateFormData,
  generateStandaloneInput,
} from "../utils/testing";

const { fields } = generateForm();

describe("Data functions.", () => {
  describe("createFormData", () => {
    it("Should return an object of type HiFormForm per input/textarea/select.", () => {
      expect(formDataFns.createFormData(fields)).toEqual(generateFormData());
    });

    it("Should call getInputValue one time per input.", () => {
      const getInputValueSpy = vi.spyOn(formDataFns, "getInputValue");
      formDataFns.createFormData(fields);
      expect(getInputValueSpy).toHaveBeenCalledTimes(2);
      expect(getInputValueSpy).toHaveBeenNthCalledWith(1, fields[0], undefined);
      expect(getInputValueSpy).toHaveBeenNthCalledWith(2, fields[1], undefined);
    });

    it("Should call getInputValue one time per input passing previous value when present.", () => {
      const radios = [
        generateStandaloneInput([
          { attr: "type", value: InputTypes.radio },
          { attr: "checked", value: "" },
          { attr: "value", value: "firstValue" },
          { attr: "name", value: "test" },
        ]),
        generateStandaloneInput([
          { attr: "type", value: InputTypes.radio },
          { attr: "checked", value: "" },
          { attr: "value", value: "secondValue" },
          { attr: "name", value: "test" },
        ]),
      ];
      const getInputValueSpy = vi.spyOn(formDataFns, "getInputValue");
      formDataFns.createFormData(radios);
      expect(getInputValueSpy).toHaveBeenCalledTimes(2);
      expect(getInputValueSpy).toHaveBeenNthCalledWith(1, radios[0], undefined);
      expect(getInputValueSpy).toHaveBeenNthCalledWith(
        2,
        radios[1],
        "firstValue"
      );
    });

    it("Should return an empty object when an empty array is passed (no inputs provided).", () => {
      expect(formDataFns.createFormData([])).toEqual({});
    });

    it("Should return the initial value when there is one and false when there is not (for isValid, isTouched and isDirty).", () => {
      expect(
        formDataFns.createFormData(
          [
            generateStandaloneInput([
              { attr: "type", value: InputTypes.radio },
              { attr: "checked", value: "" },
              { attr: "value", value: "firstValue" },
              { attr: "name", value: "test" },
            ]),
          ],
          {
            test: {
              isInitiallyValid: true,
              isInitiallyTouched: false,
            },
          }
        )
      ).toEqual({
        test: {
          value: "firstValue",
          isValid: true,
          isTouched: false,
          isFocused: false,
          isDirty: false,
          errors: [],
          _inputType: InputTypes.radio,
        },
      });
    });
  });

  describe("getInputValue", () => {
    it("Should return the previous input value when the input is of type radio and is NOT checked.", () => {
      const previousValue = "previousValue";
      const input = generateStandaloneInput([
        { attr: "type", value: InputTypes.radio },
      ]);
      expect(formDataFns.getInputValue(input, previousValue)).toEqual(
        previousValue
      );
    });

    it("Should return an empty string when the input is of type radio, is NOT checked and there is no previous value.", () => {
      const input = generateStandaloneInput([
        { attr: "type", value: InputTypes.radio },
      ]);
      expect(formDataFns.getInputValue(input, undefined)).toBe("");
    });

    it("Should return the current input value when the input is of type radio and is checked.", () => {
      const previousValue = "previousValue";
      const currentValue = "currentValue";
      const input = generateStandaloneInput([
        { attr: "type", value: InputTypes.radio },
        { attr: "checked", value: "" },
        { attr: "value", value: currentValue },
      ]);
      expect(formDataFns.getInputValue(input, previousValue)).toEqual(
        currentValue
      );
    });

    it("Should return the current input value as boolean when the input is of type checkbox.", () => {
      const previousValue = "previousValue";
      const currentValue = "currentValue";
      const input = generateStandaloneInput([
        { attr: "type", value: InputTypes.checkbox },
        { attr: "checked", value: "" },
        { attr: "value", value: currentValue },
      ]);

      expect(formDataFns.getInputValue(input, previousValue)).toBe(true);
    });

    it("Should return the current input value when the input is neither type radio nor checkbox.", () => {
      const previousValue = "previousValue";
      const currentValue = "currentValue";
      const input = generateStandaloneInput([
        { attr: "type", value: InputTypes.text },
        { attr: "checked", value: "" },
        { attr: "value", value: currentValue },
      ]);

      expect(formDataFns.getInputValue(input, previousValue)).toBe(
        currentValue
      );
    });
  });
});
