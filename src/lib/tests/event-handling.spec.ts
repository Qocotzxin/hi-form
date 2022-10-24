import { describe, expect, it, vi } from "vitest";
import { eventHandlingFns } from "../event-handling";
import { emit } from "../subscription";
import { InputTypes } from "../types";
import {
  expectOfTypeFunction,
  generateForm,
  generateFormData,
  generateStandaloneInput,
} from "../utils/testing";
import { validationFns } from "../validation";

const { form, fields } = generateForm();

vi.mock("../subscription", () => ({
  emit: vi.fn(),
}));

describe("Event handling functions.", () => {
  describe("subscribeToInputChanges", () => {
    it("Should call onChange, onBlur and onFocus 1 time per input when subscribeToInputChanges is called.", () => {
      const onChangeSpy = vi.spyOn(eventHandlingFns, "onChange");
      const onFocusSpy = vi.spyOn(eventHandlingFns, "onFocus");
      const onBlurSpy = vi.spyOn(eventHandlingFns, "onBlur");

      eventHandlingFns.subscribeToInputChanges(fields, {});

      expect(onChangeSpy).toHaveBeenCalledTimes(2);
      expect(onFocusSpy).toHaveBeenCalledTimes(2);
      expect(onBlurSpy).toHaveBeenCalledTimes(2);
    });

    it("Should add 1 event listener per event per input.", () => {
      const inputSpy = vi.spyOn(fields[0], "addEventListener");
      const textareaSpy = vi.spyOn(fields[1], "addEventListener");
      eventHandlingFns.subscribeToInputChanges(fields, {});

      expect(inputSpy).toHaveBeenCalledTimes(3);
      expect(inputSpy).toHaveBeenNthCalledWith(
        1,
        "change",
        expect.any(Function)
      );
      expect(inputSpy).toHaveBeenNthCalledWith(
        2,
        "focus",
        expect.any(Function)
      );
      expect(inputSpy).toHaveBeenNthCalledWith(3, "blur", expect.any(Function));
      expect(textareaSpy).toHaveBeenCalledTimes(3);
      expect(textareaSpy).toHaveBeenNthCalledWith(
        1,
        "change",
        expect.any(Function)
      );
      expect(textareaSpy).toHaveBeenNthCalledWith(
        2,
        "focus",
        expect.any(Function)
      );
      expect(textareaSpy).toHaveBeenNthCalledWith(
        3,
        "blur",
        expect.any(Function)
      );
    });

    it("Should attach listener to input event instead of change when validateOn option is equal to input for the specified field.", () => {
      const inputSpy = vi.spyOn(fields[0], "addEventListener");
      const textareaSpy = vi.spyOn(fields[1], "addEventListener");
      eventHandlingFns.subscribeToInputChanges(
        fields,
        {},
        { email: { validateOn: "input" } }
      );

      expect(inputSpy).toHaveBeenCalledTimes(3);
      expect(inputSpy).toHaveBeenNthCalledWith(
        1,
        "input",
        expect.any(Function)
      );
      expect(textareaSpy).toHaveBeenCalledTimes(3);
      expect(textareaSpy).toHaveBeenNthCalledWith(
        1,
        "change",
        expect.any(Function)
      );
    });

    it("Should return an object with all the callbacks.", () => {
      const callbacks = eventHandlingFns.subscribeToInputChanges(fields, {});

      expect(callbacks).toEqual({
        comments: {
          blur: expectOfTypeFunction,
          change: expectOfTypeFunction,
          focus: expectOfTypeFunction,
        },
        email: {
          blur: expectOfTypeFunction,
          change: expectOfTypeFunction,
          focus: expectOfTypeFunction,
        },
      });
    });
  });

  describe("unsubscribeFromInputChanges", () => {
    it("Should remove every event listener from each input.", () => {
      const inputSpy = vi.spyOn(fields[0], "removeEventListener");
      const textareaSpy = vi.spyOn(fields[1], "removeEventListener");
      eventHandlingFns.unsubscribeFromInputChanges(fields, {
        email: { change: vi.fn(), blur: vi.fn(), focus: vi.fn() },
        comments: { change: vi.fn(), blur: vi.fn(), focus: vi.fn() },
      });

      expect(inputSpy).toHaveBeenCalledTimes(3);
      expect(inputSpy).toHaveBeenNthCalledWith(
        1,
        "change",
        expect.any(Function)
      );
      expect(inputSpy).toHaveBeenNthCalledWith(
        2,
        "focus",
        expect.any(Function)
      );
      expect(inputSpy).toHaveBeenNthCalledWith(3, "blur", expect.any(Function));
      expect(textareaSpy).toHaveBeenCalledTimes(3);
      expect(textareaSpy).toHaveBeenNthCalledWith(
        1,
        "change",
        expect.any(Function)
      );
      expect(textareaSpy).toHaveBeenNthCalledWith(
        2,
        "focus",
        expect.any(Function)
      );
      expect(textareaSpy).toHaveBeenNthCalledWith(
        3,
        "blur",
        expect.any(Function)
      );
    });

    it("Should remove 'input' event listener when the option is passed to the specified field.", () => {
      const inputSpy = vi.spyOn(fields[0], "removeEventListener");
      eventHandlingFns.unsubscribeFromInputChanges(
        fields,
        {
          email: { change: vi.fn(), blur: vi.fn(), focus: vi.fn() },
          comments: { change: vi.fn(), blur: vi.fn(), focus: vi.fn() },
        },
        { email: { validateOn: "input" } }
      );

      expect(inputSpy).toHaveBeenNthCalledWith(
        1,
        "input",
        expect.any(Function)
      );
    });
  });

  describe("subscribeToSubmitEvent", () => {
    it("Should call onSubmit.", () => {
      const onSubmitSpy = vi.spyOn(eventHandlingFns, "onSubmit");

      eventHandlingFns.subscribeToSubmitEvent(form, fields, {});

      expect(onSubmitSpy).toHaveBeenCalledTimes(1);
    });

    it("Should add a submit event listener to the form element.", () => {
      const onSubmitSpy = vi.spyOn(eventHandlingFns, "onSubmit");
      const formSpy = vi.spyOn(form, "addEventListener");

      eventHandlingFns.subscribeToSubmitEvent(form, fields, {});

      expect(onSubmitSpy).toHaveBeenCalledTimes(1);
      expect(formSpy).toHaveBeenCalledWith("submit", expect.any(Function));
    });

    it("Should return the attached callback.", () => {
      const callback = eventHandlingFns.subscribeToSubmitEvent(
        form,
        fields,
        {}
      );

      expect(callback).toEqual(expectOfTypeFunction);
    });
  });

  describe("usubscribeFromSubmitEvent", () => {
    it("Should remove submit event listener from the form.", () => {
      const formSpy = vi.spyOn(form, "removeEventListener");

      eventHandlingFns.unsubscribeFromSubmitEvent(form, vi.fn());

      expect(formSpy).toHaveBeenCalledTimes(1);
      expect(formSpy).toHaveBeenCalledWith("submit", expect.any(Function));
    });
  });

  describe("onFocus", () => {
    it("Should return a function that, when executed, updates isFocused to true within formData.", () => {
      const formData = generateFormData();
      const focusEvent = eventHandlingFns.onFocus(fields[0], formData);
      focusEvent({} as Event);

      expect(formData.email.isFocused).toBe(true);
    });

    it("Should return a function that, when executed, emits an event using the behavior subject if emitOn option is not passed.", () => {
      const formData = generateFormData();
      const focusEvent = eventHandlingFns.onFocus(fields[0], formData);
      focusEvent({} as Event);

      expect(emit).toHaveBeenCalledWith("focus", formData.email);
    });

    it("Should return a function that, when executed, should NOT call emit if emitOn options is defined but focus is not in the array.", () => {
      const formData = generateFormData();
      const focusEvent = eventHandlingFns.onFocus(fields[0], formData, {
        emitOn: [],
      });
      focusEvent({} as Event);

      expect(emit).not.toHaveBeenCalled();
    });

    it("Should return a function that, when executed, should call emit if emitOn options is defined and focus is in the array.", () => {
      const formData = generateFormData();
      const focusEvent = eventHandlingFns.onFocus(fields[0], formData, {
        emitOn: ["focus"],
      });
      focusEvent({} as Event);

      expect(emit).toHaveBeenCalledWith("focus", formData.email);
    });
  });

  describe("onBlur", () => {
    it("Should return a function that, when executed, updates isFocused to false and isTouched to true within formData.", () => {
      const applyFieldValidationSpy = vi.spyOn(
        validationFns,
        "applyFieldValidation"
      );
      const formData = generateFormData({ email: { isFocused: true } });
      const blurEvent = eventHandlingFns.onBlur(fields[0], formData);
      blurEvent({} as Event);

      expect(formData.email.isFocused).toBe(false);
      expect(formData.email.isTouched).toBe(true);
      expect(applyFieldValidationSpy).not.toHaveBeenCalled();
    });

    it("Should return a function that, when executed, isTouched is false and validateDirtyOnly is false, calls applyFieldValidation.", () => {
      const applyFieldValidationSpy = vi.spyOn(
        validationFns,
        "applyFieldValidation"
      );
      const formData = generateFormData({ email: { isFocused: true } });
      const blurEvent = eventHandlingFns.onBlur(fields[0], formData, {
        validateDirtyOnly: false,
      });
      blurEvent({} as Event);

      expect(applyFieldValidationSpy).toHaveBeenCalled();
    });

    it("Should return a function that, when executed, emits an event using the behavior subject if emitOn is not passed.", () => {
      const formData = generateFormData();

      const blurEvent = eventHandlingFns.onBlur(fields[0], formData);
      blurEvent({} as Event);

      expect(emit).toHaveBeenCalledWith("blur", formData.email);
    });

    it("Should return a function that, when executed, should NOT call emit if emitOn options is defined but blur is not in the array.", () => {
      const formData = generateFormData();
      const blurEvent = eventHandlingFns.onBlur(fields[0], formData, {
        emitOn: [],
      });
      blurEvent({} as Event);

      expect(emit).not.toHaveBeenCalled();
    });

    it("Should return a function that, when executed, should call emit if emitOn options is defined and blur is in the array.", () => {
      const formData = generateFormData();
      const blurEvent = eventHandlingFns.onBlur(fields[0], formData, {
        emitOn: ["blur"],
      });
      blurEvent({} as Event);

      expect(emit).toHaveBeenCalledWith("blur", formData.email);
    });
  });

  describe("onChange", () => {
    it("Should return a function that, when executed, updates value and isDirty within formData and calls applyFieldValidation and emit.", () => {
      const applyFieldValidationSpy = vi.spyOn(
        validationFns,
        "applyFieldValidation"
      );
      const mockEmail = "test@mail.com";
      const formData = generateFormData();

      const changeEvent = eventHandlingFns.onChange(fields[0], formData);
      changeEvent({ target: { value: mockEmail } } as unknown as Event);

      expect(formData.email.value).toBe(mockEmail);
      expect(formData.email.isDirty).toBe(true);
      expect(applyFieldValidationSpy).toHaveBeenCalled();
      expect(emit).toHaveBeenCalledWith("change", formData.email);
    });

    it("Should update the value using a boolean if the element is a checkbox.", () => {
      const formData = generateFormData();

      const changeEvent = eventHandlingFns.onChange(
        generateStandaloneInput([
          { attr: "type", value: InputTypes.checkbox },
          { attr: "value", value: "" },
          { attr: "name", value: "email" },
        ]),
        formData
      );
      changeEvent({ target: { checked: true } } as unknown as Event);

      expect(formData.email.value).toBe(true);
    });

    it("Should call emit with input instead of change if validateOn value is input.", () => {
      const mockEmail = "test@mail.com";
      const formData = generateFormData();

      const changeEvent = eventHandlingFns.onChange(fields[0], formData, {
        validateOn: "input",
      });
      changeEvent({ target: { value: mockEmail } } as unknown as Event);

      expect(emit).toHaveBeenCalledWith("input", formData.email);
    });

    it("Should return a function that, when executed, should NOT call emit if emitOn options is defined but 'change' is not in the array.", () => {
      const formData = generateFormData();
      const changeEvent = eventHandlingFns.onChange(fields[0], formData, {
        emitOn: [],
      });
      changeEvent({ target: { value: "" } } as unknown as Event);

      expect(emit).not.toHaveBeenCalled();
    });

    it("Should return a function that, when executed, should call emit if emitOn options is defined and 'change' is in the array.", () => {
      const formData = generateFormData();
      const changeEvent = eventHandlingFns.onChange(fields[0], formData, {
        emitOn: ["change"],
      });

      changeEvent({ target: { value: "" } } as unknown as Event);

      expect(emit).toHaveBeenCalledWith("change", formData.email);
    });

    it("Should return a function that, when executed, should call emit if emitOn options is defined and 'input' is in the array.", () => {
      const formData = generateFormData();
      const changeEvent = eventHandlingFns.onChange(fields[0], formData, {
        validateOn: "input",
        emitOn: ["input"],
      });

      changeEvent({ target: { value: "" } } as unknown as Event);

      expect(emit).toHaveBeenCalledWith("input", formData.email);
    });
  });

  describe("onSubmit", () => {
    it("Should return a function that, when executed, calls preventDefault.", () => {
      const preventDefaultMock = vi.fn();
      const formData = generateFormData();

      const submitEvent = eventHandlingFns.onSubmit(fields, formData);
      submitEvent({ preventDefault: preventDefaultMock } as unknown as Event);

      expect(preventDefaultMock).toHaveBeenCalled();
    });

    it("Should call applyFieldValidation 1 time per input passing undefined when there are no validators.", () => {
      const applyFieldValidationSpy = vi.spyOn(
        validationFns,
        "applyFieldValidation"
      );
      const formData = generateFormData();

      const submitEvent = eventHandlingFns.onSubmit(fields, formData);
      submitEvent({ preventDefault: vi.fn() } as unknown as Event);

      expect(applyFieldValidationSpy).toHaveBeenCalledTimes(2);
      expect(applyFieldValidationSpy).toHaveBeenNthCalledWith(
        1,
        fields[0],
        formData,
        undefined
      );
      expect(applyFieldValidationSpy).toHaveBeenNthCalledWith(
        2,
        fields[1],
        formData,
        undefined
      );
    });

    it("Should call applyFieldValidation 1 time per input passing validator functions when passed within options.", () => {
      const applyFieldValidationSpy = vi.spyOn(
        validationFns,
        "applyFieldValidation"
      );
      const validators = { validators: [(v: string) => !!v] };
      const formData = generateFormData();

      const submitEvent = eventHandlingFns.onSubmit(fields, formData, {
        email: validators,
        comments: validators,
      });
      submitEvent({ preventDefault: vi.fn() } as unknown as Event);

      expect(applyFieldValidationSpy).toHaveBeenCalledTimes(2);
      expect(applyFieldValidationSpy).toHaveBeenNthCalledWith(
        1,
        fields[0],
        formData,
        validators
      );
      expect(applyFieldValidationSpy).toHaveBeenNthCalledWith(
        2,
        fields[1],
        formData,
        validators
      );
    });

    it("Should emit the updated form data and a validity boolean.", () => {
      const formData = generateFormData();

      const submitEvent = eventHandlingFns.onSubmit(fields, formData);
      submitEvent({ preventDefault: vi.fn() } as unknown as Event);

      expect(emit).toHaveBeenCalledWith("submit", {
        formData,
        isValid: true,
      });
    });

    it("Should emit the updated form data and isValid in false when at least one validator function fails.", () => {
      const validators = {
        validators: [(v: string) => v.length > 100 || "Error"],
      };
      const formData = generateFormData();

      const submitEvent = eventHandlingFns.onSubmit(fields, formData, {
        email: validators,
        comments: validators,
      });
      submitEvent({ preventDefault: vi.fn() } as unknown as Event);

      expect(emit).toHaveBeenCalledWith("submit", {
        formData,
        isValid: false,
      });
    });
  });
});
