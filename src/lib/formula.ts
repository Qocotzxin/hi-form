import { formDataFns } from "./data";
import { getInputsAsArray } from "./dom";
import { eventHandlingFns } from "./event-handling";
import { FormulaParams, FormulaValue } from "./types";
import formSubject from "./utils/formSubject";

export const formula = <T extends string>({
  form,
  fieldOptions,
  globalOptions,
}: FormulaParams<T>) => {
  if (!form) {
    throw new Error("Please provide a valid <form> element.");
  }

  const subject = formSubject.getSubject();
  const inputs = getInputsAsArray(form);
  const formData = formDataFns.createFormData<T>(inputs);
  const callbacks = eventHandlingFns.subscribeToInputChanges<T>(
    inputs,
    formData,
    fieldOptions,
    globalOptions
  );
  const submitCallback = eventHandlingFns.subscribeToSubmitEvent<T>(
    form,
    formData
  );

  return {
    value: () => formData,
    subscribe: (fn: (data: FormulaValue<T>) => void) => subject.subscribe(fn),
    unsubscribe: () => {
      eventHandlingFns.unsubscribeFromInputChanges(
        inputs,
        callbacks,
        fieldOptions,
        globalOptions
      );
      eventHandlingFns.unsubscribeFromSubmitEvent(form, submitCallback);
      subject.unsubscribe();
    },
  };
};
