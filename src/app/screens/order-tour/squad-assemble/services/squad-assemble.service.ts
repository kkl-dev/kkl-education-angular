import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
import { QuestionCalendar } from 'src/app/components/form/logic/question-calendar';
import { QuestionNumber } from 'src/app/components/form/logic/question-number';
import { QuestionRadio } from 'src/app/components/form/logic/question-radio';
import { QuestionSelect } from 'src/app/components/form/logic/question-select';
import { QuestionTextarea } from 'src/app/components/form/logic/question-textarea';
import { QuestionTextbox } from 'src/app/components/form/logic/question-textbox';
import { TripService } from 'src/app/services/trip.service'
@Injectable({
  providedIn: 'root',
})
export class SquadAssembleService {
  private genderArray: QuestionNumber[] = [
    new QuestionNumber({
      key: 'boys',
      label: 'בנים',
      type: 'number',
      cols: 2,
      offset: 1,
      rows: 4,
    }),
    new QuestionNumber({
      key: 'girls',
      label: 'בנות',
      type: 'number',
      cols: 2,
      rows: 4,
    }),
  ];

  constructor(private tripService: TripService) { }

  public timeAndNameFormInputs: QuestionBase<string | Date>[] = [
    new QuestionTextbox({
      key: 'tourName',
      label: 'שם הטיול',
      value: '',
      rows: 4,
      validations: [Validators.required],
      inputProps: {
        labelSize: 's2',
      },
    }),

    new QuestionSelect({
      key: 'fieldCenter',
      type: 'select',
      label: 'מרכז שדה',
      inputProps: {
        options: this.tripService.fieldForestCenters,
        labelSize: 's3',
      },
      validations: [Validators.required],
    }),
    // 
    // [
    //   { key: 'solid', value: '12123' },
    //   { key: 'great', value: '23' },
    //   { key: 'good', value: '123' },
    //   { key: 'unproven', value: '123123123' },
    // ]
    new QuestionCalendar({
      key: 'dates',
      label: 'תאריכי לינה',
      value: null,
      rows: 4,
      validations: [Validators.required],
      inputProps: {
        labelSize: 's3',
      },
    }),
  ];

  public customerFormInputs: QuestionBase<string>[] = [
    new QuestionTextbox({
      key: 'clientName',
      label: 'הקלד לקוח רצוי',
      cols: 2,
      value: '',
      validations: [Validators.required],
      inputProps: {
        labelSize: 's8',
      },
    }),

    new QuestionSelect({
      key: 'clientPool',
      type: 'select',
      label: 'הכול',
      inputProps: {
        labelSize: 's1',
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
      fullWidth: true,
      inputProps: {
        labelSize: 's3',
        options: [
          { key: 'שם נוסף', value: 'שם נוסף' },
          { key: 'עוד לקוח', value: 'עוד לקוח' },
          { key: 'לקוח מספר שלוש', value: 'לקוח מספר שלוש' },
          { key: 'לקוח מספר ארבע', value: 'לקוח מספר ארבע' },
        ],
      },
    }),

    new QuestionBase({
      key: 'contact',
      isGroup: true,
      fullWidth: true,
      rows: 15,
      group: {
        key: 'contact',
        cols: 1,
        rows: 3,
        questions: [
          new QuestionTextbox({
            key: 'fullName',
            label: 'איש קשר',
            inputProps: {
              labelSize: 's1',
            },
          }),

          new QuestionTextbox({
            key: 'phone',
            label: 'נייד איש קשר',
            type: 'text',
            validations: [Validators.required],
            inputProps: {
              labelSize: 's3',
            },
          }),
          new QuestionTextbox({
            key: 'email',
            label: 'מייל',
            type: 'text',
            validations: [Validators.required],
            inputProps: {
              labelSize: 's1',
            },
          }),
        ],
      },
    }),
  ];

  public groupAssembleFormMixedInputs: QuestionBase<string | number>[] = [
    new QuestionSelect({
      key: 'age',
      type: 'select',
      fullWidth: true,
      rows: 4,
      label: 'קבוצת גיל',
      inputProps: {
        options: this.tripService.ageGroup,
      },
    }),
    // this.tripService.ageGroup
    // [
    //   { key: '1', value: '1' },
    //   { key: 'עוד לקוח', value: '10+' },
    //   { key: 'לקוח מספר שלוש', value: '20+' },
    //   { key: 'לקוח מספר ארבע', value: '30+' },
    // ],
    new QuestionNumber({
      key: 'chaperones',
      label: 'מלווים',
      cols: 2,
      rows: 4,
    }),
    new QuestionNumber({
      key: 'participants',
      label: 'נוער / מבוגרים',
      offset: 1,
      cols: 2,
      rows: 4,
      inputProps: {
        labelSize: 'xl4',
      },
    }),
    new QuestionNumber({
      key: 'drivers',
      label: 'נהגים',
      cols: 2,
      rows: 4,
    }),
    new QuestionNumber({
      key: 'instructors',
      label: 'מדריכים',
      offset: 1,
      cols: 2,
      rows: 4,
    }),
    new QuestionNumber({
      key: 'medics',
      label: 'חובשים',
      cols: 2,
      rows: 4,
      offset: 3,
    }),
  ];

  public groupAssembleFormInputs: QuestionBase<string>[] = [
    new QuestionSelect({
      key: 'age',
      type: 'select',
      fullWidth: true,
      rows: 3,
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
      fullWidth: true,
      rows: 5,
      isGroup: true,
      group: {
        key: 'participants',
        header: { text: 'נוער / מבוגרים' },
        cols: 5,
        questions: this.genderArray,
      },
    }),

    new QuestionBase({
      key: 'chaperones',
      fullWidth: true,
      rows: 5,
      isGroup: true,
      group: {
        key: 'chaperones',
        header: { text: 'מלווים' },
        cols: 5,
        questions: this.genderArray,
      },
    }),

    new QuestionBase({
      key: 'instructors',
      isGroup: true,
      fullWidth: true,
      rows: 5,
      group: {
        key: 'instructors',
        header: { text: 'מדריכים' },
        cols: 5,
        questions: this.genderArray,
      },
    }),

    new QuestionBase({
      key: 'medics',
      isGroup: true,
      fullWidth: true,
      rows: 5,
      group: {
        key: 'medics',
        header: { text: 'חובשים' },
        cols: 5,
        questions: this.genderArray,
      },
    }),
  ];

  public tourDetailsFormInputs: QuestionBase<string>[] = [
    new QuestionSelect({
      key: 'characteristic',
      label: 'מאפיין',
      type: 'select',
      inputProps: {
        labelSize: 's4',
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
        labelSize: 's4',
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
      rows: 4,
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
      rows: 4,
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
      rows: 6,
    }),
  ];
}
