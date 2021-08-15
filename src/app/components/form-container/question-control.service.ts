import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';

import { QuestionBase } from './question-base';

@Injectable()
export class QuestionControlService {

  constructor(
    private fb: FormBuilder
  ) { }

  // public toFormGroup(questions: QuestionBase<string>[]) {
  //   const group: any = {};

  //   questions.forEach((question) => {
  //     group[question.key] = question.required
  //       ? new FormControl(question.value || '', Validators.required)
  //       : new FormControl(question.value || '');
  //   });
  //   return new FormGroup(group);
  // }

  private setFormGroup = (formTemplate: QuestionBase<string>[]) => formTemplate.map((question) => question).reduce((acc, control) => {
    const { key, value, label, validations } = control;
    // console.log(validations)
    // console.log(key)
    return { ...acc, [key || label.toLowerCase()]: [value, validations] };
  }, {});


  public setGroup(quiestions: QuestionBase<string>[]) {
    console.log(this.setFormGroup(quiestions))
    return this.fb.group(this.setFormGroup(quiestions))
  }

  // handle input error messages
  public getErrorMessage(control: FormControl, placeHolder: string): string {

    if (control.hasError('required')) {
      return 'value is required ';
    }

    if (control.hasError('min')) {
      return 'Value in not valid ';
    }
    if (placeHolder === "Password" || placeHolder === "Confirmation Password") {
      return this.passwordCustomErrorMessage(control, placeHolder)
    }

    // if (control.hasError('maxlength')) {
    //   return `${placeHolder} length must be less or equal to ${control.errors.maxlength.requiredLength} characters long`;
    // }

    // if (control.hasError('minlength')) {
    //   return `${placeHolder} length must be at least ${control.errors.minlength.requiredLength} characters long`;
    // }
    if (control.hasError('pattern')) {
      return `invalid ${placeHolder} format`;
    }

    return ''

  }

  public passwordCustomErrorMessage(control: FormControl, placeHolder: string): string {
    if (control.hasError('maxlength') || control.hasError('minlength')) {
      return `${placeHolder} length must be 8-24 characters long`;
    }

    if (control.hasError('pattern')) {
      return ` ${placeHolder} must contain at least one lowercase, uppercase and numeric character`;
    }

    return ''

  }
}
