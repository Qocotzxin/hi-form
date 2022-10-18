import { test, expect, describe } from "vitest";
import { getInputsAsArray } from "../dom";
import { generateForm } from "../utils/testing";

// This is a form that has only inputs and textareas.
const { form } = generateForm();

describe("DOM functions.", () => {
  describe("getInputsAsArray", () => {
    test("Should have as much elements as inputs, textareas and selects exists in a form without throwing error when a type of element is not there.", () => {
      expect(getInputsAsArray(form).length).toBe(2);
    });
  });
});
