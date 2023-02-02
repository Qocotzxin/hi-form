import { Subject } from "rxjs";
import { HiFormValue } from "../types";

class FormSubject {
  private subject: Subject<HiFormValue<any>> = new Subject();

  getSubject() {
    if (this.subject.closed) {
      this.subject = new Subject();
    }

    return this.subject;
  }
}

export default new FormSubject();
