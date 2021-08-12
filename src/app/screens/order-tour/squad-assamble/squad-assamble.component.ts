import { Component, OnInit } from '@angular/core';
import { QuestionSelect } from 'src/app/components/form-container/question-select';
import { QuestionBase } from 'src/app/components/form-container/question-base';
import { TextboxQuestion } from 'src/app/components/form-container/question-textbox';
import { QuestionCustom } from 'src/app/components/form-container/question-custom';
import { of } from 'rxjs';
import { QuestionNumber } from 'src/app/components/form-container/question-number';
import { QuestionRadio } from 'src/app/components/form-container/dynamic-form-question/question-radio';
import { QuestionTextarea } from 'src/app/components/form-container/question-textarea';
import { Offset } from 'src/app/components/form-container/dynamic-form-question/question-offset';

@Component({
  selector: 'app-squad-assamble',
  templateUrl: './squad-assamble.component.html',
  styleUrls: ['./squad-assamble.component.scss'],
})
export class SquadAssambleComponent implements OnInit {
  TimeAndNameFormInputs: QuestionBase<string>[] = [
    new QuestionSelect({
      key: 'brave',
      columns: 'span 12',
      label: 'Bravery Rating',
      options: [
        { key: 'solid', value: 'Solid' },
        { key: 'great', value: 'Great' },
        { key: 'good', value: 'Good' },
        { key: 'unproven', value: 'Unproven' },
      ],
      order: 1,
    }),

    new TextboxQuestion({
      key: 'firstName',
      columns: 'span 12',
      label: 'First name',
      value: 'Bombasto',
      required: true,
      order: 2,
    }),

    new TextboxQuestion({
      key: 'emailAddress',
      label: 'Email',
      columns: 'span 12',
      type: 'email',
      order: 3,
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
    new QuestionNumber({
      key: 'boys',
      columns: 'span 5',
      type: 'number',
      label: 'בנים',
      innerLabel: 'בנים',
      order: 2,
    }),
    new Offset({
      columns: 'span 2 ',
    }),
    new QuestionNumber({
      key: 'girls',
      columns: 'span 5',
      type: 'number',
      label: 'hide',
      innerLabel: 'בנות',
      order: 3,
    }),

    new QuestionNumber({
      key: 'boysChaperone',
      columns: 'span 5',
      type: 'number',
      label: 'מלווים',
      innerLabel: 'בנים',
      order: 4,
    }),
    new Offset({
      columns: 'span 2 ',
    }),

    new QuestionNumber({
      key: 'girlsChaperone',
      columns: 'span 5',
      type: 'number',
      label: 'hide',
      innerLabel: 'בנות',
      order: 5,
    }),
    new QuestionNumber({
      key: 'boysInstructors',
      columns: 'span 5',
      type: 'number',
      label: 'מדריכיפ',
      innerLabel: 'בנים',
      order: 7,
    }),
    new Offset({
      columns: 'span 2 ',
    }),

    new QuestionNumber({
      key: 'girlsInstructors',
      columns: 'span 5',
      type: 'number',
      label: 'hide',
      innerLabel: 'בנות',
      order: 8,
    }),
    new QuestionNumber({
      key: 'boysMedics',
      columns: 'span 5',
      type: 'number',
      label: 'מדריכיפ',
      innerLabel: 'בנים',
      order: 9,
    }),
    new Offset({
      columns: 'span 2 ',
    }),

    new QuestionNumber({
      key: 'girlsMedics',
      columns: 'span 5',
      type: 'number',
      label: 'hide',
      innerLabel: 'בנות',
      order: 10,
    }),
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
      label: 'פנים/חוץ מרכז שדה',
      innerLabel: '',
      options: [{ key: '', value: 'ישראל' }, { key: '', value: 'חו"ל' }],
      value: 'ישראל',
      columns: 'span 6',
      order: 5,
    }),
    new QuestionTextarea({
      key: 'comments',
      label: 'הערות מנהליות',
      innerLabel: '',
      columns: 'span 12',
      order: 7,
      value:''
    }),
  ];

  constructor() {}

  ngOnInit(): void {}
}
