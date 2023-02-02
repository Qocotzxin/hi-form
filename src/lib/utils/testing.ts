import { expect } from "vitest";
import { FormFields, HiFormForm, InputTypes } from "../types";

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

export function generateStandaloneInput(
  attributes: { attr: string; value: string }[]
) {
  const input = document.createElement("input");
  attributes.forEach((record) => {
    input.setAttribute(record.attr, record.value);
  });

  return input;
}

export const expectOfTypeFunction = expect.any(Function);

type FormDataKeys = "email" | "comments";

export const generateFormData: (
  override?: Partial<HiFormForm<FormDataKeys>>
) => HiFormForm<FormDataKeys> = (override) => ({
  email: {
    isFocused: false,
    value: "",
    isValid: true,
    isTouched: false,
    isDirty: false,
    errors: [],
    _inputType: InputTypes.text,
  },
  comments: {
    isFocused: false,
    value: "",
    isValid: true,
    isTouched: false,
    isDirty: false,
    errors: [],
    _inputType: null,
  },
  ...override,
});
