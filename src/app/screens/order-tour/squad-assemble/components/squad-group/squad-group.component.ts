import { Component, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { FormService } from 'src/app/components/form/logic/form.service';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
import { FlexCell } from 'src/app/components/grid/flex-cell/flex-cell.component';
import { QuestionGroup } from 'src/app/components/form/logic/question-group';
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

  
  @Input() public group: QuestionGroup;
  @Input() public questions: QuestionBase<string | number | Date>[];
  @Input() public hasBottom: boolean;

  // array to hold data for bottom form text
  public bottomData: FlexCell[] = [];

  // subject to handle update of questions form
  private $questions = new Subject<QuestionBase<string | number | Date>[]>();

  //
  private mixed: boolean = true;
  private client: boolean = false;

  constructor(
    private squadAssembleService: SquadAssembleService,
    private formService: FormService
  ) {}

  ngOnInit() {
    this.subscribeToOnSelectChange();
    this.questions = this.group.questions || [];

    if (this.hasBottom) {
      this.setSelectDataDemo()
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

  // method to change squad assemble form
  public onGenderChange() {
    this.mixed = !this.mixed;

    this.$questions.next(
      this.mixed
        ? this.squadAssembleService.groupAssembleFormMixedInputs
        : this.squadAssembleService.groupAssembleFormInputs
    );
  }

  // method to add new client form
  public onAddClient() {
    this.client = !this.client;

    const header: FormHeader = {
      text: 'איש קשר',
      custom: 'button',
    };

    this.client
      ? (this.squadAssembleService.customerFormInputs[3].group.header = header)
      : (this.squadAssembleService.customerFormInputs[3].group.header = null);

    this.$questions.next(this.squadAssembleService.customerFormInputs);
  }

  // TODO - connect between client select to client contact data + disable mode style
  private subscribeToOnSelectChange() {
    this.formService.onChangeSelect.subscribe((value) => {
      if (this.group.key === 'client') {
        this.onAddClient();
        console.log(this.formService.formGroup.controls.contact);
        this.formService.formGroup.controls.contact.disable();
      }
    });
  }
}
