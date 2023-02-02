import "./style.scss";
import { hiForm, HiFormValidators } from "./lib";

const form = hiForm({
  form: document.querySelector<HTMLFormElement>("form")!,
  fieldOptions: {
    firstName: {
      validators: [
        HiFormValidators.required("This field is required."),
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
