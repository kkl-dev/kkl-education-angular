import { Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormContainerComponent } from 'src/app/components/form/form-container/form-container.component';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
import { QuestionCalendar } from 'src/app/components/form/logic/question-calendar';
import { QuestionRadio } from 'src/app/components/form/logic/question-radio';
import { QuestionSelect } from 'src/app/components/form/logic/question-select';
import { QuestionTextarea } from 'src/app/components/form/logic/question-textarea';
import { QuestionTextbox } from 'src/app/components/form/logic/question-textbox';
import { QuestionNumber } from 'src/app/components/form/logic/question-number';

export interface formGroupGrid {
  title: string;
  cols?: string;
  formCols?: string;
  questions: QuestionBase<string | Date | number>[];
}

@Component({
  selector: 'app-squad-assemble',
  templateUrl: './squad-assemble.component.html',
  styleUrls: ['./squad-assemble.component.scss'],
})
export class SquadAssembleComponent implements OnInit {
  tourDetailsFormCustomQuestion: {} = {
    boys: true,
    girls: true,
    boysChaperone: true,
    girlsChaperone: true,
    boysInstructors: true,
    girlsInstructors: true,
    boysMedics: true,
    girlsMedics: true,
  };

  timeAndNameFormInputs: QuestionBase<string | Date>[] = [
    new QuestionTextbox({
      key: 'tourName',
      label: 'שם הטיול',
      value: '',
      validations: [Validators.required],
    }),

    new QuestionSelect({
      key: 'fieldCenter',
      type: 'select',
      label: 'מרכז שדה',
      inputProps: {
        options: [
          { key: 'solid', value: '12123' },
          { key: 'great', value: '23' },
          { key: 'good', value: '123' },
          { key: 'unproven', value: '123123123' },
        ],
      },
      icon: 'keyboard_arrow_down',
      validations: [Validators.required],
    }),

    new QuestionCalendar({
      key: 'startDate',
      label: 'תאריך התחלה',
      value: new Date(),
      validations: [Validators.required],
      inputProps: {
        labelLength: 'medium',
      },
    }),
    new QuestionCalendar({
      key: 'endDate',
      label: 'תאריך סיום',
      value: new Date(),
      validations: [Validators.required],
    }),
  ];

  customerFormInputs: QuestionBase<string>[] = [
    new QuestionSelect({
      key: 'customerName',
      type: 'select',
      label: 'מי הלקוח',
      inputProps: {
        options: [
          { key: 'שם נוסף', value: 'שם נוסף' },
          { key: 'עוד לקוח', value: 'עוד לקוח' },
          { key: 'לקוח מספר שלוש', value: 'לקוח מספר שלוש' },
          { key: 'לקוח מספר ארבע', value: 'לקוח מספר ארבע' },
        ],
      },
    }),

    new QuestionSelect({
      key: 'payerName',
      label: 'לקוח משלם',
      type: 'select',
      inputProps: {
        options: [
          { key: 'שם נוסף', value: 'שם נוסף' },
          { key: 'עוד לקוח', value: 'עוד לקוח' },
          { key: 'לקוח מספר שלוש', value: 'לקוח מספר שלוש' },
          { key: 'לקוח מספר ארבע', value: 'לקוח מספר ארבע' },
        ],
      },
    }),

    new QuestionTextbox({
      key: 'teamRepresentative',
      label: 'נציג הקבוצה',
      value: '',
    }),

    new QuestionTextbox({
      key: 'phone',
      label: 'נייד איש קשר',
      type: 'text',
      validations: [Validators.required],
    }),
    new QuestionTextbox({
      key: 'email',
      label: 'מייל',
      type: 'text',
      validations: [Validators.required],
    }),
  ];

  groupAssambleFormInputs: QuestionBase<string>[] = [
    new QuestionSelect({
      key: 'age',
      type: 'select',
      cols: '2',
      label: 'קבוצת גיל',
      inputProps: {
        options: [
          { key: '1', value: '1' },
          { key: 'עוד לקוח', value: '10+' },
          { key: 'לקוח מספר שלוש', value: '20+' },
          { key: 'לקוח מספר ארבע', value: '30+' },
        ],
      },
    }),
    new QuestionBase({
      key: 'participants',
      label: 'נוער / מבוגרים',
      cols: '2',
      isGroup: true,
      group: [
        new QuestionNumber({
          key: 'boys',
          label: 'בנים',
          type: 'number',
        }),
        new QuestionNumber({
          key: 'girls',
          label: 'בנות',
          type: 'number',
        }),
      ],
    }),
    new QuestionBase({
      key: 'escorts',
      cols: '2',
      isGroup: true,
      label: 'מלווים',
      group: [
        new QuestionNumber({
          key: 'boys',
          label: 'בנים',
          type: 'number',
        }),
        new QuestionNumber({
          key: 'girls',
          label: 'בנות',
          type: 'number',
        }),
      ],
    }),
    new QuestionBase({
      key: 'guides',
      isGroup: true,
      cols: '2',
      label: 'מדריכים',
      group: [
        new QuestionNumber({
          key: 'boys',
          label: 'בנים',
          type: 'number',
        }),
        new QuestionNumber({
          key: 'girls',
          label: 'בנות',
          type: 'number',
        }),
      ],
    }),
    new QuestionBase({
      key: 'medics',
      isGroup: true,
      cols: '2',
      label: 'חובשים',
      group: [
        new QuestionNumber({
          key: 'boys',
          label: 'בנים',
          type: 'number',
        }),
        new QuestionNumber({
          key: 'girls',
          label: 'בנות',
          type: 'number',
        }),
      ],
    }),
  ];

  tourDetailsFormInputs: QuestionBase<string>[] = [
    new QuestionSelect({
      key: 'characteristic',
      label: 'מאפיין',
      type: 'select',
      inputProps: {
        options: [
          { key: 'פרומלי', value: 'פרומלי' },
          { key: 'בלתי פורמלי', value: 'בלתי פורמלי' },
          { key: 'מעוף', value: 'מעוף' },
          { key: 'חו"ל', value: 'חו"ל' },
          { key: 'הנהלת אגף', value: 'הנהלת אגף' },
        ],
      },
    }),
    new QuestionSelect({
      key: 'activityType',
      label: 'סוג הפעילות',
      type: 'select',
      inputProps: {
        options: [
          { key: 'אירוח אכסנייה', value: 'אירוח אכסנייה' },
          { key: 'מחזון להגשמה', value: 'מחזון להגשמה' },
        ],
      },
    }),

    new QuestionRadio({
      key: 'tripLocation',
      label: 'מחלקה',
      custom: true,
      value: 'ישראל',
      inputProps: {
        options: [
          { key: 'ישראל', value: 'ישראל' },
          { key: 'חו"ל', value: 'חו"ל' },
        ],
      },
    }),

    new QuestionRadio({
      custom: true,
      key: 'tripCenter',
      label: 'פנים/חוץ מרכז שדה',
      value: 'ישראל',
      inputProps: {
        options: [
          { key: 'פנים', value: 'פנים' },
          { key: 'חוץ', value: 'חוץ' },
        ],
      },
    }),

    new QuestionTextarea({
      key: 'comments',
      label: 'הערות מנהליות',
      value: '',
    }),
  ];

  public squadForm: formGroupGrid[] = [
    {
      formCols: '1',
      title: 'פרטי הטיול',
      questions: this.tourDetailsFormInputs,
    },
    {
      formCols: '2',
      title: 'הרכב הקבוצה',
      cols: '2',
      questions: this.groupAssambleFormInputs,
    },
    {
      formCols: '1',
      cols: '2',
      title: 'לקוח',
      questions: this.customerFormInputs,
    },
    {
      formCols: '1',
      title: 'מועד ושם הטיול',
      cols: '2',
      questions: this.timeAndNameFormInputs,
    },
  ];

  @ViewChild('tourDetailsFormCustomQuestionRef', { static: true })
  tourDetailsRef!: FormContainerComponent;

  constructor() {
    // this.groupAssembleFormInputs = this.groupAssembleForm;
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    // console.log(this.tourDetailsRef.form.value);
    // console.log(this.customerRef.form.value);
    // console.log(this.timeAndDateRef.form.value);
    // console.log(this.groupAssembleRef.form.value);
  }

  changeGroupAssembleForm() {
    // this.separated = !this.separated;
    // this.groupAssembleFormInputs = this.separated
    //   ? this.separatedGroupAssembleForm
    //   : this.groupAssembleForm;
  }
}
