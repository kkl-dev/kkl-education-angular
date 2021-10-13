import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { InfoCard } from 'src/app/screens/education-results/education-results.component';
import { FacilitiesService } from 'src/app/services/facilities.service';
import { UserDataService } from 'src/app/utilities/services/user-data.service';
import { DAYS } from 'src/mock_data/facilities';

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
  addFacilityForm: FormGroup;
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
  @Input() startingHour: number = 0
  @Input() endingHour: number = 24;
  @Input() facility: InfoCard;
  @Input() hours: OccupiedBarModel[];
  @Output() emitFormValues: EventEmitter<any> = new EventEmitter();
  public selectedDate: number = 0;
  occupiedHoursArray: { totalHours: number; user: string }[] = [];

  showSleepAreas: boolean = false
  username: string = ''
  constructor(private userDataService: UserDataService, private facilitiesServices: FacilitiesService) {
    this.username = this.userDataService.user.name;
  }

  ngOnInit(): void {
    this.hours = this.facility.availability;
    this.createOccupiedHoursArray();
    this.addFacilityForm = new FormGroup({
      'title': new FormControl(this.facility.headline),
      'start': new FormControl('08:00'),
      'end': new FormControl('08:00'),
      'backgroundColor': new FormControl('#F0F6FE'),
      'date': new FormControl(''),
      'className': new FormControl('border-facilities')
    });
  }

  onSubmit() {
    this.addFacilityForm.controls['start'].setValue(this.arrangeTime('start'));
    this.addFacilityForm.controls['end'].setValue(this.arrangeTime('end'));
    this.emitFormValues.emit(this.addFacilityForm.value);
    this.closeModal();
  }
  public arrangeTime(arg: string): any {
    const [day, month, year] = this.days[this.selectedDate].day.split(".");
    const [hours, minutes] = this.addFacilityForm.value[arg].split(':');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
  public getDay(event: any): void {
    this.selectedDate = event;
  }

  public closeModal(): void {
    this.facilitiesServices.closeModal('close');
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
