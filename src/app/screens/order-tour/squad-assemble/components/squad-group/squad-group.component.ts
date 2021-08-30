import { Component, Input } from '@angular/core';
import { QuestionBase } from 'src/app/components/form/logic/question-base';

@Component({
  selector: 'app-squad-group',
  templateUrl: './squad-group.component.html',
  styleUrls: ['./squad-group.component.scss'],
})
export class SquadGroupComponent {
  @Input() public title: string;
  @Input() public cols: string | number;
  @Input() public questions: QuestionBase<string | number | Date>[];

  constructor() {}

  ngOnInit() {
    this.questions = this.questions || [];
    console.log(this.cols)
  }
}
