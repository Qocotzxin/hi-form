import { describe, expect, it, vi } from "vitest";
import { formula } from "../formula";
import formulaSubject from "../utils/formSubject";
import { expectOfTypeFunction, generateForm } from "../utils/testing";
import { eventHandlingFns } from "../event-handling";

const { form } = generateForm();

describe("Formula main function.", () => {
  it("Should throw an error when no form element is provided.", () => {
    // @ts-ignore: ignore to test error when no form is provided.
    const formulaFn = () => formula({});

    expect(formulaFn).toThrowError("Please provide a valid <form> element.");
  });

  it("Should return an object with value, subscribe and unsubscribe.", () => {
    expect(formula({ form })).toEqual({
      value: expectOfTypeFunction,
      subscribe: expectOfTypeFunction,
      unsubscribe: expectOfTypeFunction,
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
    formula({ form });
    expect(subscribeToInputChangesSpy).toHaveBeenCalledTimes(1);
    expect(subscribeToSubmitEventSpy).toHaveBeenCalledTimes(1);
  });

  it("Should return formData when value function returned by formula is called.", () => {
    expect(formula({ form }).value()).toEqual({
      email: {
        isFocused: false,
        value: "",
        isValid: true,
        isTouched: false,
        isDirty: false,
        errors: [],
        _inputType: "text",
      },
      comments: {
        isFocused: false,
        value: "",
        isValid: true,
        isTouched: false,
        isDirty: false,
        errors: [],
        _inputType: null,
      },
    });
  });

  it("Should call subject.subscribe when subscribe function returned by formula is called.", () => {
    const subjectSpy = vi.spyOn(formulaSubject.getSubject(), "subscribe");
    const callback = vi.fn();
    formula({ form }).subscribe(callback);
    expect(subjectSpy).toHaveBeenCalledTimes(1);
    expect(subjectSpy).toHaveBeenCalledWith(callback);
  });

  it("Should call subject.unsubscribe when unsubscribe function returned by formula is called.", () => {
    const subjectSpy = vi.spyOn(formulaSubject.getSubject(), "unsubscribe");
    formula({ form }).unsubscribe();
    expect(subjectSpy).toHaveBeenCalledTimes(1);
  });
});
