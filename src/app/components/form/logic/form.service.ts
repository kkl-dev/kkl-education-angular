import { FormControl, FormBuilder } from '@angular/forms';
import { Injectable } from '@angular/core';
import { QuestionBase } from './question-base';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor(
    private fb: FormBuilder
  ) { }


  private errorsMessage = {
    'required': (key: string): string => `${key} is required`,
    'pattern': (key: string): string => `${key} is not in  valid format`,
    'string.empty': (key: string): string => `${key} is required`,
    'number.base': (key: string): string => `${key} must be a number`,
  };


  private setGroup(formTemplate: QuestionBase<string>[]) {
    return formTemplate.map((question) => question).reduce((acc, control) => {
      const { key, value, isGroup, group, validations } = control;
      return { ...acc, [key]: isGroup ? this.setGroup(group) : [value, validations] };
    }, {});
  }

  private formatForm(questions) {
    return questions.map((question) => {
      const { key, value, isGroup, group, validations } = question;
      return {
        key: key,
        isGroup,
        template: isGroup ? this.setGroup(group) : [value, validations]
      };
    });
  }

  public setForm(formTemplate: any[]) {
    return formTemplate.map((question) => question).reduce((acc, control) => {
      const { key, isGroup, template } = control;
      return { ...acc, [key]: isGroup ? this.fb.group(template) : this.fb.control(template[0], template[1]) };
    }, {});

  }

  public buildGroup(questions: QuestionBase<string>[]) {
    return this.fb.group(this.setForm(this.formatForm(questions)))
  }


  // handle input error messages
  public getErrorMessage(control: FormControl, placeHolder: string): string {

    if (control.hasError('required')) {
      return 'שדה חובה ';
    }

    if (control.hasError('min')) {
      return 'ערך קצר מידי ';
    }


    if (control.hasError('pattern')) {
      return `invalid ${placeHolder} format`;
    }

    return ''

  }



}
