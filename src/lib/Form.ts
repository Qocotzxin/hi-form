import { createFormData } from "./data";
import { getInputsAsArray } from "./dom";
import {
  submit,
  subscribeToInputChanges,
  usubscribeFromInputChanges,
} from "./event-handling";
import { subject } from "./subscription";
import { FormulaValidations } from "./types";

export const formula = (
  form: HTMLFormElement,
  options?: FormulaValidations
) => {
  if (!form) {
    throw new Error("Please provide a valid <form> element.");
  }

  // Add warning if there are no inputs.
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
