import "./style.scss";
import { formula, FormulaValidators } from "./lib";

const form = formula({
  form: document.querySelector<HTMLFormElement>("form")!,
  fieldOptions: {
    firstName: {
      validators: [
        FormulaValidators.required("This field is required."),
        (value: string) =>
          value.length >= 5 || "Min length should be at least 5 characters.",
      ],
      validateDirtyOnly: false,
      emitOn: ["change"],
    },
    lastName: {
      validators: [(value: string) => !!value.length],
      emitOn: ["change"],
    },
  },
});

form.subscribe(console.log);
