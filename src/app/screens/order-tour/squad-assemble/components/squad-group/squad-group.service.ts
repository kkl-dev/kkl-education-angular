import { FormService } from 'src/app/components/form/logic/form.service';
import { Injectable } from '@angular/core';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
import { QuestionSelect } from 'src/app/components/form/logic/question-select';
import { QuestionNumber } from 'src/app/components/form/logic/question-number';

@Injectable({
  providedIn: 'root',
})
export class SquadGroupService {
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

  public mixedQuestions: QuestionBase<string | number>[] = [
    new QuestionSelect({
      key: 'age',
      type: 'select',
      fullWidth: true,
      rows: 3,
      label: 'קבוצת גיל',
      inputProps: {
        options: [
          { label: '1', value: '1' },
          { label: 'עוד לקוח', value: '10+' },
          { label: 'לקוח מספר שלוש', value: '20+' },
          { label: 'לקוח מספר ארבע', value: '30+' },
        ],
      },
    }),

    new QuestionSelect({
      key: 'assemble',
      type: 'select',
      fullWidth: true,
      rows: 4,
      label: 'הרכב קבוצה',
      inputProps: {
        options: [],
      },
    }),

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
      key: 'kids',
      label: 'מתחת לגיל 2',
      cols: 2,
      rows: 4,
      offset: 3,
    }),
  ];

  public groupQuestions: QuestionBase<string>[] = [
    new QuestionSelect({
      key: 'age',
      type: 'select',
      fullWidth: true,
      rows: 4,
      label: 'קבוצת גיל',
      inputProps: {
        options: [
          { label: '1', value: '1' },
          { label: 'עוד לקוח', value: '10+' },
          { label: 'לקוח מספר שלוש', value: '20+' },
          { label: 'לקוח מספר ארבע', value: '30+' },
        ],
      },
    }),
    new QuestionSelect({
      key: 'assemble',
      type: 'select',
      fullWidth: true,
      rows: 4,
      label: 'הרכב קבוצה',
      inputProps: {
        options: [],
      },
    }),
    new QuestionBase({
      key: 'participants',
      fullWidth: true,
      rows: 5,
      isGroup: true,
      group: {
        key: 'participants',
        cols: 5,
        rows: 5,
        label: 'נוער / מבוגרים',
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
        cols: 5,
        rows: 5,
        label: 'מלווים',
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
        cols: 5,
        rows: 5,
        label: 'מדריכים',
        questions: this.genderArray,
      },
    }),

    new QuestionBase({
      key: 'kids',
      isGroup: true,
      fullWidth: true,
      rows: 5,
      group: {
        key: 'kids',
        cols: 5,
        rows: 5,
        label: 'מתחת לגיל 2',
                questions: this.genderArray,
      },
    }),
  ];

  constructor(private formService: FormService) {}
}
