import { FormService } from 'src/app/components/form/logic/form.service';
import { Injectable } from '@angular/core';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
import { QuestionSelect } from 'src/app/components/form/logic/question-select';
import { TripService } from 'src/app/services/trip.service';
import { BudgetModel } from './squad-budget.model';
import { ListItem } from 'src/app/components/grid/list-item.model';

@Injectable({
  providedIn: 'root'
})
export class SquadBudgetService {
  public budget: BudgetModel = {
    type: '',
    budget: 0,
    expense: 0,
    deliver: 0,
    overflow: 0
  }

  public questions: QuestionBase<string>[] = [
    new QuestionSelect({
      key: 'budgetIncome',
      type: 'select',
      fullWidth: true,
      rows: 4,
      label: 'תת סעיף תקציב הכנסות',
      inputProps: {
        // options: [],
      },
    }),
    new QuestionSelect({
      key: 'budgetExpense',
      type: 'select',
      fullWidth: true,
      rows: 4,
      label: 'תת סעיף תקציב הוצאות',
      inputProps: {
        // options: [],
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
              options:
                [
                  // { label: 'לקוח מספר ארבע', value: '30+' }
                ],
            },
          }),
        ],
      },
    }),
  ];
  public list: ListItem[] = [
    {
      key: 'type',
      label: 'סוג תקצוב',
      type: 'text'
    },
    {
      key: 'budget',
      label: 'תקצוב קק"ל',
      type: 'number'
    },
    {
      key: 'expense',
      label: 'עלות לקוח',
      type: 'number'
    },
    {
      key: 'deliver',
      label: 'ביצוע',
      type: 'number'
    },
    {
      key: 'overflow',
      label: 'יתרה פיננסית',
      type: 'number'
    },
  ]

  constructor(
    private formService: FormService
  ) { }
  public setList(list: ListItem[]): ListItem[] {
    return list.map((item: ListItem) => {
      const listItem = { ...item };
      listItem.value = this.budget[item.key];
      return listItem;
    });
  }
  public setBudgetList(){

  }
}
