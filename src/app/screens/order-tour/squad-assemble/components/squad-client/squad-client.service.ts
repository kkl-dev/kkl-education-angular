import { FormService } from 'src/app/components/form/logic/form.service';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { QuestionAutocomplete } from 'src/app/components/form/logic/question-autocomplete';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
import { QuestionSelect } from 'src/app/components/form/logic/question-select';
import { QuestionTextbox } from 'src/app/components/form/logic/question-textbox';

@Injectable({
  providedIn: 'root'
})
export class SquadClientService {

  public clientQuestions: QuestionBase<string>[] = [

    new QuestionBase({
      key: 'wantedClient',
      isGroup: true,
      fullWidth: true,
      cols: 3,
      rows: 6,
      type: 'autocomplete',
      group: {
        key: 'wantedClient',
        cols: 3,
        rows: 6,
        questions: [
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
        ],
      },
    }),
    new QuestionBase({
      key: 'payerPoll',
      isGroup: true,
      fullWidth: true,
      cols: 3,
      rows: 12,
      type: 'autocomplete',
      group: {
        key: 'payerName',
        cols: 3,
        rows: 12,
        questions: [
          new QuestionSelect({
            key: 'payerName',
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
          new QuestionAutocomplete({
            key: 'payerPoll',
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


  constructor(
    private formService: FormService
  ) { }
}
