import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
import { QuestionGroup } from 'src/app/components/form/logic/question-group';
import { QuestionSelect } from 'src/app/components/form/logic/question-select';
import { QuestionTextarea } from 'src/app/components/form/logic/question-textarea';
import { QuestionTextbox } from 'src/app/components/form/logic/question-textbox';
import { TransportModel } from '../models/transport.model';

@Injectable({
  providedIn: 'root',
})
export class TransportService {
  public details: QuestionBase<string>[] = [
    new QuestionSelect({
      key: 'supplier',
      label: 'ספק',
      type: 'select',
      validations: [Validators.required],
      inputProps: {
        options: [
          { label: 'solid', value: 'solid' },
          { label: 'great', value: 'great' },
        ],
      },
    }),
    new QuestionSelect({
      key: 'item',
      label: 'בחר פריט',
      type: 'select',
      validations: [Validators.required],
      inputProps: {
        options: [
          { label: 'solid', value: '12123' },
          { label: 'great', value: '23' },
          { label: 'good', value: '123' },
          { label: 'unproven', value: '123123123' },
        ],
      },
    }),

    new QuestionTextbox({
      key: 'quantity',
      label: 'כמות',
      value: '',
      validations: [Validators.required],
    }),

    new QuestionTextbox({
      key: 'participants',
      label: 'משתתפים',
      value: '',
      validations: [Validators.required],
    }),

    new QuestionTextbox({
      key: 'price',
      label: 'מחיר',
      value: '',
      type: 'number',
      validations: [Validators.required],
    }),

    new QuestionTextbox({
      key: 'supplierCost',
      label: 'חיוב ספק',
      value: '',
      validations: [Validators.required],
    }),

    new QuestionTextbox({
      key: 'customerCost',
      label: 'חיוב לקוח',
      value: '',
      validations: [Validators.required],
    }),

    new QuestionTextbox({
      key: 'total',
      label: 'סה"כ',
      value: '',
      validations: [Validators.required],
    }),
  ];

  public locations: QuestionBase<string | Date>[] = [
    new QuestionSelect({
      key: 'pickUpDate',
      icon: 'date_range',
      label: 'תאריך איסוף',
      type: 'select',
      validations: [Validators.required],
      inputProps: {
        options: [
          { label: 'יום 1', value: '1' },
          { label: 'יום 2', value: '2' },
          { label: 'יום 3', value: '3' },
          { label: 'יום 4', value: '4' },
        ],
      },
    }),

    new QuestionTextbox({
      key: 'pickUpHour',
      label: 'שעת איסוף',
      icon: 'schedule',
      type: 'custom',
      validations: [Validators.required], 
    }),

    new QuestionTextbox({
      key: 'pickUpLocation',
      label: 'מקום איסוף',
      value: '',
      icon: 'place',
      validations: [Validators.required],
      inputProps: {
        // labelSize: 's5',
      },
    }),

    new QuestionTextbox({
      key: 'pickUpAddress',
      label: 'כתובת איסוף',
      value: '',
      validations: [Validators.required],
      icon: 'place',
      inputProps: {
        // labelSize: 's5',
      },
    }),

    new QuestionSelect({
      key: 'dropDownDate',
      label: 'תאריך פיזור',
      icon: 'date_range',
      validations: [Validators.required],
      type: 'select',
      inputProps: {
        options: [
          { label: 'יום 1', value: '1' },
          { label: 'יום 2', value: '2' },
          { label: 'יום 3', value: '3' },
          { label: 'יום 4', value: '4' },
        ],
      },
    }),

    new QuestionTextbox({
      key: 'dropDownHour',
      label: 'שעת פיזור',
      icon: 'schedule',
      type: 'custom',
      validations: [Validators.required],
      inputProps: {
        // labelSize: 's5',
      },
    }),

  ];

  public comments: QuestionBase<string>[] = [
    new QuestionTextarea({
      key: 'comments',
      label: 'הערות',
      cols: 6,
      rows: 6,
      value: '',
    }),
  ];

  public questionGroups: QuestionGroup[] = [
    {
      key: 'details',
      questions: this.details,
      cols: 8,
    },
    {
      key: 'locations',
      questions: this.locations,
      cols: 6,
    },
    {
      key: 'comments',
      questions: this.comments,
      hasBottomButton : true,
      cols: 8,
    },
  ];

  private findItemIndex(arr: any, key: string, value: any): number {
    return arr.findIndex((item) => item[key] === value);
  }

  public setInitialValues(
    questions: QuestionBase<string | number | Date | QuestionGroup>[],
    data: any
  ) {
    questions.map((control: QuestionBase<string | number | Date | QuestionGroup>) => {
      control.value = data[control.key];
      if (control.key === 'comments') {
        control.value = data;
      }
    });
  }

  public setFormValues(data: TransportModel) {
    this.questionGroups.map((group: QuestionGroup) => {
      this.setInitialValues(group.questions, data[group.key]);
    });
  }

  constructor() { }
}
