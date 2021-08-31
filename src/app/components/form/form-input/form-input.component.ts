import { Component, OnInit, forwardRef, Input, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { CalendarOptions, FreeSpace } from 'comrax-alex-airbnb-calendar';
import { FormService } from '../logic/form.service';
import { QuestionBase } from '../logic/question-base';

@Component({
  selector: 'app-form-input',
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputComponent),
      multi: true,
    },
  ],
})
export class FormInputComponent implements OnInit {
  @ViewChild('input') input!: HTMLInputElement;

  @Input() public question!: QuestionBase<string | number | Date>;

  @Input() public control!: FormControl;
  @Input() public type!: string;
  @Input() public label!: string;
  @Input() public hint!: string;
  @Input() public controlType: string;
  @Input() public options!: [];

  @Input() public labelLength: string;
  @Input() public groupLabel!: string;
  @Input() public theme!: string;
  @Input() public icon!: string;
  @Input() public status!: string;
  @Input() public inputProps: {};
  @Input() public disabled: boolean;

  @Input() public serverErrorMode!: boolean;

  public color: string;

  public value!: any;
  public error!: string;
  public serverError!: string;

  public OnChange!: (event: Event) => void;
  public onTouched!: () => void;

  constructor(private formService: FormService) {}

  ngOnInit(): void {
    this.subscribeToControl();
  }

  // ControlValueAccessor logic

  public writeValue(value: any): void {
    this.value = value ? value : '';
  }

  public registerOnChange(fn: any): void {
    this.OnChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public handleChange(value: any) {
    console.log(value)
    this.value = value;
    this.validate()
  }

  // subscription section
  private subscribeToControl() {
    if (this.control.disabled) {
      this.color = 'disable';
    }

    this.control.valueChanges.subscribe((value) => {
      if (this.control.disabled) {
        this.color = 'disable';
      } else if (this.control.errors) {
        console.log(this.control.errors)
        this.color = 'danger';
      } else {
        this.color = '';
      }
    });
  }

  // LOGIC SECTION

  // method to handle validation messages
  public validate() {
    this.error = this.formService.getErrorMessage(this.control, this.label);

    console.log(this.control)
    console.log(this.error)

    this.control.valueChanges.subscribe(() => {
      this.error = this.formService.getErrorMessage(this.control, this.label);
    });

    // if (this.error) {
    //   this.color = 'danger';
    // } else {
    //   this.color = '';
    // }
  }

  // end of logic section
}
