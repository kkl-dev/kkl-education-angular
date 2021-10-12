import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { InfoCard } from 'src/app/screens/education-results/education-results.component';
import { UserDataService } from 'src/app/utilities/services/user-data.service';
import { DAYS, FACILITY_OCCUPANCY } from 'src/mock_data/facilities';

export interface OccupiedBarModel {
  startingHour: number;
  endingHour: number;
  totalTime: number;
  user: string;
}

@Component({
  selector: 'app-add-facility',
  templateUrl: './add-facility.component.html',
  styleUrls: ['./add-facility.component.scss']
})
export class AddFacilityComponent implements OnInit {
  addFacilityForm: FormGroup
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
  @Input() hours: OccupiedBarModel[] = FACILITY_OCCUPANCY;
  @Input() startingHour: number = 0
  @Input() endingHour: number = 24;
  @Input() facility:InfoCard;
  @Output() emitFormValues: EventEmitter<any> = new EventEmitter();
  public selectedDate: number = 0;
  occupiedHoursArray: { totalHours: number; user: string }[] = [];

  showSleepAreas: boolean = false
  username: string = ''
  constructor(private userDataService: UserDataService) {
    this.username = this.userDataService.user.name;
  }

  ngOnInit(): void {
    console.log(this.facility);
    
    this.createOccupiedHoursArray();
    this.addFacilityForm = new FormGroup({
      'title': new FormControl(this.facility),
      'start': new FormControl(null),
      'end': new FormControl(null),
      'backgroundColor': new FormControl('#F0F6FE'),
      'date': new FormControl('')
    })
  }
  onSubmit() {
    this.addFacilityForm.controls['start'].setValue(this.arrangeTime('start'))
    this.addFacilityForm.controls['end'].setValue(this.arrangeTime('end'))
    this.emitFormValues.emit(this.addFacilityForm.value);
  }
  public arrangeTime(arg: string) :Date{
    const time = this.timeSplit(this.addFacilityForm.value[arg]);
    let date:any = this.dateSplit();
    date.setHours(time[0], time[1], time[2]);
    date = date.toISOString()
    return date;
  }
  public getDay(event: any): void {
    this.selectedDate = event;
  }
  public timeSplit(time: any): any[] {
    const split = time.split(':');
    split[0] = +split[0];
    split[1] = +split[1];
    return [...split, 0];
  }
  public dateSplit(): Date {
    const split = this.days[this.selectedDate].day.split('.');
    const newDate = new Date(`20${split[2]},${split[1]},${split[0]}`);
    return newDate;
  }
  createOccupiedHoursArray() {
    let startingHour = this.startingHour;

    this.hours.map((hour) => {
      if (startingHour < hour.startingHour) {
        this.occupiedHoursArray.push({
          totalHours: hour.startingHour - startingHour,
          user: 'none',
        });
      }

      this.occupiedHoursArray.push({
        totalHours: hour.totalTime,
        user: hour.user,
      });
      startingHour = hour.endingHour;
    });

    if (startingHour < this.endingHour) {
      this.occupiedHoursArray.push({
        totalHours: this.endingHour - startingHour,
        user: 'none',
      });
    }
  }

  calculateWidth(totalHours: number): string {
    const totalHoursPrecent = (totalHours / this.endingHour) * 100;

    return `${totalHoursPrecent}%`;
  }

}
