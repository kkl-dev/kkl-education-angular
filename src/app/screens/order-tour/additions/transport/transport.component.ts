import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
import { QuestionCalendar } from 'src/app/components/form/logic/question-calendar';
import { QuestionSelect } from 'src/app/components/form/logic/question-select';
import { QuestionTextarea } from 'src/app/components/form/logic/question-textarea';
import { QuestionTextbox } from 'src/app/components/form/logic/question-textbox';

@Component({
  selector: 'app-transport',
  templateUrl: './transport.component.html',
  styleUrls: ['./transport.component.scss'],
})
export class TransportComponent implements OnInit {
  public transportForm: QuestionBase<string>[] = [
    new QuestionTextbox({
      key: 'total',
      label: 'סה"כ',
      value: '',
      validations: [Validators.required],
    }),
    new QuestionTextbox({
      key: 'customeCost',
      label: 'חיוב לקוח',
      value: '',
      validations: [Validators.required],
    }),
    new QuestionTextbox({
      key: 'suplierCost',
      label: 'חיוב ספק',
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
      key: 'participants',
      label: 'משתתפים',
      value: '',
      validations: [Validators.required],
    }),

    new QuestionTextbox({
      key: 'quentity',
      label: 'כמות',
      value: '',
      validations: [Validators.required],
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

    new QuestionSelect({
      key: 'suplier',
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
  ];
  public gatherForm: QuestionBase<string | Date>[] = [
    new QuestionTextbox({
      key: 'scatterAddress',
      label: 'כתובת פיזור',
      value: '',
      validations: [Validators.required],
      icon: 'place',
    }),

    new QuestionTextbox({
      key: 'scatterLocation',
      label: 'שם מקום פיזור',
      value: '',
      validations: [Validators.required],
      icon: 'place',
    }),

    new QuestionTextbox({
      key: 'gatherHour',
      label: 'שעת פיזור',
      icon: 'schedule',
      type: 'time',
      validations: [Validators.required],
      inputProps: {
        labelLength: 'extraWide',
      },
    }),

    new QuestionCalendar({
      key: 'gatherDate',
      label: 'תאריך פיזור',
      validations: [Validators.required],
    }),

    new QuestionTextbox({
      key: 'gatherAddress',
      label: 'כתובת איסוף',
      value: '',
      validations: [Validators.required],
      icon: 'place',
      inputProps: {
        labelLength: 'extraWide',
      },
    }),

    new QuestionTextbox({
      key: 'gatherLocation',
      label: 'שם מקום איסוף',
      value: '',
      icon: 'place',
      validations: [Validators.required],
      inputProps: {
        labelLength: 'extraWide',
      },
    }),
    new QuestionTextbox({
      key: 'gatherHour',
      label: 'שעת איסוף',
      icon: 'schedule',
      type: 'time',
      validations: [Validators.required],
    }),

    new QuestionCalendar({
      key: 'gatherDate',
      label: 'תאריך איסוף',
      validations: [Validators.required],
      inputProps: {
        labelLength: 'extraWide',
      },
    }),
    new QuestionTextarea({
      key: 'comments',
      label: 'הערות',
      cols: '8',
      inputProps: {
        labelLength: 'small',
      },
    }),
  ];

  constructor() {}

  ngOnInit(): void {}
}
