import { describe, expect, it, vi } from "vitest";
import { eventHandlingFns } from "../event-handling";
import { FormulaForm } from "../types";
import { generateForm } from "../utils/testing";
import { emit } from "../subscription";
import { applyFieldValidation } from "../validation";

const { fields } = generateForm();

vi.mock("../subscription", () => ({
  emit: vi.fn(),
}));

vi.mock("../validation", () => ({
  applyFieldValidation: vi.fn(),
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
      const expectOfTypeFunction = expect.any(Function);
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

  describe("usubscribeFromInputChanges", () => {
    it("Should remove every event listener from each input.", () => {
      const inputSpy = vi.spyOn(fields[0], "removeEventListener");
      const textareaSpy = vi.spyOn(fields[1], "removeEventListener");
      eventHandlingFns.usubscribeFromInputChanges(fields, {
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
      eventHandlingFns.usubscribeFromInputChanges(
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

  describe("onFocus", () => {
    it("Should return a function that, when executed, updates isFocused to true within formData.", () => {
      const formData: FormulaForm = {
        email: {
          isFocused: false,
          value: "",
          isValid: false,
          isTouched: false,
          isDirty: false,
        },
      };
      const focusEvent = eventHandlingFns.onFocus(fields[0], formData);
      focusEvent({} as Event);

      expect(formData.email.isFocused).toBe(true);
    });

    it("Should return a function that, when executed, emits an event using the behavior subject.", () => {
      const formData: FormulaForm = {
        email: {
          isFocused: false,
          value: "",
          isValid: false,
          isTouched: false,
          isDirty: false,
        },
      };
      const focusEvent = eventHandlingFns.onFocus(fields[0], formData);
      focusEvent({} as Event);

      expect(emit).toHaveBeenCalledWith("focus", formData.email);
    });
  });

  describe("onBlur", () => {
    it("Should return a function that, when executed, updates isFocused to false and isTouched to true within formData.", () => {
      const formData: FormulaForm = {
        email: {
          isFocused: true,
          value: "",
          isValid: false,
          isTouched: false,
          isDirty: false,
        },
      };
      const blurEvent = eventHandlingFns.onBlur(fields[0], formData);
      blurEvent({} as Event);

      expect(formData.email.isFocused).toBe(false);
      expect(formData.email.isTouched).toBe(true);
      expect(applyFieldValidation).not.toHaveBeenCalled();
    });

    it("Should return a function that, when executed, isTouched is false and validateDirtyOnly is false, calls applyFieldValidation.", () => {
      const formData: FormulaForm = {
        email: {
          isFocused: true,
          value: "",
          isValid: false,
          isTouched: false,
          isDirty: false,
        },
      };
      const blurEvent = eventHandlingFns.onBlur(fields[0], formData, {
        validateDirtyOnly: false,
      });
      blurEvent({} as Event);

      expect(applyFieldValidation).toHaveBeenCalled();
    });

    it("Should return a function that, when executed, emits an event using the behavior subject.", () => {
      const formData: FormulaForm = {
        email: {
          isFocused: false,
          value: "",
          isValid: false,
          isTouched: false,
          isDirty: false,
        },
      };
      const blurEvent = eventHandlingFns.onBlur(fields[0], formData);
      blurEvent({} as Event);

      expect(emit).toHaveBeenCalledWith("blur", formData.email);
    });
  });

  describe("onChange", () => {
    it("Should return a function that, when executed, updates value and isDirty within formData and calls applyFieldValidation and emit.", () => {
      const mockEmail = "test@mail.com";
      const formData: FormulaForm = {
        email: {
          isFocused: false,
          value: "",
          isValid: false,
          isTouched: false,
          isDirty: false,
        },
      };
      const changeEvent = eventHandlingFns.onChange(fields[0], formData);
      changeEvent({ target: { value: mockEmail } } as unknown as Event);

      expect(formData.email.value).toBe(mockEmail);
      expect(formData.email.isDirty).toBe(true);
      expect(applyFieldValidation).toHaveBeenCalled();
      expect(emit).toHaveBeenCalledWith("change", formData.email);
    });

    it("Should call emit with input instead of change if validateOn value is input.", () => {
      const mockEmail = "test@mail.com";
      const formData: FormulaForm = {
        email: {
          isFocused: false,
          value: "",
          isValid: false,
          isTouched: false,
          isDirty: false,
        },
      };
      const changeEvent = eventHandlingFns.onChange(fields[0], formData, {
        validateOn: "input",
      });
      changeEvent({ target: { value: mockEmail } } as unknown as Event);

      expect(emit).toHaveBeenCalledWith("input", formData.email);
    });
  });
});
