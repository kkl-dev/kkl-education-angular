import { Component, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { FormService } from 'src/app/components/form/logic/form.service';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
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

  private $questions = new Subject<QuestionBase<string | number | Date>[]>();
  private mixed: boolean = true;
  private client: boolean = false;

  constructor(
    private squadAssembleService: SquadAssembleService,
    private formService: FormService
  ) {}

  ngOnInit() {
    this.questions = this.questions || [];
    console.log(this.formService.id)
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
