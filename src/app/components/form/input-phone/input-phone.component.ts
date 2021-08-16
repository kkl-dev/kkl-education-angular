import { FormControl } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { FormService } from '../logic/form.service';

@Component({
  selector: 'app-input-phone',
  templateUrl: './input-phone.component.html',
  styleUrls: ['./input-phone.component.scss']
})
export class InputPhoneComponent implements OnInit {

  @Input() public control!: FormControl
  @Input() public controlType!: string

  @Input() public type!: string;
  @Input() public label!: string;
  @Input() public placeHolder!: string;
  @Input() public hint!: string;
  @Input() public controlName!: string;
  @Input() public icon!: string;
  @Input() public status!: string;
  @Input() public options!: []

  @Input() public serverErrorMode!: boolean;
  @Input() public pendingHint!: boolean;

  public value!: any
  public error!: string
  public serverError!: string
  
  constructor(
    private formService: FormService
  ) { }

  ngOnInit(): void {
  }

  public handleChange(value: any) {
    this.value = value
  }
  // method to handle validation messages
  public validate() {

    this.error = this.formService.getErrorMessage(this.control, this.placeHolder)

    this.control.valueChanges.subscribe(
      () => {
        this.error = this.formService.getErrorMessage(this.control, this.placeHolder)
      }
    )
  }
}
