import { FormService } from 'src/app/components/form/logic/form.service';
import { Injectable } from '@angular/core';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
import { QuestionSelect } from 'src/app/components/form/logic/question-select';
import { TripService } from 'src/app/services/trip.service';

@Injectable({
  providedIn: 'root'
})
export class SquadDetailsService {

  public questions: QuestionBase<string>[] = [
    new QuestionSelect({
      // key: 'characteristic',
      key: 'attribute',
      label: 'מאפיין',
      type: 'select',
      inputProps: {
        options: this.tripService.attributes,
      },
    }),
    new QuestionSelect({
      key: 'activityType',
      label: 'סוג הפעילות',
      type: 'select',
      inputProps: {
        options: this.tripService.activityByAttribute,
      },
    }),
    new QuestionSelect({
      key: 'departmentId',
      label: 'מחלקה',
      type: 'select',
      inputProps: {
        options: [
          { label: 'ישראל', value: 'ישראל' },
          { label: 'חו"ל', value: 'חו"ל' },
        ],
      },
    }),
    new QuestionSelect({
      key: 'insideCenterFieldId',
      label: 'פנים/חוץ מרכז שדה',
      type: 'select',
      inputProps: {
        options: [
          { label: 'פנים', value: 'פנים' },
          { label: 'חוץ', value: 'חוץ' },
        ],
      },
    }),
  ];




  constructor(
    private formService: FormService, private tripService: TripService
  ) { }
}
