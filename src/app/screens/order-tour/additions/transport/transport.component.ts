import { QuestionBase } from 'src/app/components/form-container/question-base';
import { QuestionSelect } from 'src/app/components/form-container/question-select';
import { TextboxQuestion } from 'src/app/components/form-container/question-textbox';
import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-transport',
  templateUrl: './transport.component.html',
  styleUrls: ['./transport.component.scss']
})
export class TransportComponent implements OnInit {

  transportForm: QuestionBase<string>[] = [

    new TextboxQuestion({
      key: 'participants',
      label: 'משתתפים',
      value: '',
      order: 1,
      validations: [Validators.required]
    }),
    new TextboxQuestion({
      key: 'quentity',
      label: 'כמות',
      value: '',
      order: 1,
      validations: [Validators.required]
    }),
    new QuestionSelect({
      key: 'suplier',
      label: 'בחר ספק',
      options: [
        { key: 'solid', value: '12123' },
        { key: 'great', value: '23' },
        { key: 'good', value: '123' },
        { key: 'unproven', value: '123123123' },
      ],
      order: 2,
      type: 'select',
      validations: [Validators.required]
    }),
    new QuestionSelect({
      key: 'item',
      label: 'בחר פריט',
      options: [
        { key: 'solid', value: '12123' },
        { key: 'great', value: '23' },
        { key: 'good', value: '123' },
        { key: 'unproven', value: '123123123' },
      ],
      type: 'select',
      order: 2,
      validations: [Validators.required]
    }),




    new TextboxQuestion({
      key: 'total',
      label: 'סה"כ',
      value: '',
      order: 1,
      validations: [Validators.required]
    }),
    new TextboxQuestion({
      key: 'customeCost',
      label: 'חיוב לקוח',
      value: '',
      order: 1,
      validations: [Validators.required]
    }),
    new TextboxQuestion({
      key: 'suplierCost',
      label: 'חיוב ספק',
      value: '',
      order: 1,
      validations: [Validators.required]
    }),
    new TextboxQuestion({
      key: 'price',
      label: 'מחיר',
      value: '',
      order: 1,
      type: 'number',
      validations: [Validators.required]
    }),



  ];

  constructor() { }

  ngOnInit(): void {
  }

}
