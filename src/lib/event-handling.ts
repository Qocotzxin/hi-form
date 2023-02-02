import { emit } from "./subscription";
import {
  ChangeCallbacks,
  FormFields,
  FormulaForm,
  FormulaValidations,
  FormulaFieldOptions,
  UserEvent,
} from "./types";
import { isCheckbox } from "./utils/type-helpers";
import { validationFns } from "./validation";

export const eventHandlingFns = {
  /**
   * Subscribes to input (or change), focus and blur events.
   */
  subscribeToInputChanges: <T extends string>(
    inputs: FormFields[],
    formData: FormulaForm<T>,
    options: Partial<FormulaValidations<T>> = {},
    globalOptions?: FormulaFieldOptions
  ): ChangeCallbacks => {
    const fns: ChangeCallbacks = {};
    const { onChange, onBlur, onFocus } = eventHandlingFns;

    for (const input of inputs) {
      const inputOptions = {
        ...globalOptions,
        ...(options && options[input.name as T]),
      };

      fns[input.name] = {
        // 'Change' is kept as name to simplify internal logic since this is not exposed to the user.
        change: onChange(input, formData, inputOptions),
        focus: onFocus(input, formData, inputOptions),
        blur: onBlur(input, formData, inputOptions),
      };

      input.addEventListener(
        inputOptions?.validateOn || "change",
        fns[input.name].change
      );
      input.addEventListener("focus", fns[input.name].focus);
      input.addEventListener("blur", fns[input.name].blur);
    }

    return fns;
  },

  /**
   * Unsubscribes from input (or change), focus and blur events.
   */
  unsubscribeFromInputChanges: <T extends string>(
    inputs: FormFields[],
    fns: ChangeCallbacks,
    options: Partial<FormulaValidations<T>> = {},
    globalOptions?: FormulaFieldOptions
  ) => {
    for (const input of inputs) {
      const inputOptions = {
        ...globalOptions,
        ...(options && options[input.name as T]),
      };
      input.removeEventListener(
        inputOptions?.validateOn || "change",
        fns[input.name].change!
      );
      input.removeEventListener("focus", fns[input.name].focus);
      input.removeEventListener("blur", fns[input.name].blur);
    }
  },

  /**
   * Subscribes to the form submit event and returns the added listener.
   */
  subscribeToSubmitEvent: <T extends string>(
    form: HTMLFormElement,
    formData: FormulaForm<T>
  ): UserEvent => {
    const { onSubmit } = eventHandlingFns;
    const onSubmitCallback = onSubmit(formData);
    form.addEventListener("submit", onSubmitCallback);
    return onSubmitCallback;
  },

  /**
   * Removes the listener attached to the form submit event.
   */
  unsubscribeFromSubmitEvent: (form: HTMLFormElement, callback: UserEvent) => {
    form.removeEventListener("submit", callback);
  },

  /**
   * Callback to be executed on focus event.
   * Does not execute validation.
   */
  onFocus: <T extends string>(
    input: FormFields,
    formData: FormulaForm<T>,
    inputOptions?: FormulaFieldOptions
  ) => {
    return (_: Event) => {
      formData[input.name as T].isFocused = true;

      if (!inputOptions?.emitOn || inputOptions.emitOn.includes("focus")) {
        emit<T>({
          event: "focus",
          formData,
          formState: { isValid: validationFns.isFormValid(formData) },
        });
      }
    };
  },

  /**
   * Callback to be executed on blur event.
   * Executes conditional validation based on user options.
   */
  onBlur: <T extends string>(
    input: FormFields,
    formData: FormulaForm<T>,
    inputOptions?: FormulaFieldOptions
  ) => {
    return (_: Event) => {
      formData[input.name as T].isFocused = false;

      if (!formData[input.name as T].isTouched) {
        formData[input.name as T].isTouched = true;

        if (inputOptions?.validateDirtyOnly === false) {
          validationFns.applyFieldValidation<T>(input, formData, inputOptions);
        }
      }

      if (!inputOptions?.emitOn || inputOptions?.emitOn.includes("blur")) {
        emit<T>({
          event: "blur",
          formData,
          formState: { isValid: validationFns.isFormValid(formData) },
        });
      }
    };
  },

  /**
   * Callback to be executed on input (or change) event.
   * Always executes validation.
   */
  onChange: <T extends string>(
    input: FormFields,
    formData: FormulaForm<T>,
    inputOptions?: FormulaFieldOptions
  ) => {
    return (e: Event) => {
      const selectedEvent = inputOptions?.validateOn || "change";
      const target = e.target as FormFields;
      formData[input.name as T].value = isCheckbox(input)
        ? !!(target as HTMLInputElement).checked
        : target.value;
      validationFns.applyFieldValidation<T>(input, formData, inputOptions);

      if (!formData[input.name as T].isDirty) {
        formData[input.name as T].isDirty = true;
      }

      if (
        !inputOptions?.emitOn ||
        inputOptions?.emitOn.includes(selectedEvent)
      ) {
        emit<T>({
          event: selectedEvent,
          formData,
          formState: { isValid: validationFns.isFormValid(formData) },
        });
      }
    };
  },

  /**
   * Callback to be executed on submit event.
   * Always executes validation.
   */
  onSubmit: <T extends string>(formData: FormulaForm<T>) => {
    return (e: Event) => {
      e.preventDefault();

      emit<T>({
        event: "submit",
        formData,
        formState: { isValid: validationFns.isFormValid(formData) },
      });
    };
  },
};
