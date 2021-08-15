import { QuestionBase } from 'src/app/components/form-container/question-base';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-squad-group',
  templateUrl: './squad-group.component.html',
  styleUrls: ['./squad-group.component.scss']
})
export class SquadGroupComponent implements OnInit {

  @Input() public title!: string
  @Input() public showButton!: boolean
  @Input() public questions!: QuestionBase<string>[]

  constructor() { }

  ngOnInit(): void {
    console.log(this.title)
  }

}
