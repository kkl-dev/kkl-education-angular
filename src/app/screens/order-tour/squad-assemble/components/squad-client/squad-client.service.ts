import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { FormHeader } from 'src/app/screens/order-tour/squad-assemble/components/squad-group/squad-group.component';
import { FormService } from 'src/app/components/form/logic/form.service';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { QuestionAutocomplete } from 'src/app/components/form/logic/question-autocomplete';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
import { QuestionSelect } from 'src/app/components/form/logic/question-select';
import { QuestionTextbox } from 'src/app/components/form/logic/question-textbox';

@Injectable({
  providedIn: 'root',
})
export class SquadClientService {
  private $editMode: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  private $clientSelected: Subject<any> = new Subject<any>();

  public questions: QuestionBase<string>[] = [
    new QuestionBase({
      key: 'client',
      isGroup: true,
      fullWidth: true,
      cols: 3,
      rows: 6,
      type: 'autocomplete',
      group: {
        key: 'client',
        cols: 3,
        rows: 6,
        questions: [
          new QuestionSelect({
            key: 'clientPool',
            type: 'select',
            value:'all',
            inputProps: {
              options: [
                { label: 'הכל', value: 'all' },
                { label: 'לקוחות כלליים', value: 'global' },
                { label: 'לקוחות חו"ל', value: 'abroad' },
                { label: 'עובד קק"ל', value: 'kklWorker' },
              ],
            },
          }),
          new QuestionAutocomplete({
            key: 'customer',
            label: 'הקלד לקוח רצוי',
            cols: 2,
            value: '',
            validations: [Validators.required],
            inputProps: {
              options: [
                // { value: '521829121', label: '521829121 בית ספר תמיר' },
                // { value: '320382983', label: '320382983 מתנס אבן יהודה' },
                // { value: '428948934', label: '428948934 הגימנסיה הריאלית' },
              ],
            },
          }),
        ].reverse(),
      },
    }),

    new QuestionBase({
      key: 'contact',
      isGroup: true,
      fullWidth: true,
      rows: 14,
      group: {
        key: 'contact',
        header: { label: 'איש קשר', slot: 'button' },
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
    new QuestionBase({
      key: 'payer',
      isGroup: true,
      fullWidth: true,
      cols: 3,
      rows: 12,
      type: 'autocomplete',
      group: {
        key: 'payer',
        cols: 3,
        rows: 12,
        questions: [
          new QuestionSelect({
            key: 'payerName',
            type: 'select',
            label: 'הכול',
            value:'all',
            inputProps: {
              options: [
                { label: 'הכל', value: 'all' },
                { label: 'לקוחות כלליים', value: 'global' },
                { label: 'לקוחות חו"ל', value: 'abroad' },
                { label: 'עובד קק"ל', value: 'kklWorker' },
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
                // { label: 'שם נוסף', value: 'שם נוסף' },
                // { label: 'עוד לקוח', value: 'עוד לקוח' },
                // { label: 'לקוח מספר שלוש', value: 'לקוח מספר שלוש' },
                // { label: 'לקוח מספר ארבע', value: 'לקוח מספר ארבע' },
              ],
            },
          }),
        ].reverse(),
      },
    }),
  ];

  constructor() {}

  public emitEditMode(value: boolean) {
    this.$editMode.next(value);
  }
  public getEditModeObs(): Observable<boolean> {
    return this.$editMode.asObservable();
  }

  public emitClientSelected(value: any) {
    this.$clientSelected.next(value);
  }

  public getClientObs(): Observable<any> {
    return this.$clientSelected.asObservable();
  }
}
