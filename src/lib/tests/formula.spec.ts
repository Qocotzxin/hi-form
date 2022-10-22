import { describe, expect, it, vi } from "vitest";
import { formula } from "../formula";
import { subject } from "../subscription";
import { expectOfTypeFunction, generateForm } from "../utils/testing";
import { eventHandlingFns } from "../event-handling";

const { form } = generateForm();

describe("Formula main function.", () => {
  it("Should throw an error when no form element is provided.", () => {
    // @ts-ignore: ignore to test error when no form is provided.
    const formulaFn = () => formula();

    expect(formulaFn).toThrowError("Please provide a valid <form> element.");
  });

  it("Should return an object with value, subscribe, unsubscribe and finish functions.", () => {
    expect(formula(form)).toEqual({
      value: expectOfTypeFunction,
      subscribe: expectOfTypeFunction,
      unsubscribe: expectOfTypeFunction,
      finish: expectOfTypeFunction,
    });
  });

  it("Should call subscribeToInputChanges and subscribeToSubmitEvent when calling formula.", () => {
    const subscribeToInputChangesSpy = vi.spyOn(
      eventHandlingFns,
      "subscribeToInputChanges"
    );
    const subscribeToSubmitEventSpy = vi.spyOn(
      eventHandlingFns,
      "subscribeToSubmitEvent"
    );
    formula(form);
    expect(subscribeToInputChangesSpy).toHaveBeenCalledTimes(1);
    expect(subscribeToSubmitEventSpy).toHaveBeenCalledTimes(1);
  });

  it("Should return formData when value function returned by formula is called.", () => {
    expect(formula(form).value()).toEqual({
      email: {
        isFocused: false,
        value: "",
        isValid: true,
        isTouched: false,
        isDirty: false,
      },
      comments: {
        isFocused: false,
        value: "",
        isValid: true,
        isTouched: false,
        isDirty: false,
      },
    });
  });

  it("Should call subject.subscribe when subscribe function returned by formula is called.", () => {
    const subjectSpy = vi.spyOn(subject, "subscribe");
    const callback = vi.fn();
    formula(form).subscribe(callback);
    expect(subjectSpy).toHaveBeenCalledTimes(1);
    expect(subjectSpy).toHaveBeenCalledWith(callback);
  });

  it("Should call subject.unsubscribe when unsubscribe function returned by formula is called.", () => {
    const subjectSpy = vi.spyOn(subject, "unsubscribe");
    formula(form).unsubscribe();
    expect(subjectSpy).toHaveBeenCalledTimes(1);
  });

  it("Should call unsubscribeFromInputChanges and unsubscribeFromSubmitEvent when finish function returned by formula is called.", () => {
    const unsubscribeFromInputChangesSpy = vi.spyOn(
      eventHandlingFns,
      "unsubscribeFromInputChanges"
    );
    const unsubscribeFromSubmitEventSpy = vi.spyOn(
      eventHandlingFns,
      "unsubscribeFromSubmitEvent"
    );

    formula(form).finish();

    expect(unsubscribeFromInputChangesSpy).toHaveBeenCalledTimes(1);
    expect(unsubscribeFromSubmitEventSpy).toHaveBeenCalledTimes(1);
  });
});
