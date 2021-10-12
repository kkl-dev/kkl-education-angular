import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DAYS } from 'src/mock_data/facilities';

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
  }[] = DAYS;

  @ViewChild('form') addActivityForm: NgForm
  showSleepAreas: boolean = false;
  public chosenDate: number = 0;
  @Output() emitFormValues: EventEmitter<any> = new EventEmitter();

  constructor() { }
  currentDayHandler(newCurrentDay: number) {
    this.chosenDate = newCurrentDay;
  }

  onSubmit(form: NgForm) {
    const objToEmit = { dayNumber: this.chosenDate, ...this.addActivityForm.value }
    this.emitFormValues.emit(objToEmit)
  }
  public closeEvent(event): void {
    console.log(event)
  }
  ngOnInit(): void {
  }

  //date functions 
  
}
