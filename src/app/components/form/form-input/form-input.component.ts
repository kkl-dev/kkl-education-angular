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
  @Input() public group: FormGroup;
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
  name: any;
  @Output() autocomplete: EventEmitter<FormControl> = new EventEmitter()
  @Output() select: EventEmitter<FormControl> = new EventEmitter()
  @Output() groupEvent: EventEmitter<FormGroup> = new EventEmitter()
  @Output() optionSelected: EventEmitter<MatAutocompleteSelectedEvent> = new EventEmitter()

  constructor(private formService: FormService, public squadBudgetService: SquadBudgetService, private tripService: TripService, private squadAssemble: SquadAssembleService, public squadGroupService: SquadGroupService) { }

  ngOnInit(): void {
    this.name = this.getName(this.control);
    let name = this.getName(this.control);
    if (name == 'tripStart' || name == 'tripEnding' || name == 'centerField')
      this.setDefaultValues(name);
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

  setDefaultValues(name: string) {
    switch (name) {
      case 'tripStart':
        if (this.tripService.sleepingDates.from != '') {
          this.control.setValue(this.tripService.sleepingDates.from);
          if (typeof (Storage) !== "undefined") {
            localStorage.setItem("sleepingDateStart", this.tripService.sleepingDates.from);
          }
        }
        else {
          this.control.setValue(localStorage.getItem("sleepingDateStart"));
        }
        break;
      case 'tripEnding':
        if (this.tripService.sleepingDates.till != '') {
          this.control.setValue(this.tripService.sleepingDates.till);
          if (typeof (Storage) !== "undefined") {
            localStorage.setItem("sleepingDateTill", this.tripService.sleepingDates.till);
          }
        }
        else {
          this.control.setValue(localStorage.getItem("sleepingDateTill"));
        }
        break;
      case 'centerField':
        if (this.tripService.centerField.id != 0) {
          this.control.setValue(this.tripService.centerField.id.toString());
          if (typeof (Storage) !== "undefined") {
            localStorage.setItem("centerFieldId", this.tripService.centerField.id.toString());
            localStorage.setItem("centerFieldName", this.tripService.centerField.name);
          }
        }
        else {
          this.control.setValue(localStorage.getItem("centerFieldId"));
        }
    }
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
        this.autocomplete.emit(this.control)
      }
    });
  }
  public onSelectChange() {
    if (this.control.parent.value.attribute) {
      this.tripService.getActivityLookupsByAttribute(this.control.parent.value.attribute, 'itiel');
    }
    if (this.name === 'attribute') {
      this.group.controls['activityType'].setValue(undefined);//איפוס שדה פעילות
      if (this.control.value === '12') {
        var index;
        for (var i in this.squadAssemble.formsArray) {
          Object.keys(this.squadAssemble.formsArray[i].controls).forEach(key => {
            if (key === 'ageGroup') { index = i; }
          });
        }
        this.squadAssemble.formsArray[index].controls['ageGroup'].setValue(undefined)
        // this.squadGroupService.mixedQuestions['ageGroup'].setValue(undefined)
      }
      var attr = this.tripService.attributesOriginal.filter(el => el.id === parseInt(this.control.value))[0];
      if (attr.autoCustomerId !== null) {// שליפת לקוח והצבתו בלקוח רצוי 
        this.tripService.getCustomer(attr.autoCustomerId);
      }
      this.tripService.budgetByParam.attribute = attr;
      this.tripService.budgetByParam.userId = "שחר";
      this.tripService.budgetByParam.userName = "שחר גל";
      //find index 'tripStart'
      var index;
      for (var i in this.squadAssemble.formsArray) {
        Object.keys(this.squadAssemble.formsArray[i].controls).forEach(key => {
          if (key === 'tripStart') { index = i; }
        });
      }
      let str = this.squadAssemble.formsArray[index].controls['tripStart'].value.split("/");
      this.tripService.budgetByParam.tripStart = str[2] + '-' + str[1] + '-' + str[0];
      this.tripService.getBudgetKKl(this.tripService.budgetByParam);
      // index = this.squadBudgetService.questions.findIndex(o => o.key === 'location');
      // this.squadBudgetService.questions[index].group.questions[0].inputProps.options = this.tripService.budget.listCity;
    }
    if (this.name === 'activityType') {
      var act = this.tripService.activityByAttributeOriginal.filter(el => el.id === parseInt(this.control.value))[0];
      this.tripService.budgetByParam.activity = act;
      this.tripService.budgetByParam.budget = this.tripService.budget;
      this.tripService.getBudgetExpensesAndIncome(this.tripService.budgetByParam);
    }
    if (this.name === 'location') {
      this.tripService.budgetByParam.budget.cityId = parseInt(this.control.value);
      this.tripService.getBudgetExpensesAndIncome(this.tripService.budgetByParam);
    }
    this.select.emit(this.control);
    this.groupEvent.emit(this.group);
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
