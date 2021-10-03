import { Component, Input, OnInit } from '@angular/core';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
import { QuestionGroup } from 'src/app/components/form/logic/question-group';
import { Subject } from 'rxjs';
import { SquadAssembleService } from '../../services/squad-assemble.service';
import { TripService } from 'src/app/services/trip.service';

@Component({
  selector: 'app-squad-details',
  templateUrl: './squad-details.component.html',
  styleUrls: ['./squad-details.component.scss']
})
export class SquadDetailsComponent implements OnInit {


  @Input() public detailsGroup: QuestionGroup;
  @Input() public budgetGroup: QuestionGroup;

  public budgetKKL: number = 18332736;
  public expend: boolean = true;

  public $questions = new Subject<QuestionBase<string | number | Date>[]>();
  constructor(private squadAssembleService: SquadAssembleService,public tripService: TripService) { }


  ngOnInit(): void {
  }

  public onBudget() {
  }

  public logForm(form) {
    this.squadAssembleService.updateFormArray(form);
  }
}
