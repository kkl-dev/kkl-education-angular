import { Component, Input } from '@angular/core';
import { FormService } from 'src/app/components/form/logic/form.service';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
import { FlexCell } from 'src/app/components/grid/flex-cell/flex-cell.component';
import { QuestionGroup } from 'src/app/components/form/logic/question-group';
import { SquadAssembleService } from '../../services/squad-assemble.service';
import { Subject } from 'rxjs';

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
  @Input() public questions: QuestionBase<string | number | Date>[];
  @Input() public hasBottom: boolean;


  public tripId: string = '0000000';

  // array to hold data for bottom form text
  public bottomData: FlexCell[] = [];

  // subject to handle update of questions form
  private $questions = new Subject<QuestionBase<string | number | Date>[]>();

  //
  private mixed: boolean = true;

  constructor(
    private squadAssembleService: SquadAssembleService,
  ) { }

  ngOnInit() {

    this.questions = this.group.questions || [];

    if (this.hasBottom) {
      this.setSelectDataDemo();
    }
  }

  private setSelectDataDemo() {
    if (this.group.key === 'date') {
      this.bottomData = [
        {
          label: 'מס לילות',
          value: '2',
        },
        {
          label: 'מס ימים',
          value: '3',
        },
      ].reverse();
    }

    if (this.group.key === 'squad') {
      this.bottomData = [
        {
          label: 'מס משתתפים',
          value: '120',
        },
      ];
    }
  }

  //log form when valid

  logForm(form) {
    this.squadAssembleService.updateFormArray(form);
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
