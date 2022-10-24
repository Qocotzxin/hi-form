export type ValidationFn = (value: any) => boolean | string;
export type FormulaValidations = Record<string, FormulaValidationsOptions>;
export interface InputValidationState {
  isValid: boolean;
  errors: string[];
}
export interface FormulaValidationsOptions {
  validators?: ValidationFn[];
  validateOn?: "input" | "change";
  validateDirtyOnly?: boolean;
}

export type ChangeCallbacks = Record<
  string,
  {
    change: UserEvent;
    focus: UserEvent;
    blur: UserEvent;
  }
>;

export type FormFields =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement;

export interface FormulaForm {
  [fieldName: string]: FormulaFormData;
}

export interface FormulaFormPartial {
  [fieldName: string]: Partial<FormulaFormData>;
}

export interface FormulaFormData {
  value: InputValue;
  isValid: boolean;
  isTouched: boolean;
  isFocused: boolean;
  isDirty: boolean;
  errors: string[];
  _inputType: InputTypes | null;
}

export type InputValue = string | number | boolean;

export enum Events {
  change = "change",
  input = "input",
  focus = "focus",
  blur = "blur",
  submit = "submit",
}

export enum FormElements {
  input = "input",
  textarea = "textarea",
  select = "select",
}

export enum InputTypes {
  radio = "radio",
  checkbox = "checkbox",
  button = "button",
  color = "color",
  date = "date",
  datetimeLocal = "datetime-local",
  email = "email",
  file = "file",
  hidden = "hidden",
  image = "image",
  month = "month",
  number = "number",
  password = "password",
  range = "range",
  reset = "reset",
  search = "search",
  submit = "submit",
  tel = "tel",
  text = "text",
  time = "time",
  url = "url",
  week = "week",
}

export enum FormSubmitElements {
  input = "input",
  button = "button",
}

export enum DataAttributes {
  error = "data-formula-error",
}

export const TYPE_SUBMIT = '[type="submit]';

export type UserEvent = (e: Event) => void;
