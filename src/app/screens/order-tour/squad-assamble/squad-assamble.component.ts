import { Validators } from '@angular/forms';
import { Component, OnInit,ViewChild  } from '@angular/core';
import { FormContainerComponent } from 'src/app/components/form/form-container/form-container.component';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
import { QuestionCalendar } from 'src/app/components/form/logic/question-calendar';
import { QuestionRadio } from 'src/app/components/form/logic/question-radio';
import { QuestionSelect } from 'src/app/components/form/logic/question-select';
import { QuestionTextarea } from 'src/app/components/form/logic/question-textarea';
import { TextboxQuestion } from 'src/app/components/form/logic/question-textbox';

export interface formGroupGrid {
  title: string;
  cols?: string;
  questions: QuestionBase<string>[]
}

@Component({
  selector: 'app-squad-assamble',
  templateUrl: './squad-assamble.component.html',
  styleUrls: ['./squad-assamble.component.scss'],
})
export class SquadAssambleComponent implements OnInit{

  tourDetailsFormCustomQuestion:{}={
    boys:true,
    girls:true,
    boysChaperone:true,
    girlsChaperone:true,
    boysInstructors:true,
    girlsInstructors:true,
    boysMedics:true,
    girlsMedics:true
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
      label: 'קבוצת גיל',
      options: [
        { key: '1', value: '1' },
        { key: 'עוד לקוח', value: '10+' },
        { key: 'לקוח מספר שלוש', value: '20+' },
        { key: 'לקוח מספר ארבע', value: '30+' },
      ],
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
      rows: "4",
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
      rows: "2",
      options: [{ key: 'ישראל', value: 'ישראל' }, { key: 'חו"ל', value: 'חו"ל' }],
      value: 'ישראל',
    }),

    new QuestionRadio({
      custom: true,
      key: 'tripCenter',
      rows: "3",
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
    { cols: '1', title: 'הרכב הקבוצה', questions: this.groupAssambleFormInputs },
    { cols: '1', title: 'לקוח', questions: this.customerFormInputs },
    {
      cols: '1',
      title: 'מועד ושם הטיול',
      questions: this.timeAndNameFormInputs
    },
  ]

  @ViewChild('tourDetailsFormCustomQuestionRef',{static:true}) tourDetailsRef!:FormContainerComponent


  constructor() {
  }

  ngOnInit(): void {

  }
}
