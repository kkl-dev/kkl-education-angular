import {
  Component,
  OnInit,
  Input,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FormService } from '../logic/form.service';
import { QuestionBase } from '../logic/question-base';

@Component({
  selector: 'app-form-input',
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.scss'],
})
export class FormInputComponent implements OnInit {
  @ViewChild('input') input!: HTMLInputElement;

  @Input() public question!: QuestionBase<string | number | Date>;

  @Input() public control: FormControl;
  @Input() public type: string;
  @Input() public label: string;
  @Input() public hint: string;
  @Input() public controlType: string;
  @Input() public options!: [];
  @Input() public dateOptions!: [];

  @Input() public groupLabel!: string;
  @Input() public theme!: string;
  @Input() public icon!: string;
  @Input() public inputProps: {};
  @Input() public disabled: boolean;

  @Input() public serverErrorMode!: boolean;

  public color: string;
  public value!: any;
  public error!: string;
  public serverError!: string;

  @Output() autocomplete: EventEmitter<FormControl> = new EventEmitter()
  @Output() select: EventEmitter<FormControl> = new EventEmitter()
  @Output() optionSelected: EventEmitter<MatAutocompleteSelectedEvent> = new EventEmitter()

  constructor(private formService: FormService) { }

  ngOnInit(): void {
    this.subscribeToControl();
  }

  public handleChange(value: any) {
    this.value = value;
  }


  // CALENDAR METHODS
  newDateReceived(newDate: any) {
    console.log(newDate);

  }
  prevDateReceived(prevDate: any) {
    console.log(prevDate);

  }

  newSleepingPlaceReceived(sleepingPlace: any) {
    console.log(sleepingPlace);

  }

  // END IF CALENDER METHODS

  // subscription section
  private subscribeToControl() {
    if (this.control.disabled) {
      this.color = 'disable';
    }

    this.control.valueChanges.subscribe((value) => {
      if (this.control.disabled) {
        this.color = 'disable';
      } else if (this.control.errors) {
        this.color = 'danger';
      } else {
        this.color = '';
      }
      if (this.controlType === 'autocomplete') {
        this.autocomplete.emit(this.control)
      }
    });
  }

  public onSelectChange() {
    this.select.emit(this.control)
  }

  public onOptionSelected(event: MatAutocompleteSelectedEvent) {
    this.optionSelected.emit(event)
  }

  // LOGIC SECTION

  // method to handle validation messages
  public validate() {
    this.error = this.formService.getErrorMessage(this.control, this.label);
    this.control.valueChanges.subscribe(() => {
      this.error = this.formService.getErrorMessage(this.control, this.label);
    });
  }
}
