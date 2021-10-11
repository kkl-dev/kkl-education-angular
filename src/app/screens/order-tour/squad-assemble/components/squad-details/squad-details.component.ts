import { Component, Input, OnInit } from '@angular/core';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
import { QuestionGroup } from 'src/app/components/form/logic/question-group';
import { Observable, Subject } from 'rxjs';
import { BreakpointService } from 'src/app/utilities/services/breakpoint.service';

@Component({
  selector: 'app-squad-details',
  templateUrl: './squad-details.component.html',
  styleUrls: ['./squad-details.component.scss'],
})
export class SquadDetailsComponent implements OnInit {
  @Input() public detailsGroup: QuestionGroup;
  @Input() public budgetGroup: QuestionGroup;

  public budgetKKL: number = 18332736;
  public expend: boolean = true;

  public $questions = new Subject<QuestionBase<string | number | Date>[]>();
  public tablet$: Observable<boolean>;

  constructor(private breakpoints: BreakpointService) {}

  ngOnInit(): void {
    this.tablet$ = this.breakpoints.isTablet();
  }

  public onBudget() {}
}
