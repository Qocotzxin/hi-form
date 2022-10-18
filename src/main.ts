import "./style.scss";
import { formula } from "./lib";

const form = formula(document.querySelector<HTMLFormElement>("form")!, {
  firstName: {
    validators: [(value: string) => value.length > 5],
    validateDirtyOnly: false,
  },
  lastName: { validators: [(value: string) => !!value.length] },
  age: { validators: [(value: number) => value > 18] },
});

form.subscribe(console.log);

document.querySelector("button")?.addEventListener("click", (e: Event) => {
  e.preventDefault();
  form.submit();
});
