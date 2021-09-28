import { SquadAssembleService } from './../../services/squad-assemble.service';
import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
import { QuestionGroup } from 'src/app/components/form/logic/question-group';
import { ListItem } from 'src/app/components/grid/list-item.model';

@Component({
  selector: 'app-squad-assemble-form',
  templateUrl: './squad-assemble-form.component.html',
  styleUrls: ['./squad-assemble-form.component.scss']
})
export class SquadAssembleFormComponent implements OnInit {

  @Input() public group: QuestionGroup;

  public $questions = new Subject<QuestionBase<string | number | Date>[]>();
  public mixed: boolean = true;

  public list: ListItem[] = [
    {
      label: 'מס משתתפים',
      value: '120',
    }
  ]

  constructor(
    private squadAssembleService: SquadAssembleService
  ) { }

  ngOnInit(): void {
  }

  // method to change squad assemble form
  public onGenderChange() {
    this.mixed = !this.mixed;

    this.$questions.next(
      this.mixed
        ? this.squadAssembleService.groupAssembleFormMixedInputs
        : this.squadAssembleService.groupAssembleFormInputs
    );
  }



}
