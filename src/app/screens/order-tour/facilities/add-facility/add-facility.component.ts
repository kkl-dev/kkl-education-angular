import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
//import { InfoCard } from 'src/app/screens/education-results/education-results.component';
import { FacilitiesService } from 'src/app/services/facilities.service';
import { TripService } from 'src/app/services/trip.service';
import { UserDataService } from 'src/app/utilities/services/user-data.service';
import { DAYS } from 'src/mock_data/facilities';
import { FacilityModel, FacilitiesList, OccupiedHours } from '../models/facility.model';

export interface OccupiedBarModel {
  fromHour: number;
  tillHour: number;
  totalTime: number;
  customerName: string;
}




// export interface InfoCard1 {
//   svgUrl: string;
//   title?: string;
//   headline?: string;
//   subHeadline?: string;
//   availability?: TooltipDataModel1[];
//   maxParticipants?: string;
//   days?: any[];
// }
// export interface TooltipDataModel {
//   startingHour: number;
//   endingHour: number;
//   totalTime: number;
//   user: string;
// }
// export interface OccupiedBarModel {
//   startingHour: number;
//   endingHour: number;
//   totalTime: number;
//   user: string;
// }


@Component({
  selector: 'app-add-facility',
  templateUrl: './add-facility.component.html',
  styleUrls: ['./add-facility.component.scss']
})
export class AddFacilityComponent implements OnInit {
  addFacilityForm: FormGroup;
  //  @Input() days: any[] = DAYS;
  @Input() days: any[] = this.tripService.facilitiesArray;

  //FacilitiesList
  public selectedFacility$: Observable<any>;
  @Input() startingHour: number = 0
  @Input() endingHour: number = 24;
  @Input() hours: OccupiedHours[];
  @Output() emitFormValues: EventEmitter<any> = new EventEmitter();
  public selectedDay: number = 0;
  public subscribeToFacility: Subscription;
  public updateForm: boolean = false;
  occupiedHoursArray: { totalHours: number; user: string }[] = [];
  showSleepAreas: boolean = false
  username: string = ''
  defaultImage: string = 'defaultFacility.svg';

  constructor(private userDataService: UserDataService, private facilitiesServices: FacilitiesService, private tripService: TripService) {
    this.username = this.userDataService.user.name;
  }

  public ngOnInit(): void {
    this.selectedFacility$ = this.facilitiesServices.getSelectedFacility();
    this.subscribeToFacility = this.selectedFacility$.subscribe(data => {
      this.hours = data.occupiedHours;
      this.createOccupiedHoursArray();
      this.createForm(data);
    });
  }
  public createForm(data): void {
    if (!data.start) {
      this.addFacilityForm = new FormGroup({
        'title': new FormControl(data.name),
        'selectedDay': new FormControl(this.selectedDay),
        'start': new FormControl('08:00'),
        'end': new FormControl('09:00'),
        'backgroundColor': new FormControl('#F0F6FE'),
        'date': new FormControl(''),
        'className': new FormControl('border-facilities'),
        'type': new FormControl('facility'),
        // 'maxParticipants': new FormControl(),
        'availability': new FormControl(data.occupiedHours),
        // 'svgUrl': new FormControl(data.iconPath),
        'svgUrl': new FormControl('assets/images/' + data.iconPath) || null,
        'facilityId': new FormControl(data.id || null)
      });
    } else {
      this.updateForm = true;
      this.selectedDay = data.selectedDay;
      data.start = this.separateTimeFromDate(data.start);
      data.end = this.separateTimeFromDate(data.end);
      this.addFacilityForm = new FormGroup({});
      for (const property in data) {
        this.addFacilityForm.addControl(property, new FormControl(data[property]));
      }
    }

  }
  public ngOnDestroy(): void {
    this.subscribeToFacility.unsubscribe();
  }

  onSubmit() {
    this.addFacilityForm.controls['start'].setValue(this.arrangeTime('start'));
    this.addFacilityForm.controls['end'].setValue(this.arrangeTime('end'));
    this.addFacilityForm.controls['selectedDay'].setValue(this.selectedDay);

    if (this.updateForm) {
      this.facilitiesServices.updateItemInArrayOfCalendar(this.addFacilityForm.value);
      this.closeModal();
      return;
    }

    this.emitFormValues.emit(this.addFacilityForm.value);
    this.closeModal();
  }
  public deleteItem(event): void {
    event.preventDefault();
    const id = this.addFacilityForm.controls['id'].value;
    this.facilitiesServices.deleteItemFromArray(id);
    this.facilitiesServices.closeModal('close');
  }

  public startTimeChanged(event: string) {
    this.addFacilityForm.controls['start'].setValue(event);
  }
  public endTimeChanged(event: string) {
    this.addFacilityForm.controls['end'].setValue(event);
  }
  public arrangeTime(arg: string): any {
    // yak changed for compatible with date (2021-11-07T00:00:00) and not (21.10.2021)
    //  const [day, month, year] = this.days[this.selectedDay].day.split(".");
    let day = this.days[this.selectedDay].date.split("T");
    let [hours, minutes] = this.addFacilityForm.value[arg].split(':');
    if (hours.length == 1) {
      hours = `0${hours}`;
    }
    return `${day[0]}T${hours}:${minutes}`;
    //return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
  public getDay(event: any): void {
    this.selectedDay = event;
  }

  public closeModal(): void {
    this.facilitiesServices.closeModal('close');
  }
  createOccupiedHoursArray() {
    let startingHour = this.startingHour;

    this.hours.map((hour) => {
      if (startingHour < hour.fromHour) {
        this.occupiedHoursArray.push({
          totalHours: hour.fromHour - startingHour,
          user: 'none',
        });
      }

      this.occupiedHoursArray.push({
        totalHours: hour.totalTime,
        user: hour.customerName,
      });
      startingHour = hour.tillHour;
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

  public separateTimeFromDate(args: string): string {
    const [date, time] = args.split('T');
    return time;
  }
}