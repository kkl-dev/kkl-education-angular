import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { ActivitiesCardInterface } from 'src/app/components/activities-card/activities-card.component';
import { DAYS } from 'src/mock_data/facilities';

@Component({
  selector: 'app-save-activity',
  templateUrl: './save-activity.component.html',
  styleUrls: ['./save-activity.component.scss']
})
export class SaveActivityComponent implements OnInit {
  public form: FormGroup;
  public orderingCustomer: boolean = false;
  public showSleepAreas: boolean = false;
  public addedAdditions: string[] = [];
  @Input() public activity: ActivitiesCardInterface;
  @Input() additonsType: string[] = ['הסעה', 'כלכלה', 'הדרכה', 'אבטחה', 'הפעלה מוסיקלית'];
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
  @Output() emitFormValues: EventEmitter<any> = new EventEmitter();

  ngOnInit(): void {
    new FormGroup({
      'title': new FormControl(this.activity.title),
      'start': new FormControl('08:00'),
      'end': new FormControl('08:00'),
      'backgroundColor': new FormControl('#F0F6FE'),
      'date': new FormControl(''),
      'className': new FormControl('border-facilities')
    });
  }

  currentDayHandler(newCurrentDay: number) {
    this.selectedDate = newCurrentDay;
  }

  orderingCustomerHandler() {
    this.orderingCustomer = !this.orderingCustomer;
  }

  constructor() { }

  updateAddedAdditions(value: string) {
    const index = this.addedAdditions.findIndex(addition => addition === value);
    if (index >= 0) {
      this.addedAdditions.splice(index, 1);
    } else {
      this.addedAdditions.push(value);
    }
  }
  onSubmit(form: NgForm) {
    this.emitFormValues.emit();
  }


}
