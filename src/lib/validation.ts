import {
  DataAttributes,
  FormFields,
  FormulaForm,
  FormulaValidationsOptions,
  ValidationFn,
} from "./types";

export const validationFns = {
  /**
   * Executes validation on the specified field.
   * Adds corresponding data attribute if needed.
   */
  applyFieldValidation(
    input: FormFields,
    formData: FormulaForm,
    inputOptions?: FormulaValidationsOptions
  ) {
    formData[input.name].isValid = validationFns.isInputValid(
      formData[input.name].value,
      inputOptions?.validators
    );
    input.setAttribute(
      DataAttributes.error,
      String(!formData[input.name].isValid)
    );
  },

  /**
   * Runs all provided validators against the specified value.
   */
  isInputValid(value: unknown, validators?: ValidationFn[]): boolean {
    return !validators ? true : validators.every((fn) => fn(value));
  },

  required: (value: string | number | boolean) => !!value,
};
