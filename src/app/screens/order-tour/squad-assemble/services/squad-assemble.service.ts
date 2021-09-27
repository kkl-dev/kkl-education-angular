import { Injectable } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
import { QuestionCalendar } from 'src/app/components/form/logic/question-calendar';
import { QuestionNumber } from 'src/app/components/form/logic/question-number';
import { QuestionRadio } from 'src/app/components/form/logic/question-radio';
import { QuestionSelect } from 'src/app/components/form/logic/question-select';
import { QuestionTextarea } from 'src/app/components/form/logic/question-textarea';
import { QuestionTextbox } from 'src/app/components/form/logic/question-textbox';
import { CalendarOptions, FreeSpace } from 'comrax-alex-airbnb-calendar';
import { QuestionAutocomplete } from 'src/app/components/form/logic/question-autocomplete';

@Injectable({
  providedIn: 'root',
})
export class SquadAssembleService {
  freeSpacesArray: FreeSpace[] = [];

  formsArray: FormGroup[] = [];

  freeSpacesArrayGenarator(start: Date, end: Date) {
    const i = 0;
    let freeSpacesArray = [];
    while (start < end) {
      start = new Date(start.setDate(start.getDate() + 1));
      freeSpacesArray.push({
        date: start,
        freeSpace: [
          {
            accomodationName: 'cabin',
            availableBeds: +Math.floor(Math.random() * 8).toString(),
          },
          {
            accomodationName: 'tent',
            availableBeds: +Math.floor(Math.random() * 8).toString(),
          },
          {
            accomodationName: 'room',
            availableBeds: +Math.floor(Math.random() * 8).toString(),
          },
        ],
      });
    }
    return freeSpacesArray;
  }
  options: CalendarOptions = {
    firstCalendarDay: 0,
    format: 'LL/dd/yyyy',

    closeOnSelected: true,
    minYear: 2019,
    maxYear: 2021,
    freeSpacesArray: this.freeSpacesArray,
  };

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

  constructor() {
    this.freeSpacesArray = this.freeSpacesArrayGenarator(
      new Date(),
      new Date(2021, 11, 17)
    );
  }

  public timeAndNameFormInputs: QuestionBase<string | Date>[] = [
    new QuestionTextbox({
      key: 'tourName',
      label: 'שם הטיול',
      value: '',
      rows: 4,
      validations: [Validators.required],
      inputProps: {},
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
      validations: [Validators.required],
    }),

    new QuestionCalendar({
      key: 'dates',
      label: 'תאריכי לינה',
      value: null,
      rows: 4,
      validations: [Validators.required],
      inputProps: {},
    }),

    new QuestionTextarea({
      key: 'comments',
      label: 'הערות מנהליות',
      rows: 6,
    }),
  ];

  public customerFormInputs: QuestionBase<string>[] = [
    new QuestionBase({
      key: 'wantedClient',
      isGroup: true,
      fullWidth: true,
      rows: 6,
      type: 'autocomplete',
      group: {
        key: 'wantedClient',
        cols: 3,
        rows: 6,
        questions: [
          new QuestionAutocomplete({
            key: 'clientName',
            label: 'הקלד לקוח רצוי',
            cols: 2,
            value: '',
            validations: [Validators.required],
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
            key: 'clientPool',
            type: 'select',
            label: 'הכול',
            inputProps: {
              options: [
                { key: 'שם נוסף', value: 'שם נוסף' },
                { key: 'עוד לקוח', value: 'עוד לקוח' },
                { key: 'לקוח מספר שלוש', value: 'לקוח מספר שלוש' },
                { key: 'לקוח מספר ארבע', value: 'לקוח מספר ארבע' },
              ],
            },
          }),
        ],
      },
    }),
    new QuestionBase({
      key: 'payerName',
      isGroup: true,
      fullWidth: true,
      rows: 6,
      type: 'autocomplete',
      group: {
        key: 'payerName',
        cols: 3,
        rows: 6,
        questions: [
          new QuestionAutocomplete({
            key: 'payerName',
            label: 'לקוח משלם',
            type: 'autocomplete',
            cols: 2,
            value: '',
            validations: [Validators.required],
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
            key: 'payerPool',
            type: 'select',
            label: 'הכול',
            inputProps: {
              options: [
                { key: 'שם נוסף', value: 'שם נוסף' },
                { key: 'עוד לקוח', value: 'עוד לקוח' },
                { key: 'לקוח מספר שלוש', value: 'לקוח מספר שלוש' },
                { key: 'לקוח מספר ארבע', value: 'לקוח מספר ארבע' },
              ],
            },
          }),
        ],
      },
    }),

    new QuestionBase({
      key: 'contact',
      isGroup: true,
      fullWidth: true,
      rows: 14,
      group: {
        key: 'contact',
        header: null,
        cols: 1,
        rows: 14,
        questions: [
          new QuestionTextbox({
            key: 'fullName',
            label: 'איש קשר',
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
        header: { label: 'נוער / מבוגרים' },
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
        header: { label: 'מלווים' },
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
        header: { label: 'מדריכים' },
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
        header: { label: 'חובשים' },
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
    new QuestionSelect({
      key: 'tripLocation',
      label: 'מחלקה',
      type: 'select',
      inputProps: {
        options: [
          { key: 'ישראל', value: 'ישראל' },
          { key: 'חו"ל', value: 'חו"ל' },
        ],
      },
    }),
    new QuestionSelect({
      key: 'tripCenter',
      label: 'פנים/חוץ מרכז שדה',
      type: 'select',
      inputProps: {
        options: [
          { key: 'פנים', value: 'פנים' },
          { key: 'חוץ', value: 'חוץ' },
        ],
      },
    }),
  ];

  public budgetQuestions: QuestionBase<string>[] = [
    new QuestionSelect({
      key: 'budgetIncome',
      type: 'select',
      fullWidth: true,
      rows: 4,
      label: 'תת סעיף תקציב הכנסות',
      inputProps: {
        options: [{ key: 'לקוח מספר ארבע', value: '30+' }],
      },
    }),
    new QuestionSelect({
      key: 'budgetExpense',
      type: 'select',
      fullWidth: true,
      rows: 4,
      label: 'תת סעיף תקציב הוצאות',
      inputProps: {
        options: [{ key: 'לקוח מספר ארבע', value: '30+' }],
      },
    }),
    new QuestionBase({
      key: 'location',
      isGroup: true,
      fullWidth: true,
      rows: 16,
      group: {
        label: 'תקצוב פעילות',
        key: 'location',
        rows: 16,
        questions: [
          new QuestionSelect({
            label: 'ישוב',
            key: 'location',
            type: 'select',
            fullWidth: true,
            rows: 4,
            inputProps: {
              options: [{ key: 'לקוח מספר ארבע', value: '30+' }],
            },
          }),
        ],
      },
    }),
  ];

  updateFormArray(form: FormGroup) {
    const index = this.formsArray.findIndex(
      (formItem) => form.controls == formItem.controls
    );
    if (index > -1) {
      this.formsArray[index] = form;
    } else {
      this.formsArray.push(form);
    }
  }
}
