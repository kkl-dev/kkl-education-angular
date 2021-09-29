import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { QuestionAutocomplete } from 'src/app/components/form/logic/question-autocomplete';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
import { QuestionSelect } from 'src/app/components/form/logic/question-select';
import { QuestionTextbox } from 'src/app/components/form/logic/question-textbox';

@Injectable({
  providedIn: 'root',
})
export class SquadNewClientService {
  public questions: QuestionBase<string>[] = [
    new QuestionBase({
      group: {
        isGroup: true,
        key: 'client',
        header: { label: 'הוספת לקוח חדש', slot: 'clear' },
        rows: 14,
        questions: [
          new QuestionSelect({
            key: 'type',
            type: 'select',
            label: ' סוג לקוח',
            inputProps: {
              options: [
                { label: 'שם נוסף', value: 'שם נוסף' },
                { label: 'עוד לקוח', value: 'עוד לקוח' },
                { label: 'לקוח מספר שלוש', value: 'לקוח מספר שלוש' },
                { label: 'לקוח מספר ארבע', value: 'לקוח מספר ארבע' },
              ],
            },
          }),
          new QuestionAutocomplete({
            key: 'fillName',
            label: 'הקלד שם לקוח',
            type: 'autocomplete',
            value: '',
            validations: [Validators.required],
            inputProps: {
              options: [
                { label: 'שם נוסף', value: 'שם נוסף' },
                { label: 'עוד לקוח', value: 'עוד לקוח' },
                { label: 'לקוח מספר שלוש', value: 'לקוח מספר שלוש' },
                { label: 'לקוח מספר ארבע', value: 'לקוח מספר ארבע' },
              ],
            },
          }),
          new QuestionTextbox({
            key: 'clientId',
            label: 'מספר ח.פ',
            type: 'text',
            validations: [Validators.required],
          }),
        ],
      },
    }),
    new QuestionBase({
      group: {
        isGroup: true,
        key: 'contact',
        header: { label: 'איש קשר', slot: '' },
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

  constructor() {}
}
