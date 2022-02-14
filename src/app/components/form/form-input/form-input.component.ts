import {
  Component,
  OnInit,
  Input,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { BudgetByParams } from 'src/app/open-api';
import { BudgetModel } from 'src/app/screens/order-tour/squad-assemble/components/squad-budget/squad-budget.model';
import { SquadBudgetService } from 'src/app/screens/order-tour/squad-assemble/components/squad-budget/squad-budget.service';
import { SquadGroupService } from 'src/app/screens/order-tour/squad-assemble/components/squad-group/squad-group.service';
import { SquadAssembleService } from 'src/app/screens/order-tour/squad-assemble/services/squad-assemble.service';
import { TripService } from 'src/app/services/trip.service';
import { CalendarOptions } from 'comrax-alex-airbnb-calendar';
import { FormService } from '../logic/form.service';
import { QuestionBase } from '../logic/question-base';
import { AdditionsService } from 'src/app/screens/order-tour/additions/services/additions.service';
import { TransportService } from 'src/app/screens/order-tour/additions/services/transport.service';
import { GeneralFormService } from 'src/app/screens/order-tour/additions/services/general-form.service';

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
  @Input() public dateOptions!: CalendarOptions;
  @Input() public groupLabel!: string;
  @Input() public theme!: string;
  @Input() public icon!: string;
  @Input() public inputProps: {};
  @Input() public disabled: boolean;
  //@Input() public group: FormGroup;
  @Input() public serverErrorMode!: boolean;
  public color: string;
  public value!: any;
  public error!: string;
  public serverError!: string;
  name: any;
  @Output() autocomplete: EventEmitter<FormControl> = new EventEmitter()
  @Output() select: EventEmitter<FormControl> = new EventEmitter()
  //@Output() groupEvent: EventEmitter<FormGroup> = new EventEmitter()
  @Output() optionSelected: EventEmitter<MatAutocompleteSelectedEvent> = new EventEmitter()
  @Output() dateInputChanged: EventEmitter<any> = new EventEmitter()
  constructor(private formService: FormService, public additionsService: AdditionsService, public transportService: TransportService, public squadBudgetService: SquadBudgetService, private tripService: TripService, private squadAssemble: SquadAssembleService, public squadGroupService: SquadGroupService
    , private generalFormService: GeneralFormService) {
    console.log(this.dateOptions);
  }


  ngOnInit(): void {
    this.name = this.getName(this.control);
    let name = this.getName(this.control);
    // if (name == 'dates' || name == 'centerField')
      //this.setDefaultValues(name);
    this.subscribeToControl();
  }

  public handleChange(value: any) {
    this.value = value;
  }

  // CALENDAR METHODS
  newDateReceived(newDate: any) {
    console.log(newDate);

  }
  dateObjChanged(newDate: any) {
    console.log(newDate);
    this.dateInputChanged.emit(newDate)
  }
  prevDateReceived(prevDate: any) {
    console.log(prevDate);
  }

  newSleepingPlaceReceived(sleepingPlace: any) {
    console.log(sleepingPlace);
  }

  
  getName(control: AbstractControl): string | null {
    let group = <FormGroup>control.parent;

    if (!group) {
      return null;
    }

    let name: string;
    Object.keys(group.controls).forEach(key => {
      let childControl = group.get(key);

      if (childControl !== control) {
        return;
      }
      name = key;
    });
    return name;
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
        //console.log('autocomplete - this.control ', this.control);
        this.autocomplete.emit(this.control)
      }
    });
  }
  public onSelectChange() {
    
    this.select.emit(this.control);
    console.log(this.control.value);
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
