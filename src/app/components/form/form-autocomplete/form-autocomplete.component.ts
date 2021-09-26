import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { QuestionBase } from '../logic/question-base';
import { QuestionGroup } from '../logic/question-group';

@Component({
  selector: 'app-form-autocomplete',
  templateUrl: './form-autocomplete.component.html',
  styleUrls: ['./form-autocomplete.component.scss'],
})
export class FormAutocompleteComponent implements OnInit {
  @Input() group: QuestionGroup;
  @Input() formGroup: FormGroup;

  // show autocomplete data
  public data: boolean = false;
  public value: string ;

  constructor() {}

  ngOnInit(): void {
  }

  public onAutocomplete(control : FormControl) {
    this.data = true;
    this.value = control.value
  }
}
