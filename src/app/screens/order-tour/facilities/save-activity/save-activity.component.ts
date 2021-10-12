import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { DAYS } from 'src/mock_data/facilities';

@Component({
  selector: 'app-save-activity',
  templateUrl: './save-activity.component.html',
  styleUrls: ['./save-activity.component.scss']
})
export class SaveActivityComponent implements OnInit {
  public form: FormGroup;
  @Input() days: {
    day: string;
    options: {
      svgUrl: string;
      sleepingAreas: number;
      avialableSpaces: number;
      type: string;
      singleUnit: string;
    }
  }[] = DAYS;
  public selectedDate: number = 0;
  @ViewChild('form') saveActivityForm: NgForm;
  @Output() emitFormValues: EventEmitter<any> = new EventEmitter();

  showSleepAreas: boolean = false
  currentDayHandler(newCurrentDay: number) {
    this.selectedDate = newCurrentDay;
  }

  public orderingCustomer: boolean = false;

  orderingCustomerHandler() {
    this.orderingCustomer = !this.orderingCustomer
  }
  @Input() additonsType: string[] = ['הסעה', 'כלכלה', 'הדרכה', 'אבטחה', 'הפעלה מוסיקלית'];
  public addedAdditions: string[] = [];

  constructor() { }

  updateAddedAdditions(value: string) {
    const index = this.addedAdditions.findIndex(addition => addition === value)
    if (index >= 0) {
      this.addedAdditions.splice(index, 1)
    } else {
      this.addedAdditions.push(value)
    }
  }
  onSubmit(form: NgForm) {
    const objToEmit = {
      dayNumber: this.selectedDate, additions: this.addedAdditions,
      orderingCustomer: this.orderingCustomer, ...this.saveActivityForm.value
    }
    this.emitFormValues.emit(objToEmit.value)
  }

  ngOnInit(): void {
    new FormGroup({
      'title': new FormControl('test'),
      'start': new FormControl(null),
      'end': new FormControl(null),
      'backgroundColor': new FormControl('#F0F6FE'),
      'date': new FormControl(''),
      'className': new FormControl('border-facilities')
    });
  }

}
