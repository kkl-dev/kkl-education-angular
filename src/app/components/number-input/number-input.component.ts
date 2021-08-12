import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.scss'],
})
export class NumberInputComponent implements OnInit {
  @Input() formControlName: string = '';
  @Input() id: string = '';
  @Input() innerLabel: string = '';
  @Input() type: string = '';
  @Input() value: string | number | undefined = 0;
  @Input() form!: FormGroup;

  constructor() {}

  ngOnInit(): void {}
  incrementValue() {
    if (typeof this.value === 'number') {
      this.value = this.value++;
      console.log(this.value);
    }
  }

  decrementValue() {
    if (typeof this.value === 'number') {
      this.value = this.value--;
      console.log(this.value);
    }
  }
}
