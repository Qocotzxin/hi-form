# HiForm

### Agnostic forms library.

**HiForm** is a simple a simple form library that aims to provide the simplest API possible to manipulate forms. HiForm goal is to be agnostic but for it only be tested using vanilla JS/TS and SolidJS.

## Usage

HiForm works with native HTML forms. Because of this, every input should have a name and in order to trigger the form submit, there needs to be a button with type="submit".

```
<form>
    <div>
      <label for="firstName">First name</label>
      <input id="firstName" name="firstName" type="text" />
      <label for="lastName">Last name</label>
      <input id="lastName" name="lastName" type="text" />
      <label for="age">Age</label>
      <input id="age" name="age" type="number" />
      <button type="submit">Submit</button>
    </div>
</form>
```

If you see this example you will notice there are no extra attributes or binding that needs to happen, just a plain html form.

Then, data manipulation will happen purely in Javascript through a minimal API. In order to start using hiForm you need to call the `hiForm` function and pass a `form` element to it.
Then is just a matter of subscribing to the changes by calling `subscribe`:

```
// Currently it only works locally so it should be imported from "./lib"
import { hiForm } from 'hiForm';

const form = hiForm({form: document.querySelector<HTMLFormElement>("form")!});

form.subscribe(console.log);
```

This is a simple example which will display every event emitted by hiForm, but you can pass options to start building more complex forms:

```
import { hiForm } from 'hiForm';

const form = hiForm({form: document.querySelector<HTMLFormElement>("form")!, fieldOptions: {
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
}});

form.subscribe(console.log);
```

In this case we pass a second argument called `fieldOptions` that is an object where each key is an input `name` (the value you provided for name attribute) and the value is an object with multiple options that will apply for the specified field. Every configuration key is optional:

- `validators?: HiFormValidationFn[]` - an array of functions which should return a boolean or a string (`(value: any) => boolean | string`). The string returned by this function is usually an error message associated to the validation that failed.
- `validateOn?: "input" | "change";` - hiForm runs validations on different events, one of those is the `change` event. But the change event can be replaced by `input` event if you want to run validations each time the user types something in. Due to performance, `change` is recommended and is the default behavior, but `input` can be useful in several cases.
- `validateDirtyOnly?: boolean` - by default hiForm won't run validations on `blur` if the input value never changed (which means the user never typed any value). This behavior can be changed by setting `validateDirtyOnly` to `false` in which case, validations will be executed when the user focus the input and then leaves (e.g.: when moving through the inputs using `tab`).
- `emitOn?: Array<"change" | "input" | "focus" | "blur">` - an array of events to choose which ones will be emitted. If no array is passed then all events are emitted but if an empty array is passed, only submit event will be emitted (submit event is not optional).

There is also a third argument called `globalOptions`. As you might have already guessed, this will apply options for every input instead of declaring them in a granular way. It accepts the same options as the `fieldOptions` field.

```
import { hiForm } from 'hiForm';

const form = hiForm({
  form: document.querySelector<HTMLFormElement>("form")!,
  fieldOptions: {
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
},
globalOptions: {
  validateOn: "input"
}
});

form.subscribe(console.log);
```

It's worth noting that, when passing both types of options, `fieldOptions` will override `globalOptions` for primitive values that are declared in both of them, for example:

```
import { hiForm } from 'hiForm';

const form = hiForm({
  form: document.querySelector<HTMLFormElement>("form")!,
  fieldOptions: {
  firstName: {
    validators: [
      (value: string) =>
        value.length >= 5 || "Min length should be at least 5 characters.",
    ],
    validateDirtyOnly: false,
  },
  lastName: { validators: [(value: string) => !!value.length] },
  age: { validators: [(value: number) => value > 18] },
},
globalOptions: {
  validateDirtyOnly: true,
  validators: [HiFormValidators.required()]
}
});

form.subscribe(console.log);
```

Here "validateDirtyOnly" will still be false for "firstName" field, but true for the rest and the validators are gonna be applied in order, first globals and then field ones. Keep in mind error messages will be added to the error messages array in order of execution, so in this case, if all validations fails, the first error message will be the one returned by the `required` validation and then the one from the custom min length validation function.

### Subscribing

As mentioned before, hiForm exposes a `subscribe` function which you can use to pass a function to be executed each time `hiForm` emits an event. This function will receive as parameter an object with the name of the event - can be `focus`, `blur`, `change` (even if you pass `input` as value for `validateOn` the event name will be `change`) or `submit` - and the state of the field (or in the case of submit of all fields). The structure of the field state is the following:

- `isFocused` - will be `false` until the user **focus the field at least 1 time**.
- `value` - the current `value` of the field.
- `isValid` - if **validator functions** are provided and **at least 1 fails**, this will be `false`, else it always be `true`.
- `isTouched` - will be `false` until the user **focus and leaves** the field.
- `isDirty` - will be `false` until the user **types something** in the field (it doesn't matter if then the content is deleted by the user).
- `errors` - will be an empty `array` by default. If validator functions are provided and they fail, all error messages returned by those functions will be stored here **in the order they were executed** (the same order they are passed in the configuration).

### Validations.

HiForm exposes some built-in validator functions that can be used to simplify the experience. These validators are useful when you want to display an error message for the user in a different way than native HTML does, but keep in mind you can keep the code extremely simple by just using HTML native validations. So to put it simple, HiForm provides 3 ways of validating an input:

- Native HTML validations
  - Just pass them to the input and they will just work :)
- Custom functions
  - Function with the signature `(value: any, inputName?: string) => boolean | string;`. If the condition you want to validate is false, you can return a string (which will be added into the errors array so you can use it as error message) and use the second parameter which is the input name.
- Built-in validations
  - By importing `HiFormValidators` you will have access to a set of basic but useful validations that, as the custom functions, use the input name to return a default error message when the validation fails if you don't pass one. The list of built-in validators include `required`, `email`, `minLength`, `maxLength` and `pattern`.

The three of them will set the `aria-invalid` attribute to the input when failing, but native HTML validation will display the native HTML error-like tooltip, while the other show allows you to display a custom message in whatever way you want. HTML validation are extremely powerful, but sometimes designs are more complex, that's why HiForm offers other options as well.

### Styling fields with errors

When hiForm runs validations, it does not only take care about sending an event, but also adding the attribute `aria-invalid` to the specific input which can be used to style the input with css, something like this:

```
input[aria-invalid="true"] {
    outline: 2px solid #f56565;
}
```

### Working example using SolidJS

```
const LoginForm: Component = () => {
  const [formData, setFormData] = createSignal<HiFormValue<
    "email" | "password"
  > | null>(null);
  let ref: HTMLFormElement | undefined;

  onMount(() => {
    const form = hiForm<"email" | "password">({
      form: ref!,
      globalOptions: {
        validateDirtyOnly: false,
      },
    });

    form.subscribe(setFormData);

    onCleanup(form.unsubscribe);
  });

  return (
    <form ref={ref}>
      <div>
        <div>
          <label for="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            required
          />
          <p aria-live="polite">{formData()?.formData.email.errors[0]}</p>
        </div>
        <button
          type="submit"
          onClick={console.log}
          disabled={!formData()?.formState.isValid}
        >
          Submit
        </button>
      </div>
    </form>
  );
};
```

## Upcoming features/fixes

- Add more predefined validators.
- Analyze if a state for isSubmitting + onSubmit callback API is worth.
