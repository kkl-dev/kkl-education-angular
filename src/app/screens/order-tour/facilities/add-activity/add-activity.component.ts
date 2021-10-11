import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-activity',
  templateUrl: './add-activity.component.html',
  styleUrls: ['./add-activity.component.scss']
})
export class AddActivityComponent implements OnInit {
  days: {
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
  @ViewChild('form') addActivityForm: NgForm
  showSleepAreas: boolean = false
  public chosenDate: number = 0
  @Output() emitFormValues: EventEmitter<any> = new EventEmitter();




  constructor() { }
  currentDayHandler(newCurrentDay: number) {
    this.chosenDate = newCurrentDay;
    console.log(newCurrentDay);

  }

  onSubmit(form: NgForm) {
    const objToEmit ={dayNumber: this.chosenDate, ...this.addActivityForm.value}
    console.log(objToEmit);
    this.emitFormValues.emit(objToEmit)
  }
  public closeEvent(event):void {
    console.log(event)
  }
  ngOnInit(): void {
  }

}
