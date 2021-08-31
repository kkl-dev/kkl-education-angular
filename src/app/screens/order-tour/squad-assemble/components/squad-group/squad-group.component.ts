import { Component, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { FormService } from 'src/app/components/form/logic/form.service';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
import { FlexCell } from 'src/app/components/grid/flex-cell/flex-cell.component';
import { SquadAssembleService } from '../../services/squad-assemble.service';

export interface FormHeader {
  text: string;
  custom?: any;
}

@Component({
  selector: 'app-squad-group',
  templateUrl: './squad-group.component.html',
  styleUrls: ['./squad-group.component.scss'],
  providers: [FormService],
})
export class SquadGroupComponent {
  public tripId: string = '0000000';

  @Input() public cols: string | number;
  @Input() public header: FormHeader;
  @Input() public questions: QuestionBase<string | number | Date>[];
  @Input() public hasBottom: boolean;

  // array to hold data for bottom form text
  public bottomData: FlexCell[];

  // subject to handle update of questions form
  private $questions = new Subject<QuestionBase<string | number | Date>[]>();

  //
  private mixed: boolean = true;
  private client: boolean = false;

  constructor(private squadAssembleService: SquadAssembleService) {}

  ngOnInit() {
    this.questions = this.questions || [];

    if (this.hasBottom) {
      this.bottomData = [
        {
          label: 'מס משתתפים',
          value: '120',
        },
      ];
    }
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

  // TODO - connect between client select to client contact data + disable mode style

  // method to add new client form
  public onAddClient() {
    this.client = !this.client;

    const header: FormHeader = {
      text: 'איש קשר',
      custom: 'button',
    };

    this.client
      ? (this.squadAssembleService.customerFormInputs[2].header = header)
      : (this.squadAssembleService.customerFormInputs[2].header = null);

    this.$questions.next(this.squadAssembleService.customerFormInputs);
  }
}
