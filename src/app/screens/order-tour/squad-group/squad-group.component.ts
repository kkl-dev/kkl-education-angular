import { Component, Input } from '@angular/core';
import { QuestionBase } from 'src/app/components/form/logic/question-base';

@Component({
  selector: 'app-squad-group',
  templateUrl: './squad-group.component.html',
  styleUrls: ['./squad-group.component.scss'],
})
export class SquadGroupComponent {

  @Input() public title!: string;
  @Input() public formCols!: string;
  @Input() public questions!: QuestionBase<string>[];

  constructor() {}



}
