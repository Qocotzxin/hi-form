import { describe, expect, it, vi } from "vitest";
import { emit, subject } from "../subscription";

describe("Subscription functions.", () => {
  describe("emit", () => {
    it("Should call subject.next when is not closed and emit the value passed to emit.", () => {
      const subjectSpy = vi.spyOn(subject, "next");

      emit("test", {});
      expect(subjectSpy).toHaveBeenCalledWith({ event: "test", data: {} });
    });

    it("Should NOT call subject.next when the observable is closed.", () => {
      subject.unsubscribe();
      const subjectSpy = vi.spyOn(subject, "next");

      emit("test", {});
      expect(subjectSpy).not.toHaveBeenCalled();
    });
  });
});
