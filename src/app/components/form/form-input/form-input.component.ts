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

  constructor(private formService: FormService, private tripService:TripService) { }

  ngOnInit(): void {
   
    let name = this.getName(this.control);
    console.log('control name is :', name);
    if(name=='tripStart' || name=='tripEnding' || name == 'centerField')
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

    
  setDefaultValues(name: string){ 
    switch(name) { 
      case 'tripStart':
        if(this.tripService.sleepingDates.from !=''){
          this.control.setValue(this.tripService.sleepingDates.from);
          if (typeof(Storage) !== "undefined") {
            localStorage.setItem("sleepingDateStart",this.tripService.sleepingDates.from);
          }
        } 
        else{
          this.control.setValue(localStorage.getItem("sleepingDateStart"));
        }     
       break; 
      case  'tripEnding':
        if(this.tripService.sleepingDates.till !=''){
          this.control.setValue(this.tripService.sleepingDates.till);
          if (typeof(Storage) !== "undefined") {
            localStorage.setItem("sleepingDateTill",this.tripService.sleepingDates.till);
          }      
        }  
        else{
          this.control.setValue(localStorage.getItem("sleepingDateTill"));
        }  
        break;
      case 'centerField':
        if(this.tripService.centerField.id!=0){
          this.control.setValue(this.tripService.centerField.id.toString());
          if (typeof(Storage) !== "undefined") {
            localStorage.setItem("centerFieldId",this.tripService.centerField.id.toString());
            localStorage.setItem("centerFieldName",this.tripService.centerField.name);
          }
        }
        else{
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

  public onSelectChange(event:any,c:any,question:any,i:any) {
    console.log(event)
    try{
    if(c.parent.value.attribute){
      this.tripService.getActivityLookupsByAttribute(c.parent.value.attribute,'itiel');
    }
   }
    catch(error){
    console.log(error);
   }      
   this.select.emit(this.control)
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
