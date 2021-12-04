import { FormService } from 'src/app/components/form/logic/form.service';
import { Attribute, Injectable } from '@angular/core';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
import { QuestionSelect } from 'src/app/components/form/logic/question-select';
import { QuestionRadio } from 'src/app/components/form/logic/question-radio';
import { TripService } from 'src/app/services/trip.service';
import { FormGroup, Validators } from '@angular/forms';
import { ActivityType, Budget, BudgetByParams } from 'src/app/open-api';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SquadDetailsService {
  
  //activitiesByAttr=[]
  attributeOriginal : Attribute[];
  activityByAttribute = [];
  activityByAttributeOriginal: ActivityType[]
  budgetByParam = {} as BudgetByParams;
  //public receiveKKLBudget = new Subject();
  public receiveKKLBudget = new BehaviorSubject(null)
  public receiveSubBudget = new BehaviorSubject(null)
  //public budgetForm = new BehaviorSubject(null);
  //public receiveSubBudget = new Subject<any>();
  budget: Budget;
  public questions: QuestionBase<string>[] = [
    new QuestionSelect({
      // key: 'characteristic',
      key: 'attribute',
      label: 'מאפיין',
      type: 'select',
      inputProps: {
         options: this.tripService.attributes,
    
      },
      validations: [Validators.required],
    }),
    new QuestionSelect({
      key: 'activityType',
      label: 'סוג הפעילות',
      type: 'select',
      rows : 3,
      inputProps: {
      },
      validations: [Validators.required],
    }),
    new QuestionRadio({
      key: 'department',
      type: 'radio',
      rows : 3,
      inputProps: {
        options: [
          // { label: 'מחלקת פנים', value: 'domestic' },
          // { label: 'מחלקת חוץ', value: 'foreign' },
          { label: 'מחלקת פנים', value: '8' },
          { label: 'מחלקת חוץ', value: '1' },
        ],
      },
      value: '8',
      validations: [Validators.required],
    }),
    new QuestionSelect({
      // key: 'departmentId',
      key: 'tripLocation',
      label: 'מדינה',
      type: 'select',
      inputProps: {
        options: [
          { label: 'ישראל', value: '900' },
          { label: 'חו"ל', value: '' },
        ],
      },
      validations: [Validators.required],
    }),
    new QuestionSelect({
      key: 'insideCenterFieldId',
      label: 'פנים/חוץ מרכז שדה',
      type: 'select',
      inputProps: {
        options: [
          { label: 'פנים', value: '1' },
          { label: 'חוץ', value: '2' },
        ],
      },
      validations: [Validators.required],
    }),
  ];




  constructor(
    private formService: FormService, private tripService: TripService
  ) { }
}
