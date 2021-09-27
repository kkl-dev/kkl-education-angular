import { FormGroup } from '@angular/forms';
import { Component, Input, OnInit, ElementRef } from '@angular/core';
import { QuestionBase } from '../logic/question-base';
import { QuestionGroup } from '../logic/question-group';

@Component({
  selector: 'app-form-group',
  templateUrl: './form-group.component.html',
  styleUrls: ['./form-group.component.scss']
})
export class FormGroupComponent implements OnInit {

  @Input() group : QuestionGroup
  @Input() question : QuestionBase<string | number | Date>[]
  @Input() formGroup : FormGroup
  @Input() slot : ElementRef

  constructor() { }

  ngOnInit(): void {
  }

  public onEdit() {
    
  }

}
