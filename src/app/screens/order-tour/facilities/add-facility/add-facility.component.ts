import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { CheckAvailabilityService } from 'src/app/utilities/services/check-availability.service';
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

  occupiedHoursArray: { totalHours: number; user: string }[] = [];

  showSleepAreas: boolean = false
  username: string = ''
  constructor(private userDataService: UserDataService, private checkAvailabillityService: CheckAvailabilityService) {
    this.username = this.userDataService.user.name;
  }

  ngOnInit(): void {
    this.createOccupiedHoursArray();
    this.addFacilityForm = new FormGroup({
      'title': new FormControl(this.facility),
      'start': new FormControl(null),
      'end': new FormControl(null),
      'backgroundColor': new FormControl('#ECF8EE')
    })
  }
  onSubmit() {
    this.emitFormValues.emit(this.addFacilityForm.value);
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
