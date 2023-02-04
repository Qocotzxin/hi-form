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

export function returnValueOrType<T = boolean>(
  value: boolean | undefined,
  defaultBoolean: boolean | T
): boolean | T {
  return typeof value === "undefined" ? defaultBoolean : value;
}
