import { FormService } from 'src/app/components/form/logic/form.service';
import { Injectable } from '@angular/core';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
import { QuestionSelect } from 'src/app/components/form/logic/question-select';
import { TripService } from 'src/app/services/trip.service';

@Injectable({
  providedIn: 'root'
})
export class SquadBudgetService {

  public questions: QuestionBase<string>[] = [
    new QuestionSelect({
      key: 'budgetIncome',
      type: 'select',
      fullWidth: true,
      rows: 4,
      label: 'תת סעיף תקציב הכנסות',
      inputProps: {
        options: [{ label: 'לקוח מספר ארבע', value: '30+' }],
      },
    }),
    new QuestionSelect({
      key: 'budgetExpense',
      type: 'select',
      fullWidth: true,
      rows: 4,
      label: 'תת סעיף תקציב הוצאות',
      inputProps: {
        options: [{ label: 'לקוח מספר ארבע', value: '30+' }],
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
              options: [{ label: 'לקוח מספר ארבע', value: '30+' }],
            },
          }),
        ],
      },
    }),
  ];


  constructor(
    private formService: FormService, public tripService: TripService
  ) { }
}
