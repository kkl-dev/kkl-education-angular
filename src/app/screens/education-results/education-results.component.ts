import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CheckAvailabilityService } from 'src/app/utilities/services/check-availability.service';
import { TooltipDataModel } from './tooltip/tooltip.component';
import { UserDataService } from 'src/app/services/user-data.service';
import { UserService } from 'src/app/open-api/';
import { TripService } from 'src/app/services/trip.service';
import { FakeService } from 'src/app/services/fake.service';
import { MapsComponent } from './maps/maps.component';
import { Observable, Subscription } from 'rxjs';

export interface InfoCard {
  iconPath: string;
  name: string;
  subHeadline?: string;
  maxOccupancy?: TooltipDataModel[];
}

@Component({
  selector: 'app-education-results',
  templateUrl: './education-results.component.html',
  styleUrls: ['./education-results.component.scss'],
})

export class EducationResultsComponent implements OnInit {
  @ViewChild(MapsComponent) child: MapsComponent;

  forestCenter: any | undefined;
  //forestCenter: any | undefined = this.tripService.centerField || {};
  sleepingDates: any;
  fromOtherComponent: boolean = true;
  facilitiesArray: any = [{
    "date": "",
    "facilitiesList": []
  }];

  facilityForDay: any;
  AvailableSleepingOptions: any;
  //forestCenterSubscribe: Observable<any>;
  subscribeToForestCenter: Subscription;

  constructor(private router: Router, private checkAvailabilityService: CheckAvailabilityService,
    public usersService: UserService, private route: ActivatedRoute, private tripService: TripService, private api: FakeService) {

    this.subscribeToForestCenter = this.tripService.forestCenter.subscribe(forestCenter => {
      console.log('education result forestCenter' + forestCenter)
    });
    // this.tripService.forestCenter.subscribe(forestCenter => {
    //   console.log('education result forestCenter' + forestCenter )
    // });


    //

    //deleted temp
    //this.facilitiesArray = this.checkAvailabilityService.getNewFacilitiesArray(this.sleepingOptionsByDay[0].day);
    // let a = this.checkAvailabilityService.getNewFacilitiesArray(this.sleepingOptionsByDay[0].day);
    // console.log('checkAvailabilityService  a: ', a);

    // this.api.getAvailableFacilityDates('').subscribe((data) => {
    //   console.log('data', { data });

    //   if (data) {
    //     this.facilitiesArray = data[0];
    //     console.log('facilitiesArray from fake api', this.facilitiesArray);

    //   } else {
    //     console.log('no data in dates');
    //   }
    // },
    //   error => {
    //     console.log({ error });
    //   });

    //this.facilitiesArray = this.api.getAvailableFacilityDates('this.AvailableSleepingOptions[0].day');
    // console.log('facilitiesArray2', this.facilitiesArray);

    //console.log(this.checkAvailabilityService.checkAvailabilltyValues.calendarInput);
    // this.changeDatesHandler(this.checkAvailabillityService.checkAvailabilltyValues.calendarInput);
  }

  ngOnInit() {
    console.log(this.tripService);
    //this.changeDatesHandler(this.tripService.sleepingDates.from + "-" + this.tripService.sleepingDates.till);

    // if (this.tripService.centerField) {
    this.forestCenter = this.tripService.centerField;
    this.sleepingDates = this.tripService.sleepingDates;
    // for (let key in this.sleepingDates) {
    //   let value = this.sleepingDates[key];
    //   // Use `key` and `value`
    //   console.log('key :' + key);
    //   console.log('value :' + value);
    // }
    //}

    this.tripService.AvailableSleepingOptions.subscribe(AvailableSleepingOptions => {
      this.AvailableSleepingOptions = AvailableSleepingOptions; // this set's the username to the default observable value
      //console.log('educational -- > AvailableSleepingOptions:', this.AvailableSleepingOptions);
      this.getAvailableFacilities();
    });

    //console.log('facilities Array in ngOnInit: ', this.facilitiesArray);
    this.facilityForDay = this.facilitiesArray[0].facilitiesList;
    this.fromOtherComponent = false;
  }

  ngOnDestroy(): void {
    this.subscribeToForestCenter.unsubscribe();
  }

  currentDayHandler(newCurrentDay: number) {
    //this.emitCurrentDay.emit(newCurrentDay);
    this.child.currentDayHandler(newCurrentDay);

    //this.facilitiesArray = this.checkAvailabilityService.getNewFacilitiesArray(this.sleepingOptionsByDay[newCurrentDay].day);
    //console.log('facilitiesArray', this.facilitiesArray);
    this.facilityForDay = this.facilitiesArray[newCurrentDay].facilitiesList;
    console.log('facilityForDay: ', this.facilityForDay);

  }

  getAvailableFacilities() {
    let sleepingDates = this.tripService.convertDatesFromSlashToMinus();
    this.usersService.getAvailableFacilities(this.tripService.centerField.id, sleepingDates.from, sleepingDates.till).subscribe((facilities: any) => {
      console.log('get Available Facilities: ', facilities);
      if (facilities) {
        this.facilityForDay = facilities[0].facilitiesList;
        this.facilitiesArray = facilities;
        this.tripService.setfacilitiesArray(facilities);
      }
    },
      error => {
        console.log("error: ", { error });
      });
  }

  onClick() {
    this.router.navigateByUrl('education/order-tour/squad-assemble');
  }
}