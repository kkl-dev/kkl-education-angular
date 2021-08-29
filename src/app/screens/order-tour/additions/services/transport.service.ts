import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { QuestionGroup } from 'src/app/components/form/logic/form.service';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
import { QuestionCalendar } from 'src/app/components/form/logic/question-calendar';
import { QuestionSelect } from 'src/app/components/form/logic/question-select';
import { QuestionTextarea } from 'src/app/components/form/logic/question-textarea';
import { QuestionTextbox } from 'src/app/components/form/logic/question-textbox';

@Injectable({
  providedIn: 'root',
})
export class TransportService {
  private details: QuestionBase<string>[] = [
    new QuestionSelect({
      key: 'supplier',
      label: 'ספק',
      type: 'select',
      validations: [Validators.required],
      inputProps: {
        options: [
          { key: 'solid', value: '12123' },
          { key: 'great', value: '23' },
          { key: 'good', value: '123' },
          { key: 'unproven', value: '123123123' },
        ],
      },
    }),
    new QuestionSelect({
      key: 'item',
      label: 'בחר פריט',
      type: 'select',
      validations: [Validators.required],
      inputProps: {
        labelLength: 'extraWide',
        options: [
          { key: 'solid', value: '12123' },
          { key: 'great', value: '23' },
          { key: 'good', value: '123' },
          { key: 'unproven', value: '123123123' },
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
  ].reverse();

  private locations: QuestionBase<string | Date>[] = [
    new QuestionSelect({
      key: 'dropDownDate',
      icon: 'date_range',
      label: 'תאריך איסוף',
      validations: [Validators.required],
      inputProps: {
        options: [
          { key: 'יום 1', value: '1' },
          { key: 'יום 2', value: '2' },
          { key: 'יום 3', value: '3' },
          { key: 'יום 4', value: '4' },
        ],
      },
    }),

    new QuestionTextbox({
      key: 'dropDownHour',
      label: 'שעת איסוף',
      icon: 'schedule',
      type: 'time',
      validations: [Validators.required],
    }),

    new QuestionTextbox({
      key: 'pickUpLocation',
      label: 'מקום איסוף',
      value: '',
      icon: 'place',
      validations: [Validators.required],
      inputProps: {
        labelLength: 'extraWide',
      },
    }),

    new QuestionTextbox({
      key: 'pickUpAddress',
      label: 'כתובת איסוף',
      value: '',
      validations: [Validators.required],
      icon: 'place',
      inputProps: {
        labelLength: 'extraWide',
      },
    }),

    new QuestionSelect({
      key: 'pickUpDate',
      label: 'תאריך פיזור',
      icon: 'date_range',
      validations: [Validators.required],
      inputProps: {
        options: [
          { key: 'יום 1', value: '1' },
          { key: 'יום 2', value: '2' },
          { key: 'יום 3', value: '3' },
          { key: 'יום 4', value: '4' },
        ],
      },
    }),

    new QuestionTextbox({
      key: 'pickUpHour',
      label: 'שעת פיזור',
      icon: 'schedule',
      type: 'time',
      validations: [Validators.required],
      inputProps: {
        labelLength: 'extraWide',
      },
    }),
  ].reverse();

  private comments: QuestionBase<string>[] = [
    new QuestionTextarea({
      key: 'comments',
      label: 'הערות',
      cols: 6,
      rows: 6,
      offset: 1,
    }),
  ];

  public questionGroups: QuestionGroup[] = [
    {
      key: 'details',
      questions: this.details,
      cols: 8,
    },
    {
      key: 'pickUp',
      questions: this.locations,
      cols: 6,
    },
    {
      key: 'comments',
      questions: this.comments,
      hasButton: true,
      cols: 8,
    },
  ];

  constructor() {}
}
