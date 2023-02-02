import { FormElements, FormFields } from "./types";

const FIELD_TYPES = Object.values(FormElements);

/**
 * Returns every form input/textarea/select inside an array.
 */
export function getInputsAsArray(form: HTMLFormElement): FormFields[] {
  return FIELD_TYPES.map((fieldType) =>
    Object.values(form.querySelectorAll(fieldType))
  )
    .flat()
    .filter((input) => input.type !== "submit");
}
