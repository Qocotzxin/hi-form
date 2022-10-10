import { BehaviorSubject } from "rxjs";
import {
  ChangeCallbacks,
  Events,
  FormulaForm,
  FormulaValidations,
  FormulaValidationsOptions,
  ValidationFn,
} from "./types";

const subject = new BehaviorSubject({});

export const formula = (
  form: HTMLFormElement,
  options?: FormulaValidations
) => {
  if (!form) {
    throw new Error("Please provide a valid <form> element.");
  }

  // Add warning if there are no inputs.
  //   const selects = form.getElementsByTagName("select");
  //   const textareas = form.getElementsByTagName("textarea");

  const inputs = getInputsAsArray(form);
  const formData = createFormData(inputs);
  const callbacks = subscribeToInputChanges(inputs, formData, options);

  return {
    value: () => formData,
    submit: () => submit(inputs, formData, options),
    subscribe: (fn: () => void) => subject.subscribe(fn),
    unsubscribe: () => subject.unsubscribe(),
    finish: () => usubscribeFromInputChanges(inputs, callbacks, options),
  };
};

function createFormData(inputs: HTMLInputElement[]): FormulaForm {
  return inputs.reduce(
    (acc, cur) => ({
      ...acc,
      [cur.name]: {
        value: cur.value,
        isValid: false,
        isTouched: false,
        isFocused: false,
        isDirty: false,
      },
    }),
    {}
  );
}

function getInputsAsArray(form: HTMLFormElement): HTMLInputElement[] {
  return Object.values(form.getElementsByTagName(Events.input));
}

function subscribeToInputChanges(
  inputs: HTMLInputElement[],
  formData: FormulaForm,
  options?: FormulaValidations
): ChangeCallbacks {
  const fns: ChangeCallbacks = {};

  for (const input of inputs) {
    const inputOptions = options && options[input.name];
    const onFocusCallback = onFocus(input, formData);
    const onBlurCallback = onBlur(input, formData, inputOptions);
    const onChangeCallback = onChange(input, formData, inputOptions);

    fns[input.name] = {
      // Change is kept as name to simplify internal logic since this is not exposed to the user.
      [Events.change]: onChangeCallback,
      [Events.focus]: onFocusCallback,
      [Events.blur]: onBlurCallback,
    };

    input.addEventListener(
      inputOptions?.validateOn || Events.change,
      onChangeCallback
    );
    input.addEventListener(Events.focus, onFocusCallback);
    input.addEventListener(Events.blur, onBlurCallback);
  }

  return fns;
}

function usubscribeFromInputChanges(
  inputs: HTMLInputElement[],
  fns: ChangeCallbacks,
  options?: FormulaValidations
) {
  for (const input of inputs) {
    const inputOptions = options && options[input.name];
    input.removeEventListener(
      inputOptions?.validateOn || Events.change,
      fns[input.name].change!
    );
    input.removeEventListener(Events.focus, fns[input.name].focus);
    input.removeEventListener(Events.blur, fns[input.name].blur);
  }
}

function onChange(
  input: HTMLInputElement,
  formData: FormulaForm,
  inputOptions?: FormulaValidationsOptions
) {
  return (e: Event) => {
    const value = (e.target as HTMLInputElement).value;
    formData[input.name].value = value;
    applyFieldValidation(input, formData, inputOptions);

    if (!formData[input.name].isDirty) {
      formData[input.name].isDirty = true;
    }
    emit("input", formData[input.name]);
  };
}

function onFocus(input: HTMLInputElement, formData: FormulaForm) {
  return (_: Event) => {
    formData[input.name].isFocused = true;
    emit("focus", formData[input.name]);
  };
}

function onBlur(
  input: HTMLInputElement,
  formData: FormulaForm,
  inputOptions?: FormulaValidationsOptions
) {
  return (_: Event) => {
    formData[input.name].isFocused = false;

    if (!formData[input.name].isTouched) {
      formData[input.name].isTouched = true;

      if (inputOptions?.validateDirtyOnly === false) {
        applyFieldValidation(input, formData, inputOptions);
      }
    }
    emit("blur", formData[input.name]);
  };
}

function applyFieldValidation(
  input: HTMLInputElement,
  formData: FormulaForm,
  inputOptions?: FormulaValidationsOptions
) {
  formData[input.name].isValid = isInputValid(
    formData[input.name].value,
    inputOptions?.validators
  );
  input.setAttribute("data-error", String(!formData[input.name].isValid));
}

function isInputValid(value: unknown, validators?: ValidationFn[]): boolean {
  return !validators ? true : validators.every((fn) => fn(value));
}

function submit(
  inputs: HTMLInputElement[],
  formData: FormulaForm,
  options?: FormulaValidations
): { isValid: boolean } {
  let isValid = true;

  for (const input of inputs) {
    formData[input.name].value = input.value;
    formData[input.name].isValid = isInputValid(
      input.value,
      options && options[input.name]?.validators
    );
    input.setAttribute("data-error", String(!formData[input.name].isValid));

    if (!formData[input.name].isValid) {
      isValid = false;
    }
  }

  emit("submit", formData);
  return { isValid };
}

function emit(event: string, data: unknown) {
  !subject.closed && subject.next({ event, data });
}
