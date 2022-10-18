import { BehaviorSubject } from "rxjs";

export const subject = new BehaviorSubject({});

/**
 * Emits an event using a BehaviorSubject.
 */
export function emit(event: string, data: unknown) {
  !subject.closed && subject.next({ event, data });
}
