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
      key: '1',
      label: 'שם הטיול',
      value: '',
      order: 1,
      validations: [Validators.required]
    }),

    new TextboxQuestion({
      key: '2',
      label: 'שם הטיול',
      value: '',
      order: 1,
      validations: [Validators.required]
    }),

    new QuestionSelect({
      key: '3',
      label: 'מרכז שדה',
      options: [
        { key: 'solid', value: '12123' },
        { key: 'great', value: '23' },
        { key: 'good', value: '123' },
        { key: 'unproven', value: '123123123' },
      ],
      order: 2,
      validations: [Validators.required]
    }),
    new QuestionSelect({
      key: '4',
      label: 'מרכז שדה',
      options: [
        { key: 'solid', value: '12123' },
        { key: 'great', value: '23' },
        { key: 'good', value: '123' },
        { key: 'unproven', value: '123123123' },
      ],
      order: 2,
      validations: [Validators.required]
    }),
    new TextboxQuestion({
      key: '6',
      label: 'שם הטיול',
      value: '',
      order: 1,
      validations: [Validators.required]
    }),

    new TextboxQuestion({
      key: '5',
      label: 'שם הטיול',
      value: '',
      order: 1,
      validations: [Validators.required]
    }),
    new TextboxQuestion({
      key: 'tourName',
      label: 'שם 7',
      value: '',
      order: 1, 
      validations: [Validators.required]
    }),

    new TextboxQuestion({
      key: '8',
      label: 'שם הטיול',
      value: '',
      order: 1,
      validations: [Validators.required]
    }),



  ];

  constructor() { }

  ngOnInit(): void {
  }

}
