import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UserDataService } from 'src/app/utilities/services/user-data.service';

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
  @Input() hours: OccupiedBarModel[] = [{
    startingHour: 8,
    endingHour: 10,
    totalTime: 2,
    user: 'גנים',
  },
  {
    startingHour: 14,
    endingHour: 15.25,
    totalTime: 1.25,
    user: 'דני',
  },
  {
    startingHour: 19.75,
    endingHour: 24,
    totalTime: 4.25,
    user: 'יוסי',
  }];
  @Input() startingHour: number = 0
  @Input() endingHour: number = 24;
  @Input() facility: string = 'כיתה';
  @Output() emitFormValues: EventEmitter<any> = new EventEmitter();
  public selectedDate: number = 0;
  occupiedHoursArray: { totalHours: number; user: string }[] = [];

  showSleepAreas: boolean = false
  username: string = ''
  constructor(private userDataService: UserDataService) {
    this.username = this.userDataService.user.name;
  }

  ngOnInit(): void {
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
    const startTime = this.timeSplit(this.addFacilityForm.value.start)
    const endTime = this.timeSplit(this.addFacilityForm.value.end);
    const date = this.dateSplit();
    date.setHours(startTime[0],startTime[1],startTime[3]);
    this.addFacilityForm.controls['start'].setValue(date)
    console.log(this.addFacilityForm);
    this.emitFormValues.emit(this.addFacilityForm.value);
  }
  public arrangeTime(arg:string) {
    // start Time 
    const time = this.timeSplit(this.addFacilityForm.value[arg]);
    const date = this.dateSplit();
    date.setHours(time[0],time[1],time[3]);
    return date;
  }
  public getDay(event: any): void {
    this.selectedDate = event;
  }
  public timeSplit(time: string):any[] {
    const split = time.split(':');
    return [ ...split,0];
  }
  public dateSplit():Date {
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
