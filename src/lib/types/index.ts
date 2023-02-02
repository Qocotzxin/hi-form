export type ValidationFn = (value: any, inputName: string) => boolean | string;
export type HiFormValidations<T extends string> = Record<T, HiFormFieldOptions>;
type LengthValidation = (minMax: number, errorMessage?: string) => ValidationFn;

export interface HiFormCustomValidators {
  required: (errorMessage?: string) => ValidationFn;
  email: (errorMessage?: string) => ValidationFn;
  minLength: LengthValidation;
  maxLength: LengthValidation;
  pattern: (pattern: string | RegExp, errorMessage?: string) => ValidationFn;
}
export interface HiFormParams<T extends string> {
  form: HTMLFormElement;
  globalOptions?: HiFormFieldOptions;
  fieldOptions?: Partial<HiFormValidations<T>>;
}
export interface InputValidationState {
  isValid: boolean;
  errors: string[];
}
export interface HiFormFieldOptions {
  /**
   * An array of functions with the following signature:
   * (value: any) => string | boolean
   *
   * When returning a string, it will be stored in the error messages array.
   */
  validators?: ValidationFn[];

  /**
   * HiForm runs validations on different events, one of those is the `change` event.
   * But it can be replaced with the `input` event if you want to run validations
   * each time the user types something in. Due to performance, `change` is recommended
   * and is the default behavior.
   */
  validateOn?: "input" | "change";

  /**
   * By default HiForm won't run validations on `blur` if
   * the input value never changed (which means the user never typed any value).
   * This behavior can be modified by setting `validateDirtyOnly` to `false` in which case,
   * validations will be executed when the user focus the input and then leaves
   * (e.g.: when moving through the inputs using `tab`).
   */
  validateDirtyOnly?: boolean;
  // Not using Events type here to provide a better DX.
  /**
   * An array of events to choose which ones will be emitted. If no array is passed
   * then all events are emitted but if an empty array is passed,
   * only submit event will be emitted (submit event is not optional).
   */
  emitOn?: Events[];
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

interface HiFormFormState {
  isValid: boolean;
}
export type HiFormForm<T extends string> = {
  [key in T]: HiFormFormData;
};

export interface HiFormValue<T extends string> {
  event: Events;
  formData: HiFormForm<T>;
  formState: HiFormFormState;
}

export interface HiFormFormData {
  value: InputValue;
  isValid: boolean;
  isTouched: boolean;
  isFocused: boolean;
  isDirty: boolean;
  errors: string[];
  _inputType: InputTypes | null;
}

export type InputValue = string | number | boolean;

export type Events = "change" | "input" | "focus" | "blur" | "submit";

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

export const TYPE_SUBMIT = '[type="submit]';

export type UserEvent = (e: Event) => void;
