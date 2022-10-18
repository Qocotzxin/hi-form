import { FormFields, FormulaForm } from "./types";

/**
 * Returns the main formula object based on each input value and name.
 */
export function createFormData(inputs: FormFields[]): FormulaForm {
  return inputs.reduce(
    (acc, cur) => ({
      ...acc,
      [cur.name]: {
        value: cur.value,
        isValid: true,
        isTouched: false,
        isFocused: false,
        isDirty: false,
      },
    }),
    {}
  );
}
