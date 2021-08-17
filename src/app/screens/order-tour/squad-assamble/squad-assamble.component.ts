import { Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormContainerComponent } from 'src/app/components/form/form-container/form-container.component';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
import { QuestionCalendar } from 'src/app/components/form/logic/question-calendar';
import { QuestionRadio } from 'src/app/components/form/logic/question-radio';
import { QuestionSelect } from 'src/app/components/form/logic/question-select';
import { QuestionTextarea } from 'src/app/components/form/logic/question-textarea';
import { TextboxQuestion } from 'src/app/components/form/logic/question-textbox';
import { QuestionNumber } from 'src/app/components/form/logic/question-number';


export interface formGroupGrid {
  title: string;
  cols?: string;
  formCols?: string;
  questions: QuestionBase<string | Date | number>[]
}

@Component({
  selector: 'app-squad-assamble',
  templateUrl: './squad-assamble.component.html',
  styleUrls: ['./squad-assamble.component.scss'],
})
export class SquadAssambleComponent implements OnInit {

  tourDetailsFormCustomQuestion: {} = {
    boys: true,
    girls: true,
    boysChaperone: true,
    girlsChaperone: true,
    boysInstructors: true,
    girlsInstructors: true,
    boysMedics: true,
    girlsMedics: true
  }

  timeAndNameFormInputs: QuestionBase<string | Date>[] = [

    new TextboxQuestion({
      key: 'tourName',
      label: 'שם הטיול',
      value: '',
      validations: [Validators.required]
    }),

    new QuestionSelect({
      key: 'fieldCenter',
      type: 'select',
      label: 'מרכז שדה',
      options: [
        { key: 'solid', value: '12123' },
        { key: 'great', value: '23' },
        { key: 'good', value: '123' },
        { key: 'unproven', value: '123123123' },
      ],
      icon: 'keyboard_arrow_down',
      validations: [Validators.required],
    }),


    new QuestionCalendar({
      key: 'startDate',
      label: 'תאריך התחלה',
      value: new Date(),
      validations: [Validators.required]

    }),
    new QuestionCalendar({
      key: 'endDate',
      label: 'תאריך סיום',
      value: new Date(),
      validations: [Validators.required]

    }),
  ];

  customerFormInputs: QuestionBase<string>[] = [
    new QuestionSelect({
      key: 'customerName',
      type: 'select',
      label: 'מי הלקוח',
      options: [
        { key: 'שם נוסף', value: 'שם נוסף' },
        { key: 'עוד לקוח', value: 'עוד לקוח' },
        { key: 'לקוח מספר שלוש', value: 'לקוח מספר שלוש' },
        { key: 'לקוח מספר ארבע', value: 'לקוח מספר ארבע' },
      ],
    }),

    new QuestionSelect({
      key: 'payerName',
      label: 'לקוח משלם',
      type: "select",
      options: [
        { key: 'שם נוסף', value: 'שם נוסף' },
        { key: 'עוד לקוח', value: 'עוד לקוח' },
        { key: 'לקוח מספר שלוש', value: 'לקוח מספר שלוש' },
        { key: 'לקוח מספר ארבע', value: 'לקוח מספר ארבע' },
      ],
    }),

    new TextboxQuestion({
      key: 'teamRepresentative',
      label: 'נציג הקבוצה',
      value: '',
    }),

    new TextboxQuestion({
      key: 'phone',
      label: 'נייד איש קשר',
      type: 'text',
      validations: [Validators.required]

    }),
    new TextboxQuestion({
      key: 'email',
      label: 'מייל',
      type: 'text',
      validations: [Validators.required]

    }),

  ];

  groupAssambleFormInputs: QuestionBase<string>[] = [
    new QuestionSelect({
      key: 'age',
      type: "select",
      cols: "2",
      label: 'קבוצת גיל',
      options: [
        { key: '1', value: '1' },
        { key: 'עוד לקוח', value: '10+' },
        { key: 'לקוח מספר שלוש', value: '20+' },
        { key: 'לקוח מספר ארבע', value: '30+' },
      ],
    }),
    new QuestionBase({
      key: 'participants',
      label: 'נוער / מבוגרים',
      cols: "2",
      isGroup: true,
      group: [
        new QuestionNumber({
          key: 'boys',
          label: 'בנים',
        }),
        new QuestionNumber({
          key: 'girls',
          label: 'בנות',
        }),
      ]
      ,
    }),
    new QuestionBase({
      key: 'escorts',
      cols: "2",
      isGroup: true,
      label: 'מלווים',
      group: [
        new QuestionNumber({
          key: 'boys',
          label: 'בנים',
        }),
        new QuestionNumber({
          key: 'girls',
          label: 'בנות',
        }),
      ]
    }),
    new QuestionBase({
      key: 'guides',
      isGroup: true,
      cols: "2",
      label: 'מדריכים',
      group: [
        new QuestionNumber({
          key: 'boys',
          label: 'בנים',
        }),
        new QuestionNumber({
          key: 'girls',
          label: 'בנות',
        }),
      ]
    }),
    new QuestionBase({
      key: 'medics',
      isGroup: true,
      cols: "2",
      label: 'חובשים',
      group: [
        new QuestionNumber({
          key: 'boys',
          label: 'בנים',
        }),
        new QuestionNumber({
          key: 'girls',
          label: 'בנות',
        }),
      ]
    }),
  ];

  tourDetailsFormInputs: QuestionBase<string>[] = [
    new QuestionSelect({
      key: 'characteristic',
      label: 'מאפיין',
      type: 'select',
      options: [
        { key: 'פרומלי', value: 'פרומלי' },
        { key: 'בלתי פורמלי', value: 'בלתי פורמלי' },
        { key: 'מעוף', value: 'מעוף' },
        { key: 'חו"ל', value: 'חו"ל' },
        { key: 'הנהלת אגף', value: 'הנהלת אגף' },
      ],
    }),
    new QuestionSelect({
      key: 'activityType',
      label: 'סוג הפעילות',
      type: 'select',
      options: [
        { key: 'אירוח אכסנייה', value: 'אירוח אכסנייה' },
        { key: 'מחזון להגשמה', value: 'מחזון להגשמה' },
      ],
    }),

    new QuestionRadio({
      key: 'tripLocation',
      label: 'מחלקה',
      custom: true,
      options: [{ key: 'ישראל', value: 'ישראל' }, { key: 'חו"ל', value: 'חו"ל' }],
      value: 'ישראל',
    }),

    new QuestionRadio({
      custom: true,
      key: 'tripCenter',
      label: 'פנים/חוץ מרכז שדה',
      options: [{ key: 'פנים', value: 'פנים' }, { key: 'חוץ', value: 'חוץ' }],
      value: 'ישראל',
    }),

    new QuestionTextarea({
      key: 'comments',
      label: 'הערות מנהליות',
      value: ''
    }),

  ];

  public squadForm: formGroupGrid[] = [
    {
      formCols: '1',
      title: 'פרטי הטיול',
      questions: this.tourDetailsFormInputs
    },
    {
      formCols: '2',
      title: 'הרכב הקבוצה',
      cols: "2",
      questions: this.groupAssambleFormInputs
    },
    {
      formCols: '1',
      cols: "2",
      title: 'לקוח',
      questions: this.customerFormInputs
    },
    {
      formCols: '1',
      title: 'מועד ושם הטיול',
      cols: "2",
      questions: this.timeAndNameFormInputs
    },
  ]

  @ViewChild('tourDetailsFormCustomQuestionRef', { static: true }) tourDetailsRef!: FormContainerComponent


  constructor() {
  }

  ngOnInit(): void {

  }
}
