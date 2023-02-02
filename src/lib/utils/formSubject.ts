import { Subject } from "rxjs";
import { FormulaValue } from "../types";

class FormSubject {
  private subject: Subject<FormulaValue<any>> = new Subject();

  getSubject() {
    if (this.subject.closed) {
      this.subject = new Subject();
    }

    return this.subject;
  }
}

export default new FormSubject();
