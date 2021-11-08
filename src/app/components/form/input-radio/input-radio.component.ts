import { FormControl } from '@angular/forms';
import { QuestionRadio } from './../logic/question-radio';
import { Component, OnInit, Input } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'app-input-radio',
  templateUrl: './input-radio.component.html',
  styleUrls: ['./input-radio.component.scss'],
})
export class InputRadioComponent implements OnInit {
  @Input() public question: QuestionRadio;
  @Input() public control: FormControl;

  constructor() {}

  ngOnInit(): void {}

  public handleChange(radio: MatRadioChange) {
    this.control.setValue(radio.value);
  }
}
