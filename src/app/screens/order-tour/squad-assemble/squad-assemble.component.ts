import { Validators } from '@angular/forms';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
  questions: QuestionBase<string>[]
}

@Component({
  selector: 'app-squad-assemble',
  templateUrl: './squad-assemble.component.html',
  styleUrls: ['./squad-assemble.component.scss'],
})
export class SquadAssembleComponent
  implements OnInit, OnDestroy, AfterViewInit
{
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
        { key: '1', value: '1' },
        { key: 'עוד לקוח', value: '10+' },
        { key: 'לקוח מספר שלוש', value: '20+' },
        { key: 'לקוח מספר ארבע', value: '30+' },
      ],
      icon: 'keyboard_arrow_down',
      validations: [Validators.required],
    }),

    new QuestionNumber({
      key: 'chaperone',
      type: 'number',
      label: 'מלווים',
      value: 0,}),

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

  separatedGroupAssembleForm: QuestionBase<string>[] = [
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
    new QuestionNumber({
      key: 'participants',
      cols: "1",
      label: 'נוער / מבוגרים',
    }),
    new QuestionNumber({
      key: 'escorts',
      label: 'מלווים',
      cols: "1",
    }),
    new QuestionNumber({
      key: 'guides',
      label: 'מדריכים',
    }),
    new QuestionNumber({
      key: 'medics',
      label: 'חובשים',
    }),
  ];

  private groupAssambleFormInputs = []

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
    { cols: '1', title: 'פרטי הטיול', questions: this.tourDetailsFormInputs },
    { cols: '2', title: 'הרכב הקבוצה', questions: this.groupAssambleFormInputs },
    { cols: '1', title: 'לקוח', questions: this.customerFormInputs },
    {
      cols: '1',
      title: 'מועד ושם הטיול',
      questions: this.timeAndNameFormInputs
    },
  ]

  @ViewChild('tourDetailsFormCustomQuestionRef', { static: true }) tourDetailsRef!: FormContainerComponent


  constructor() {
    // this.groupAssembleFormInputs = this.groupAssembleForm;
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    // console.log(this.tourDetailsRef.form.value);
    // console.log(this.customerRef.form.value);
    // console.log(this.TimeAndDateRef.form.value);
    // console.log(this.groupAssembleRef.form.value);
  }

  changeGroupAssembleForm() {
    // this.separated = !this.separated;
    // this.groupAssembleFormInputs = this.separated
    //   ? this.separatedGroupAssembleForm
    //   : this.groupAssembleForm;
  }


}
