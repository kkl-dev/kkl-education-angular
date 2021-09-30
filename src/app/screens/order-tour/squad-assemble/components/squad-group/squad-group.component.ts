import { Component, Input } from '@angular/core';
import { FormService } from 'src/app/components/form/logic/form.service';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
import { QuestionGroup } from 'src/app/components/form/logic/question-group';
import { SquadAssembleService } from '../../services/squad-assemble.service';
import { Subject } from 'rxjs';
import { ListItem } from 'src/app/components/grid/list-item.model';

export interface FormHeader {
  label: string;
  slot?: any;
}

@Component({
  selector: 'app-squad-group',
  templateUrl: './squad-group.component.html',
  styleUrls: ['./squad-group.component.scss'],
  providers: [FormService],
})
export class SquadGroupComponent {
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
    // this.onGenderChange()
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
