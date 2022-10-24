import { FormFields, InputTypes } from "../types";

export function isString(value: unknown): value is string {
  return typeof value === "string";
}

export function isCheckbox(input: FormFields): boolean {
  return (
    input instanceof HTMLInputElement && input.type === InputTypes.checkbox
  );
}

export function isRadio(input: FormFields): boolean {
  return input instanceof HTMLInputElement && input.type === InputTypes.radio;
}
