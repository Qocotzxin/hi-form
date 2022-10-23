import { expect } from "vitest";
import { FormFields, FormulaForm, FormulaFormPartial } from "../types";

export function generateForm(): {
  form: HTMLFormElement;
  fields: FormFields[];
} {
  const form = document.createElement("form");
  const input = document.createElement("input");
  input.setAttribute("name", "email");
  const textarea = document.createElement("textarea");
  textarea.setAttribute("name", "comments");
  form.appendChild(input);
  form.appendChild(textarea);

  return { form, fields: [input, textarea] };
}

export const expectOfTypeFunction = expect.any(Function);

export const generateFormData: (
  override?: FormulaFormPartial
) => FormulaForm = (override) => ({
  email: {
    isFocused: false,
    value: "",
    isValid: false,
    isTouched: false,
    isDirty: false,
    errors: [],
  },
  comments: {
    isFocused: false,
    value: "",
    isValid: false,
    isTouched: false,
    isDirty: false,
    errors: [],
  },
  ...override,
});
