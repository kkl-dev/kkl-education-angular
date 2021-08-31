import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
import { QuestionCalendar } from 'src/app/components/form/logic/question-calendar';
import { QuestionNumber } from 'src/app/components/form/logic/question-number';
import { QuestionRadio } from 'src/app/components/form/logic/question-radio';
import { QuestionSelect } from 'src/app/components/form/logic/question-select';
import { QuestionTextarea } from 'src/app/components/form/logic/question-textarea';
import { QuestionTextbox } from 'src/app/components/form/logic/question-textbox';

@Injectable({
  providedIn: 'root',
})
export class SquadAssembleService {
  constructor() { }

  public timeAndNameFormInputs: QuestionBase<string | Date>[] = [
    new QuestionTextbox({
      key: 'tourName',
      label: 'שם הטיול',
      value: '',
      rows: 4,
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
      rows: 4,
      validations: [Validators.required],
      inputProps: {
        labelLength: 'medium',
      },
    }),
    new QuestionCalendar({
      key: 'endDate',
      label: 'תאריך סיום',
      rows: 4,
      value: new Date(),
      validations: [Validators.required],
    }),
  ];

  public customerFormInputs: QuestionBase<string>[] = [
    new QuestionSelect({
      key: 'customer',
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

    new QuestionBase({
      key: 'contact',
      rows: 3,
      isGroup: true,
      group: [
        new QuestionTextbox({
          key: 'fullName',
          label: 'איש קשר',
          inputProps: {
            labelLength: 'medium',
          },
        }),

        new QuestionTextbox({
          key: 'phone',
          label: 'נייד איש קשר',
          type: 'text',
          validations: [Validators.required],
          inputProps: {
            labelLength: 'medium',
          },
        }),
        new QuestionTextbox({
          key: 'email',
          label: 'מייל',
          type: 'text',
          validations: [Validators.required],
          inputProps: {
            labelLength: 'small',
          },
        }),
      ],
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
        options: [
          { key: '1', value: '1' },
          { key: 'עוד לקוח', value: '10+' },
          { key: 'לקוח מספר שלוש', value: '20+' },
          { key: 'לקוח מספר ארבע', value: '30+' },
        ],
      },
    }),

    new QuestionNumber({
      key: 'chaperones',
      label: 'מלווים',
      cols: 1,
      rows: 4,
    }),
    new QuestionNumber({
      key: 'participants',
      label: 'נוער / מבוגרים',
      offset: 1,
      cols: 1,
      rows: 4,
    }),
    new QuestionNumber({
      key: 'drivers',
      label: 'נהגים',
      cols: 1,
      rows: 4,
    }),
    new QuestionNumber({
      key: 'instructors',
      label: 'מדריכים',
      offset: 1,
      cols: 1,
      rows: 4,
    }),
    new QuestionNumber({
      key: 'medics',
      label: 'חובשים',
      cols: 1,
      rows: 4,
      offset: 2,
    }),
  ];

  public groupAssembleFormInputs: QuestionBase<string>[] = [
    new QuestionSelect({
      key: 'age',
      type: 'select',
      fullWidth: true,
      rows: 4,
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
      fullWidth : true,
      rows: 4,
      isGroup: true,
      group: [
        new QuestionNumber({
          key: 'boys',
          label: 'בנים',
          type: 'number',
          rows: 4,
        }),
        new QuestionNumber({
          key: 'girls',
          label: 'בנות',
          type: 'number',
          rows: 4,
          offset: 1,

        }),
      ],
    }),

    new QuestionBase({
      key: 'chaperones',
      cols: 2,
      isGroup: true,
      label: 'מלווים',
      group: [
        new QuestionNumber({
          key: 'boys',
          label: 'בנים',
          type: 'number',
          rows: 4,
        }),
        new QuestionNumber({
          key: 'girls',
          label: 'בנות',
          type: 'number',
          rows: 4,
        }),
      ],
    }),

    new QuestionBase({
      key: 'instructors',
      isGroup: true,
      cols: '2',
      label: 'מדריכים',
      group: [
        new QuestionNumber({
          key: 'boys',
          label: 'בנים',
          type: 'number',
          rows: 4,
        }),
        new QuestionNumber({
          key: 'girls',
          label: 'בנות',
          type: 'number',
          rows: 4,
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
          rows: 4,
        }),
        new QuestionNumber({
          key: 'girls',
          label: 'בנות',
          type: 'number',
          rows: 4,
        }),
      ],
    }),
  ];

  public tourDetailsFormInputs: QuestionBase<string>[] = [
    new QuestionSelect({
      key: 'characteristic',
      label: 'מאפיין',
      type: 'select',
      inputProps: {
        labelLength: 'small',
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
        labelLength: 'medium',
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
