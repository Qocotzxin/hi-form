export type ValidationFn = (value: any) => boolean;
export type FormulaValidations = Record<string, FormulaValidationsOptions>;

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
  [fieldName: string]: {
    value: unknown;
    isValid: boolean;
    isTouched: boolean;
    isFocused: boolean;
    isDirty: boolean;
  };
}

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

export enum FormSubmitElements {
  input = "input",
  button = "button",
}

export enum DataAttributes {
  error = "data-formula-error",
}

export const TYPE_SUBMIT = '[type="submit]';

export type UserEvent = (e: Event) => void;
