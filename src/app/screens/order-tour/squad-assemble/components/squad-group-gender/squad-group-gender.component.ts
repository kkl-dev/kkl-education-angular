import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionGroup } from 'src/app/components/form/logic/question-group';

@Component({
  selector: 'app-squad-group-gender',
  templateUrl: './squad-group-gender.component.html',
  styleUrls: ['./squad-group-gender.component.scss'],
})
export class SquadGroupGenderComponent implements OnInit {
  @Input() group: QuestionGroup;
  @Input() formGroup: FormGroup;
  constructor() {}

  ngOnInit(): void {}
}
