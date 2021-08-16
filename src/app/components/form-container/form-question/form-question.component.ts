import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { QuestionBase } from '../question-base';

@Component({
  selector: 'app-form-question',
  templateUrl: './form-question.component.html',
  styleUrls: ['./form-question.component.scss']
})
<<<<<<< HEAD:src/app/components/form-container/form-question/form-question.component.ts
export class FormQuestionComponent {
  @Input() question!: QuestionBase<string>;
=======
export class DynamicFormQuestionComponent {
  @Input() question!: QuestionBase<string | Date>;
>>>>>>> 7aaf2f4e5e1b4ca11e396356f055d521d20177e8:src/app/components/form-container/dynamic-form-question/dynamic-form-question.component.ts
  @Input() form!: FormGroup;
  get isValid() { return this.form.controls[this.question.key].valid; }
}
