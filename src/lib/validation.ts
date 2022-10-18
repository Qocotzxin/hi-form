import {
  DataAttributes,
  FormFields,
  FormulaForm,
  FormulaValidationsOptions,
  ValidationFn,
} from "./types";

export const required = (value: string | number | boolean) => !!value;
export const minLength = (value: string) => value && value.length;

/**
 * Executes validation on the specified field.
 * Adds corresponding data attribute if needed.
 */
export function applyFieldValidation(
  input: FormFields,
  formData: FormulaForm,
  inputOptions?: FormulaValidationsOptions
) {
  formData[input.name].isValid = isInputValid(
    formData[input.name].value,
    inputOptions?.validators
  );
  input.setAttribute(
    DataAttributes.error,
    String(!formData[input.name].isValid)
  );
}

/**
 * Runs all provided validators against the specified value.
 */
export function isInputValid(
  value: unknown,
  validators?: ValidationFn[]
): boolean {
  return !validators ? true : validators.every((fn) => fn(value));
}
