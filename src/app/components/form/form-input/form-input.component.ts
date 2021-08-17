import { Component, OnInit, forwardRef, Input, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { FormService } from '../logic/form.service';

@Component({
  selector: 'app-form-input',
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputComponent),
      multi: true
    },
  ]
})
export class FormInputComponent implements OnInit {

  @ViewChild('input') input!: HTMLInputElement;

  @Input() public control!: FormControl
  @Input() public controlType!: string
  @Input() public split!: boolean

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

  public OnChange!: (event: Event) => void
  public onTouched!: () => void
  public disabled!: boolean

  constructor(
    private formService : FormService
  ) { }

  ngOnInit(): void {
    this.subscribeToControl();
    console.log(this.split)
  }

  // ControlValueAccessor logic

  public writeValue(value: any): void {
    this.value = value ? value : ""
  }

  public registerOnChange(fn: any): void {
    this.OnChange = fn
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  public setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled
  }

  public handleChange(value: any) {
    this.value = value
  }

  // subscription section
  private subscribeToControl() {

  }


  // LOGIC SECTION

  // method to handle validation messages
  public validate() {

    this.error = this.formService.getErrorMessage(this.control, this.placeHolder)

    this.control.valueChanges.subscribe(
      () => {
        this.error = this.formService.getErrorMessage(this.control, this.placeHolder)
      }
    )
  }

  // end of logic section
}
