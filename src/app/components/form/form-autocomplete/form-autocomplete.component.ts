import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionBase } from '../logic/question-base';
import { QuestionGroup } from '../logic/question-group';

@Component({
  selector: 'app-form-autocomplete',
  templateUrl: './form-autocomplete.component.html',
  styleUrls: ['./form-autocomplete.component.scss']
})
export class FormAutocompleteComponent implements OnInit {

  @Input() group : QuestionGroup
  @Input() formGroup : FormGroup
  @Input() slot : ElementRef

  constructor() { }

  ngOnInit(): void {

    console.log(this.group)
  }

}
