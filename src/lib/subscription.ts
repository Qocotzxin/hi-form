import { FormulaValue } from "./types";
import formSubject from "./utils/formSubject";

/**
 * Emits an event using a BehaviorSubject.
 */
export function emit<T extends string>(eventData: FormulaValue<T>) {
  const subject = formSubject.getSubject();
  !subject.closed && subject.next(eventData);
}
