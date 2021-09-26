import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
import { QuestionGroup } from 'src/app/components/form/logic/question-group';

@Component({
  selector: 'app-form-details',
  templateUrl: './form-details.component.html',
  styleUrls: ['./form-details.component.scss']
})
export class FormDetailsComponent implements OnInit {

  @Input() public detailsGroup: QuestionGroup;
  @Input() public budgetGroup: QuestionGroup;

  public budget : number = 18332736;

  public $questions = new Subject<QuestionBase<string | number | Date>[]>();

  constructor() { }

  ngOnInit(): void {
  }

  public onBudget() {
  }
}
