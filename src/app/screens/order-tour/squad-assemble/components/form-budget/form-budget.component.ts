import { BudgetModel } from './budget.model';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionGroup } from 'src/app/components/form/logic/question-group';
import { ListItem } from 'src/app/components/grid/list-item.model';

@Component({
  selector: 'app-form-budget',
  templateUrl: './form-budget.component.html',
  styleUrls: ['./form-budget.component.scss']
})
export class FormBudgetComponent implements OnInit {

  @Input() public group: QuestionGroup;
  @Input() public formGroup: FormGroup;

  public budget: BudgetModel = {
    type: 'מעוף',
    budget: 0,
    expense: 1520,
    deliver: 3204,
    overflow: 167520
  }

  public list: ListItem[] = [
    {
      key: 'type',
      label: 'סוג תקציב',
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

  constructor() { }

  ngOnInit(): void {
    this.list = this.setList(this.list);
    console.log(this.list)
  }

  private setList(list: ListItem[]): ListItem[] {
    return list.map((item: ListItem) => {
      const listItem = { ...item };
      listItem.value = this.budget[item.key];
      return listItem;
    });
  }


  public onClick() {

  }
}
