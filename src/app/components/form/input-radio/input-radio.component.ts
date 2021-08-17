import { SelectOption } from './../logic/question-base';
import { FormControl } from '@angular/forms';
import { QuestionRadio } from './../logic/question-radio';
import { Component, OnInit, Input } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'app-input-radio',
  templateUrl: './input-radio.component.html',
  styleUrls: ['./input-radio.component.scss']
})
export class InputRadioComponent implements OnInit {

  @Input() public question!: QuestionRadio
  @Input() public control!: FormControl
  @Input() public options!: SelectOption[]
  @Input() public label!: string


  constructor() { }



  ngOnInit(): void {

  }

  public handleChange(radio: MatRadioChange) {
    console.log(this.control)
    this.control.setValue(radio.value)

  }
}
