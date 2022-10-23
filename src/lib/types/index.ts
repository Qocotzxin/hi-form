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
  value: unknown;
  isValid: boolean;
  isTouched: boolean;
  isFocused: boolean;
  isDirty: boolean;
  errors: string[];
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
