import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionGroup } from 'src/app/components/form/logic/question-group';

@Component({
  selector: 'app-form-budget',
  templateUrl: './form-budget.component.html',
  styleUrls: ['./form-budget.component.scss']
})
export class FormBudgetComponent implements OnInit {

  @Input() public group: QuestionGroup;
  @Input() public formGroup: FormGroup;

  constructor() { }

  ngOnInit(): void {
  }

}
