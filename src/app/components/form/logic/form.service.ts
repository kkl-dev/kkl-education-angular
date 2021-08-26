import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { Injectable } from '@angular/core';
import { QuestionBase } from './question-base';

export interface FormTemplate {
  label?: string;
  hasGroups?: boolean;
  cols?: string | number;
  formCols?: string | number;
  questions?: QuestionBase<string | Date | number>[];
  questionsGroups?: QuestionGroup[];
}

export interface QuestionGroup {
  key?: string;
  label?: string;
  cols?: string | number;
  isGroup?: boolean;
  questions?: QuestionBase<string | Date | number>[];
  hasButton?: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class FormService {
  constructor(private fb: FormBuilder) {}

  private errorsMessage = {
    required: (key: string): string => `${key} is required`,
    pattern: (key: string): string => `${key} is not in  valid format`,
    'string.empty': (key: string): string => `${key} is required`,
    'number.base': (key: string): string => `${key} must be a number`,
  };

  private setGroup(questions: QuestionBase<string | Date | number>[]) {
    return questions
      .map((question) => question)
      .reduce((acc, control) => {
        const { key, value, isGroup, group, validations } = control;
        return {
          ...acc,
          [key]: isGroup ? this.setGroup(group) : [value || '', validations],
        };
      }, {});
  }

  private formatForm(questions) {
    return questions.map((question) => {
      const { key, value, isGroup, group, validations } = question;
      return {
        key: key,
        isGroup,
        template: isGroup ? this.setGroup(group) : [value, validations],
      };
    });
  }

  private setForm(formTemplate: any[]) {
    return formTemplate
      .map((question) => question)
      .reduce((acc, control) => {
        const { key, isGroup, template } = control;
        return {
          ...acc,
          [key]: isGroup
            ? this.fb.group(template)
            : this.fb.control(template[0], template[1]),
        };
      }, {});
  }

  public buildForm(questions: QuestionBase<string | number | Date>[]) {
    return this.fb.group(this.setForm(this.formatForm(questions)));
  }

  private reduceArrayToObject(arr: any[]) {
    return arr
      .map((item) => item)
      .reduce((acc, control) => {
        return {
          ...acc,
          ...control,
        };
      }, {});
  }

  public setFormGroup(formTemplate: FormTemplate): FormGroup {
    if (formTemplate.hasGroups) {
      const form = formTemplate.questionsGroups.map((group: QuestionGroup) => {
        const { key, questions } = group;
        return {
          [key]: this.fb.group(this.setGroup(questions)),
        };
      });
      return this.fb.group(this.reduceArrayToObject(form));
    } else
      return this.fb.group(
        this.setForm(this.formatForm(formTemplate.questions))
      );
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

    return '';
  }
}
