import { describe, expect, it, vi } from "vitest";
import { emit } from "../subscription";
import formSubject from "../utils/formSubject";

describe("Subscription functions.", () => {
  describe("emit", () => {
    it("Should call subject.next when is not closed and emit the value passed to emit.", () => {
      const subjectSpy = vi.spyOn(formSubject.getSubject(), "next");

      emit({ event: "blur", formData: {}, formState: { isValid: true } });
      expect(subjectSpy).toHaveBeenCalledWith({
        event: "blur",
        formData: {},
        formState: { isValid: true },
      });
    });
  });
});
