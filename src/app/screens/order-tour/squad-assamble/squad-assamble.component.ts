import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { QuestionSelect } from 'src/app/components/form-container/question-select';
import { QuestionBase } from 'src/app/components/form-container/question-base';
import { TextboxQuestion } from 'src/app/components/form-container/question-textbox';
import { QuestionCustom } from 'src/app/components/form-container/question-custom';
import { of } from 'rxjs';
import { QuestionNumber } from 'src/app/components/form-container/question-number';
import { QuestionRadio } from 'src/app/components/form-container/form-question/question-radio';
import { QuestionTextarea } from 'src/app/components/form-container/question-textarea';
import { Offset } from 'src/app/components/form-container/form-question/question-offset';
import { QuestionCalendar } from 'src/app/components/form-container/question-calendar';
import { FormContainerComponent } from 'src/app/components/form-container/form-container.component';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-squad-assamble',
  templateUrl: './squad-assamble.component.html',
  styleUrls: ['./squad-assamble.component.scss'],
})
export class SquadAssambleComponent implements OnInit, OnDestroy, AfterViewInit {



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



  TimeAndNameFormInputs: QuestionBase<string>[] = [

    new TextboxQuestion({
      key: 'tourName',
      columns: 'span 12',
      label: 'שם הטיול',
      value: '',
      order: 1,
      icon: 'mode_edit'
    }),

    new QuestionSelect({
      key: 'fieldCenter',
      columns: 'span 12',
      label: 'מרכז שדה',
      options: [
        { key: 'solid', value: '12123' },
        { key: 'great', value: '23' },
        { key: 'good', value: '123' },
        { key: 'unproven', value: '123123123' },
      ],
      order: 2,
    }),


    new QuestionCalendar({
      key: 'startDate',
      columns: 'span 12',
      label: 'תאריך התחלה',
      value: '',
      order: 3,
    }),
    new QuestionCalendar({
      key: 'endDate',
      columns: 'span 12',
      label: 'תאריך סיום',
      value: '',
      order: 4,
    }),
  ];

  customerFormInputs: QuestionBase<string>[] = [
    new QuestionSelect({
      key: 'customerName',
      columns: 'span 12',
      label: 'מי הלקוח',
      options: [
        { key: 'שם נוסף', value: 'שם נוסף' },
        { key: 'עוד לקוח', value: 'עוד לקוח' },
        { key: 'לקוח מספר שלוש', value: 'לקוח מספר שלוש' },
        { key: 'לקוח מספר ארבע', value: 'לקוח מספר ארבע' },
      ],
      order: 1,
    }),

    new TextboxQuestion({
      key: 'teamRepresentative',
      columns: 'span 12',
      label: 'נציג הקבוצה',
      value: '',
      order: 2,
    }),

    new TextboxQuestion({
      key: 'phoneNumberNoPrefix',
      label: 'נייד',
      columns: 'span 8',
      type: 'text',
      order: 3,
    }),
    new Offset({
      columns: 'span 1 ',
    }),

    new QuestionSelect({
      key: 'phoneNumberPrefix',
      label: 'hide',
      columns: 'span 3',
      type: 'text',
      order: 4,
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
      columns: 'span 12',
      type: 'text',
      order: 5,
    }),
    new QuestionSelect({
      key: 'payerName',
      columns: 'span 12',
      label: 'לקוח משלם',
      options: [
        { key: 'שם נוסף', value: 'שם נוסף' },
        { key: 'עוד לקוח', value: 'עוד לקוח' },
        { key: 'לקוח מספר שלוש', value: 'לקוח מספר שלוש' },
        { key: 'לקוח מספר ארבע', value: 'לקוח מספר ארבע' },
      ],
      order: 6,
    }),
  ];

  groupAssambleFormInputs: QuestionBase<string>[] = [
    new QuestionSelect({
      key: 'age',
      columns: 'span 12',
      label: 'קבוצת גיל',
      options: [
        { key: '1', value: '1' },
        { key: 'עוד לקוח', value: '10+' },
        { key: 'לקוח מספר שלוש', value: '20+' },
        { key: 'לקוח מספר ארבע', value: '30+' },
      ],
      order: 1,
    }),
    // new QuestionNumber({
    //   key: 'boys',
    //   columns: 'span 5',
    //   type: 'number',
    //   label: 'נוער/מבוגרים',
    //   value:0,
    //   order: 2,
    // }),
    // new Offset({
    //   columns: 'span 2 ',
    // }),
    // new QuestionNumber({
    //   key: 'girls',
    //   columns: 'span 5',
    //   type: 'number',
    //   label: 'hide',
    //   value:0,
    //   order: 3,
    // }),
    new QuestionNumber({
      key: 'boysChaperone',
      columns: 'span 5',
      type: 'number',
      label: 'מלווים',
      value: 0,
      order: 4,
    }),
    // new QuestionNumber({
    //   key: 'boysChaperone',
    //   columns: 'span 5',
    //   type: 'number',
    //   label: 'מלווים',
    //   value:0,

    //   order: 4,
    // }),
    // new Offset({
    //   columns: 'span 2 ',
    // }),

    // new QuestionNumber({
    //   key: 'girlsChaperone',
    //   columns: 'span 5',
    //   type: 'number',
    //   label: 'hide',
    //   value:0,

    //   order: 5,
    // }),
    // new QuestionNumber({
    //   key: 'boysInstructors',
    //   columns: 'span 5',
    //   type: 'number',
    //   label: 'מדריכים',
    //   value:0,

    //   order: 7,
    // }),
    // new Offset({
    //   columns: 'span 2 ',
    // }),

    // new QuestionNumber({
    //   key: 'girlsInstructors',
    //   columns: 'span 5',
    //   type: 'number',
    //   label: 'hide',
    //   value:0,

    //   order: 8,
    // }),
    // new QuestionNumber({
    //   key: 'boysMedics',
    //   columns: 'span 5',
    //   type: 'number',
    //   label: 'חובשים',
    //   value:0,

    //   order: 9,
    // }),
    // new Offset({
    //   columns: 'span 2 ',
    // }),

    // new QuestionNumber({
    //   key: 'girlsMedics',
    //   columns: 'span 5',
    //   type: 'number',
    //   label: 'hide',
    //   value:0,

    //   order: 10,
    // }),
  ];

  tourDetailsFormInputs: QuestionBase<string>[] = [
    new QuestionSelect({
      key: 'characteristic',
      columns: 'span 12',
      label: 'מאפיין',
      options: [
        { key: 'פרומלי', value: 'פרומלי' },
        { key: 'בלתי פורמלי', value: 'בלתי פורמלי' },
        { key: 'מעוף', value: 'מעוף' },
        { key: 'חו"ל', value: 'חו"ל' },
        { key: 'הנהלת אגף', value: 'הנהלת אגף' },
      ],
      order: 1,
    }),
    new QuestionSelect({
      key: 'activityType',
      columns: 'span 12',
      label: 'סוג הפעילות',
      options: [
        { key: 'אירוח אכסנייה', value: 'אירוח אכסנייה' },
        { key: 'מחזון להגשמה', value: 'מחזון להגשמה' },
      ],
      order: 2,
    }),

    new QuestionRadio({
      key: 'tripLocation',
      label: 'מחלקה',
      options: [{ key: '', value: 'ישראל' }, { key: '', value: 'חו"ל' }],
      value: 'ישראל',
      columns: 'span 12',
      order: 5,
    }),

    new QuestionRadio({
      key: 'tripLocation',
      label: 'פנים/חוץ מרכז שדה',
      options: [{ key: '', value: 'פנים' }, { key: '', value: 'חוץ' }],
      value: 'ישראל',
      columns: 'span 12',
      order: 5,
    }),

    new QuestionTextarea({
      key: 'comments',
      label: 'הערות מנהליות',
      columns: 'span 12',
      order: 7,
      value: ''
    }),

  ];


  @ViewChild('tourDetailsFormCustomQuestionRef', { static: true }) tourDetailsRef: ElementRef = new ElementRef(FormContainerComponent)


  constructor() {
    console.log(this.tourDetailsRef)
  }

  ngOnInit(): void {
    console.log( this.tourDetailsRef)

  }

  ngAfterViewInit(): void {
    console.log(this.tourDetailsRef)

  }
  ngOnDestroy(): void {
    console.log('asdasd');

  }

  a(a: any) {
    console.log('asd')
    console.log(a.value)
  }
}
