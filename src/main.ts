import "./style.scss";
import { formula } from "./lib";

const form = formula(document.querySelector<HTMLFormElement>("form")!, {
  firstName: {
    validators: [
      (value: string) => !!value || "This field is required.",
      (value: string) =>
        value.length >= 5 || "Min length should be at least 5 characters.",
    ],
    validateDirtyOnly: false,
  },
  lastName: { validators: [(value: string) => !!value.length] },
  age: { validators: [(value: number) => value > 18] },
});

form.subscribe(console.log);
