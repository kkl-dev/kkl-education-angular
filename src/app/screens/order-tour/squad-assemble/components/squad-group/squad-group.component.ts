import { Component, Input } from '@angular/core';
import { Subject } from 'rxjs';
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
})
export class SquadGroupComponent {
  private $questions = new Subject<QuestionBase<string | number | Date>[]>();

  @Input() public cols: string | number;
  @Input() public header: FormHeader;
  @Input() public questions: QuestionBase<string | number | Date>[];

  private mixed: boolean = true;

  @Input() slots: {};

  constructor(private squadAssembleService: SquadAssembleService) {}

  ngOnInit() {
    this.questions = this.questions || [];
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

  public onAddClient() {
    console.log('change client')
  }
}
