import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
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
  public form: FormGroup;
  showSleepAreas: boolean = false;
  public chosenDate: number = 0;
  @Output() emitFormValues: EventEmitter<any> = new EventEmitter();

  constructor() { }

  public ngOnInit(): void {
    this.form = new FormGroup({
      'title': new FormControl(''),
      'start': new FormControl("08:00"),
      'end': new FormControl("09:00"),
      'backgroundColor': new FormControl('#ECF8EE'),
      'date': new FormControl(''),
      'className': new FormControl('border-activities'),
      'invitingCustomer': new FormControl(),
      'additions': new FormControl()
    });
  }

  currentDayHandler(newCurrentDay: number) {
    this.chosenDate = newCurrentDay;
  }

  public onSubmit(): void {
    this.emitFormValues.emit()
  }
}
