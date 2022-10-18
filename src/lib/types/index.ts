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
    change: (e: Event) => void;
    focus: (e: Event) => void;
    blur: (e: Event) => void;
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

export enum DataAttributes {
  error = "data-formula-error",
}
