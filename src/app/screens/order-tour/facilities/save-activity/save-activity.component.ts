import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-save-activity',
  templateUrl: './save-activity.component.html',
  styleUrls: ['./save-activity.component.scss']
})
export class SaveActivityComponent implements OnInit {
  @Input() days: {
    day: string;
    options: {
      svgUrl: string;
      sleepingAreas: number;
      avialableSpaces: number;
      type: string;
      singleUnit: string;
    }
  }[] = [{
    day: '15.06.21',
    options: {
      svgUrl: '',
      sleepingAreas: 0,
      avialableSpaces: 0,
      type: '',
      singleUnit: '',
    }
  }, {
    day: '16.06.21',
    options: {
      svgUrl: '',
      sleepingAreas: 0,
      avialableSpaces: 0,
      type: '',
      singleUnit: '',
    }
  }, {
    day: '17.06.21',
    options: {
      svgUrl: '',
      sleepingAreas: 0,
      avialableSpaces: 0,
      type: '',
      singleUnit: '',
    }
  }, {
    day: '18.06.21',
    options: {
      svgUrl: '',
      sleepingAreas: 0,
      avialableSpaces: 0,
      type: '',
      singleUnit: '',
    }
  }]
  public chosenDate: number = 0
  @ViewChild('form') saveActivityForm: NgForm
  @Output() emitFormValues: EventEmitter<any> = new EventEmitter()

  showSleepAreas: boolean = false
  currentDayHandler(newCurrentDay: number) {
    this.chosenDate = newCurrentDay;
  }

  public orderingCustomer: boolean = false

  orderingCustomerHandler() {
    this.orderingCustomer = !this.orderingCustomer
  }
  @Input() additonsType: string[] = ['הסעה', 'כלכלה', 'הדרכה', 'אבטחה', 'הפעלה מוסיקלית']
  public addedAdditions: string[] = []

  constructor() { }

  updateAddedAdditions(value: string) {
    const index = this.addedAdditions.findIndex(addition => addition === value)
    if (index >= 0) {
      this.addedAdditions.splice(index, 1)
    } else {
      this.addedAdditions.push(value)
    }
    console.log(this.addedAdditions);

  }
  onSubmit(form: NgForm) {
    const objToEmit = { dayNumber: this.chosenDate, additions:this.addedAdditions,
      orderingCustomer: this.orderingCustomer, ...this.saveActivityForm.value }
    console.log(objToEmit);
    this.emitFormValues.emit(objToEmit)
  }

  ngOnInit(): void {
  }

}
