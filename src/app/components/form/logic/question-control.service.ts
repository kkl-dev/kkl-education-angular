import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';

import { QuestionBase } from './question-base';

@Injectable()
export class QuestionControlService {
  constructor(
    private fb: FormBuilder
  ) { }

  public toFormGroup(questions: QuestionBase<string>[]) {
    const group: any = {};

    questions.forEach((question) => {
      group[question.key]
        ? new FormControl(question.value || '', Validators.required)
        : new FormControl(question.value || '');
    });
    return new FormGroup(group);
  }

  private setFormGroup = (formTemplate: QuestionBase<string>[]) => formTemplate.map((question) => question).reduce((acc, control) => {
    const { key, label, validations } = control;
    return { ...acc, [key || label.toLowerCase()]: validations };
  }, {});


  public setGroup(quiestions: QuestionBase<string>[]) {
    return this.fb.group(this.setFormGroup(quiestions))
  }
}
