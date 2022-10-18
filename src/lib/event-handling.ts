import { emit } from "./subscription";
import {
  ChangeCallbacks,
  Events,
  FormFields,
  FormulaForm,
  FormulaValidations,
  FormulaValidationsOptions,
} from "./types";
import { applyFieldValidation } from "./validation";

/**
 * Subscribes to input (or change), focus and blur events.
 */
export function subscribeToInputChanges(
  inputs: FormFields[],
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
      // 'Change' is kept as name to simplify internal logic since this is not exposed to the user.
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

/**
 * Unsubscribes from input (or change), focus and blur events.
 */
export function usubscribeFromInputChanges(
  inputs: FormFields[],
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

/**
 * Callback to be executed on input (or change) event.
 * Always executes validation.
 */
export function onChange(
  input: FormFields,
  formData: FormulaForm,
  inputOptions?: FormulaValidationsOptions
) {
  return (e: Event) => {
    const value = (e.target as FormFields).value;
    formData[input.name].value = value;
    applyFieldValidation(input, formData, inputOptions);

    if (!formData[input.name].isDirty) {
      formData[input.name].isDirty = true;
    }
    emit(Events.input, formData[input.name]);
  };
}

/**
 * Callback to be executed on focus event.
 * Does not execute validation.
 */
export function onFocus(input: FormFields, formData: FormulaForm) {
  return (_: Event) => {
    formData[input.name].isFocused = true;
    emit(Events.focus, formData[input.name]);
  };
}

/**
 * Callback to be executed on blur event.
 * Executes conditional validation based on user options.
 */
export function onBlur(
  input: FormFields,
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
    emit(Events.blur, formData[input.name]);
  };
}

/**
 * Callback to be executed on submit event.
 * Always executes validation.
 * TODO: check if this should be event based since now, it needs to be called programatically.
 */
export function submit(
  inputs: FormFields[],
  formData: FormulaForm,
  options?: FormulaValidations
): { isValid: boolean } {
  let isValid = true;

  for (const input of inputs) {
    formData[input.name].value = input.value;
    applyFieldValidation(input, formData, options && options[input.name]);

    if (!formData[input.name].isValid) {
      isValid = false;
    }
  }

  emit(Events.submit, formData);
  return { isValid };
}
