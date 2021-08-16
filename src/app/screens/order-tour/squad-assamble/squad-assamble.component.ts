import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { QuestionSelect } from 'src/app/components/form-container/question-select';
import { QuestionBase } from 'src/app/components/form-container/question-base';
import { TextboxQuestion } from 'src/app/components/form-container/question-textbox';
import { QuestionRadio } from 'src/app/components/form-container/form-question/question-radio';
import { QuestionTextarea } from 'src/app/components/form-container/question-textarea';
import { Offset } from 'src/app/components/form-container/form-question/question-offset';
import { QuestionCalendar } from 'src/app/components/form-container/question-calendar';
import { FormContainerComponent } from 'src/app/components/form-container/form-container.component';
import { Validators } from '@angular/forms';

export interface formGroupGrid {
  title: string;
  questions: QuestionBase<string>[]
}

@Component({
  selector: 'app-squad-assamble',
  templateUrl: './squad-assamble.component.html',
  styleUrls: ['./squad-assamble.component.scss'],
})
export class SquadAssambleComponent implements OnInit, OnDestroy {

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



  timeAndNameFormInputs: QuestionBase<string>[] = [

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
      value: '',
      validations: [Validators.required]

    }),
    new QuestionCalendar({
      key: 'endDate',
      label: 'תאריך סיום',
      value: '',
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

    new TextboxQuestion({
      key: 'teamRepresentative',
      label: 'נציג הקבוצה',
      value: '',
    }),

    new TextboxQuestion({
      key: 'phoneNumberNoPrefix',
      label: 'נייד',
      columns: 'span 8',
      type: 'text',
    }),
    new Offset({
      columns: 'span 1 ',
    }),

    new QuestionSelect({
      key: 'phoneNumberPrefix',
      label: 'hide',
      columns: 'span 3',
      type: 'text',
      options: [
        { key: '054', value: '054' },
        { key: '052', value: '052' },
        { key: '052', value: '052' },
        { key: '077', value: '077' },
      ],
    }),
    new TextboxQuestion({
      key: 'email',
      label: 'מייל',
      type: 'text',
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
      type: 'select',
      options: [
        { key: 'אירוח אכסנייה', value: 'אירוח אכסנייה' },
        { key: 'מחזון להגשמה', value: 'מחזון להגשמה' },
      ],
    }),

    // new QuestionRadio({
    //   key: 'tripLocation',
    //   label: 'מחלקה',
    //   options: [{ key: '', value: 'ישראל' }, { key: '', value: 'חו"ל' }],
    //   value: 'ישראל',
    // }),

    // new QuestionRadio({
    //   key: 'tripLocation',
    //   label: 'פנים/חוץ מרכז שדה',
    //   options: [{ key: '', value: 'פנים' }, { key: '', value: 'חוץ' }],
    //   value: 'ישראל',
    // }),

    new QuestionTextarea({
      key: 'comments',
      label: 'הערות מנהליות',
      value: ''
    }),

  ];

  public squadForm: formGroupGrid[] = [
    { title: 'פרטי הטיול', questions: this.tourDetailsFormInputs },
    { title: 'הרכב הקבוצה', questions: this.groupAssambleFormInputs },
    { title: 'לקוח', questions: this.customerFormInputs },
    {
      title: 'מועד ושם הטיול',
      questions: this.timeAndNameFormInputs
    },
  ]


  @ViewChild('tourDetailsFormCustomQuestionRef', { static: true }) tourDetailsRef: ElementRef = new ElementRef(FormContainerComponent)


  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

}
