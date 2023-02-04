import { formDataFns } from "./data";
import { getInputsAsArray } from "./dom";
import { eventHandlingFns } from "./event-handling";
import { HiFormParams, HiFormValue } from "./types";
import formSubject from "./utils/formSubject";

export const hiForm = <T extends string>({
  form,
  fieldOptions,
  globalOptions,
}: HiFormParams<T>) => {
  if (!form) {
    throw new Error("Please provide a valid <form> element.");
  }

  const subject = formSubject.getSubject();
  const inputs = getInputsAsArray(form);
  const formData = formDataFns.createFormData<T>(inputs, fieldOptions);
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
    subscribe: (fn: (data: HiFormValue<T>) => void) => subject.subscribe(fn),
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
