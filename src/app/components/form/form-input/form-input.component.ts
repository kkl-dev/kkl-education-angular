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
  @Input() public group: FormGroup;
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

  constructor(private formService: FormService, public additionsService: AdditionsService, public transportService: TransportService, public squadBudgetService: SquadBudgetService, private tripService: TripService, private squadAssemble: SquadAssembleService, public squadGroupService: SquadGroupService
    ,private generalFormService: GeneralFormService) {
    console.log(this.dateOptions);
  }


  ngOnInit(): void {
    this.name = this.getName(this.control);
    let name = this.getName(this.control);
    if (name == 'dates' || name == 'centerField')
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
      case 'dates':
        if (this.tripService.sleepingDates.from != '' && this.tripService.sleepingDates.till != '') {
          this.control.setValue(this.tripService.sleepingDates.from + '-' + this.tripService.sleepingDates.till);
          if (typeof (Storage) !== "undefined") {
            localStorage.setItem("sleepingDates", this.tripService.sleepingDates.from + '-' + this.tripService.sleepingDates.till);
          }
        }
        else {
          this.control.setValue(localStorage.getItem("sleepingDates"));
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
    // if (this.control.parent.value.attribute) {
    //   this.tripService.getActivityLookupsByAttribute(this.control.parent.value.attribute, 'שחר גל');
    // }
    if (this.name === 'attribute') {
      this.tripService.getActivityLookupsByAttribute(this.control.parent.value.attribute, 'שחר גל');
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
      //find index 'dates'
      var index;
      for (var i in this.squadAssemble.formsArray) {
        Object.keys(this.squadAssemble.formsArray[i].controls).forEach(key => {
          // if (key === 'tripStart') { index = i; }
          if (key === 'dates') { index = i; }
        });
      }
      //let str = this.squadAssemble.formsArray[index].controls['tripStart'].value.split("/");
      let tripDatesArr = this.squadAssemble.formsArray[index].controls['dates'].value.split("-");
      let tripStart = tripDatesArr[0];
      let tripStartArr = tripStart.split("/");
      tripStart = tripStartArr[2] + '-' + tripStartArr[1] + '-' + tripStartArr[0];
      this.tripService.budgetByParam.tripStart = tripStart;
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
      this.tripService.getBudgetExpensesAndIncome(this.tripService.budgetByParam);
    }
    if (this.name === 'budgetIncome') {
      this.tripService.budgetByParam.budget.incomeId = parseInt(this.control.value);
    }
    if (this.name === 'budgetExpense') {
      this.tripService.budgetByParam.budget.expensesId = parseInt(this.control.value);
    }
    if (this.name === 'supplier') {
      this.generalFormService.getOrderItemBySupplierId();
    }
    if (this.name === 'itemId') {
      let index = this.generalFormService.details.findIndex(el => el.key === "itemCost");
      let item = this.generalFormService.originalItemList.find(el => el.id === parseInt(this.control.value))
      var x = Math.floor(item.cost)
      this.generalFormService.details[index].value = x.toString();

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
