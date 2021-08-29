import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import {
  FormTemplate,
  QuestionGroup,
} from 'src/app/components/form/logic/form.service';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
import { QuestionCalendar } from 'src/app/components/form/logic/question-calendar';
import { QuestionSelect } from 'src/app/components/form/logic/question-select';
import { QuestionTextarea } from 'src/app/components/form/logic/question-textarea';
import { QuestionTextbox } from 'src/app/components/form/logic/question-textbox';
import { LocationModel } from 'src/app/screens/order-tour/additions/models/location.model';

@Component({
  selector: 'app-transport',
  templateUrl: './transport.component.html',
  styleUrls: ['./transport.component.scss'],
})

export class TransportComponent implements OnInit {

  @Input() location : LocationModel;

  public form: FormGroup;
  public editMode: boolean = false;

  public details: QuestionBase<string>[] = [
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
  public gather: QuestionBase<string | Date>[] = [
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
      label: 'מקום איסוף',
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
    }),
  ];

  private comments: QuestionBase<string>[] = [
    new QuestionTextarea({
      key: 'comments',
      label: 'הערות',
      cols: 6,
      rows: 6,
      offset: 1,
    }),
  ];

  private questionGroups: QuestionGroup[] = [
    {
      key: 'details',
      questions: this.details,
      cols: 8,
    },
    {
      key: 'gather',
      questions: this.gather,
      cols: 6,
    },
    {
      key: 'comments',
      questions: this.comments,
      hasButton: true,
      cols: 8,
    },
  ];

  public formTemplate: FormTemplate = {
    hasGroups: true,
    questionsGroups: this.questionGroups,
  };

  constructor() {}

  ngOnInit(): void {
  }

  public onClick() {
    if (this.form) {
      this.editMode = !this.editMode;
      this.form.disable();
    }
  }

  public onEdit() {
    this.editMode = !this.editMode;
    this.form.enable();
  }

  public onValueChange(event) {
    if (!this.editMode) {
      this.form = event;
    }
  }
}
