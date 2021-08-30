import { Component, Input } from '@angular/core';
import { QuestionBase } from 'src/app/components/form/logic/question-base';

export interface FormHeader {
  text : string
  custom? : any
}

@Component({
  selector: 'app-squad-group',
  templateUrl: './squad-group.component.html',
  styleUrls: ['./squad-group.component.scss'],
})
export class SquadGroupComponent {
  @Input() public cols: string | number;
  @Input() public header: FormHeader;
  @Input() public questions: QuestionBase<string | number | Date>[];

  @Input() slots : {}

  constructor() {}

  ngOnInit() {
    this.questions = this.questions || [];
  }

  public onClick() {
    console.log('working')
  }
}
