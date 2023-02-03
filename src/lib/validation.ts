import {
  FormFields,
  HiFormCustomValidators,
  HiFormFieldOptions,
  HiFormForm,
  HiFormFieldData,
  InputValidationState,
  InputValue,
  HiFormValidationFn,
} from "./types";
import { isString } from "./utils/type-helpers";

export const validationFns = {
  /**
   * Executes validation on the specified field.
   * Adds corresponding data attribute if needed.
   */
  applyFieldValidation<T extends string>(
    input: FormFields,
    formData: HiFormForm<T>,
    inputOptions?: HiFormFieldOptions
  ) {
    const { isValid, errors } = validationFns.isInputValid(
      input.name,
      formData[input.name as T].value,
      inputOptions?.validators
    );
    const isNativeInputValid = input.reportValidity();
    formData[input.name as T].isValid = isValid && isNativeInputValid;
    formData[input.name as T].errors = errors;
    input.setAttribute(
      "aria-invalid",
      String(!Boolean(formData[input.name as T].isValid))
    );
  },

  /**
   * Runs all provided validators against the specified value.
   */
  isInputValid(
    inputName: string,
    value: unknown,
    validators?: HiFormValidationFn[]
  ): InputValidationState {
    return !validators
      ? { isValid: true, errors: [] }
      : validationFns.mapValidatorsToInputValidationState(
          value,
          inputName,
          validators
        );
  },

  /**
   * Checks if all fields are valid using the formData state.
   */
  isFormValid: <T extends string>(formData: HiFormForm<T>): boolean => {
    return Object.values<HiFormFieldData>(formData).every(
      (data) => data.isValid
    );
  },

  mapValidatorsToInputValidationState(
    value: unknown,
    inputName: string,
    validators: HiFormValidationFn[]
  ): InputValidationState {
    return validators.reduce<InputValidationState>(
      (acc, cur) => {
        const isValid = cur(value, inputName);
        const errors = [...acc.errors];

        if (isString(isValid)) {
          errors.push(isValid);
        }

        return {
          isValid: !acc.isValid || !isValid || isString(isValid) ? false : true,
          errors,
        };
      },
      { isValid: true, errors: [] }
    );
  },

  required: (value: InputValue) => !!value,
};

/**
 * RFC 2822 standard email validation
 */
const emailRegex =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

export const HiFormValidators: HiFormCustomValidators = {
  required: (errorMessage?: string) => (value: string, inputName: string) =>
    !!value || errorMessage || `${inputName} field is required.`,
  minLength:
    (min: number, errorMessage?: string) =>
    (value: string, inputName: string) =>
      value.length >= min ||
      errorMessage ||
      `${inputName} field needs to contain at least ${min} characters.`,
  maxLength:
    (max: number, errorMessage?: string) =>
    (value: string, inputName: string) =>
      value.length <= max ||
      errorMessage ||
      `${inputName} field needs to contain at the most ${max} characters.`,
  pattern:
    (pattern: string | RegExp, errorMessage?: string) =>
    (value: string, inputName: string) =>
      new RegExp(pattern).test(value) ||
      errorMessage ||
      `${inputName} field does not match the expected pattern.`,
  email: (errorMessage?: string) => (value: string, inputName: string) =>
    new RegExp(emailRegex).test(value) ||
    errorMessage ||
    `${inputName} field does not match the expected pattern.`,
};
