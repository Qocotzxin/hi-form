import {
  DataAttributes,
  FormFields,
  FormulaForm,
  FormulaFieldOptions,
  InputValidationState,
  InputValue,
  ValidationFn,
} from "./types";
import { isString } from "./utils/type-helpers";

export const validationFns = {
  /**
   * Executes validation on the specified field.
   * Adds corresponding data attribute if needed.
   */
  applyFieldValidation(
    input: FormFields,
    formData: FormulaForm,
    inputOptions?: FormulaFieldOptions
  ) {
    const { isValid, errors } = validationFns.isInputValid(
      formData[input.name].value,
      inputOptions?.validators
    );
    formData[input.name].isValid = isValid;
    formData[input.name].errors = errors;
    input.setAttribute(
      DataAttributes.error,
      String(!formData[input.name].isValid)
    );
  },

  /**
   * Runs all provided validators against the specified value.
   */
  isInputValid(
    value: unknown,
    validators?: ValidationFn[]
  ): InputValidationState {
    return !validators
      ? { isValid: true, errors: [] }
      : validationFns.mapValidatorsToInputValidationState(value, validators);
  },

  mapValidatorsToInputValidationState(
    value: unknown,
    validators: ValidationFn[]
  ): InputValidationState {
    return validators.reduce<InputValidationState>(
      (acc, cur) => {
        const isValid = cur(value);
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
