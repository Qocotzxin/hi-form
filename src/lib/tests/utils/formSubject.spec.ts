import formSubject from "../../utils/formSubject";
import { describe, it, expect } from "vitest";
import { Subject } from "rxjs";

describe("formSubject", () => {
  it("Should return a valid rxjs subject when calling getSubject.", () => {
    expect(formSubject.getSubject()).toBeInstanceOf(Subject);
  });

  it("Should return a valid rxjs subject (should be able to subscribe to it) when the current one is closed.", () => {
    let subject = formSubject.getSubject();

    subject.subscribe();
    subject.unsubscribe();

    expect(() => subject.subscribe(console.log)).toThrow();

    subject = formSubject.getSubject();

    expect(subject).toBeInstanceOf(Subject);
    expect(() => subject.subscribe(console.log)).not.toThrow();
  });
});
