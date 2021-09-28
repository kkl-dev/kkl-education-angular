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
export class SquadDetailsService {

  public questions: QuestionBase<string>[] = [
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



  constructor(
    private formService: FormService
  ) { }
}
