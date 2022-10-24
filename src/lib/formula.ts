import { formDataFns } from "./data";
import { getInputsAsArray } from "./dom";
import { eventHandlingFns } from "./event-handling";
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
  const formData = formDataFns.createFormData(inputs);
  const callbacks = eventHandlingFns.subscribeToInputChanges(
    inputs,
    formData,
    options
  );
  const submitCallback = eventHandlingFns.subscribeToSubmitEvent(
    form,
    inputs,
    formData,
    options
  );

  return {
    value: () => formData,
    subscribe: (fn: () => void) => subject.subscribe(fn),
    unsubscribe: () => subject.unsubscribe(),
    finish: () => {
      eventHandlingFns.unsubscribeFromInputChanges(inputs, callbacks, options);
      eventHandlingFns.unsubscribeFromSubmitEvent(form, submitCallback);
    },
  };
};
