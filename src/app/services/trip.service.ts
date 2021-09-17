import { Injectable } from '@angular/core';
import { FieldForestCenter } from 'src/app/open-api/model/models';
import { BehaviorSubject } from 'rxjs';
<<<<<<< HEAD
import { UserService } from 'src/app/open-api/api/user.service';
import { TripInfo } from '../open-api';

=======
import { FakeService } from 'src/app/services/fake.service';
import { UserService } from '../open-api/api/user.service';
import { FreeSpace } from 'comrax-alex-airbnb-calendar';
>>>>>>> origin/yakovs-branch

@Injectable({
  providedIn: 'root'
})
export class TripService {

  constructor(public fakeApi: FakeService, public userService: UserService) { }

  //  forestCenters: any = {};

  centerField: FieldForestCenter = {
    id: 0,
    name: ''
  };
  sleepingDates: { from: string; till: string } = { from: '', till: '' };
  freeSpacesArray: FreeSpace[];
  dateRange: any;
  formOptions!: FieldForestCenter[];
  tripInfo: TripInfo
  public centerFieldObj = new BehaviorSubject<any>({
    "id": 1,
    "name": "נס הרים",
    "iconPath": "assets/images/userImage.jpg",
    "acommodationList": [
      {
        "id": 20,
        "name": "בקתה",
        "maxOccupancy": 50,
        "totalUnits": 30,
        "img": "..href",
        "nameEng": "something"
      },
      {
        "id": 21,
        "name": "חדר",
        "maxOccupancy": 10,
        "totalUnits": 20,
        "img": "..href",
        "nameEng": "something"
      }
    ],
    "linkSite": "http://"
  });

  // sleepingDates: any = {
  //   from: '2021-07-01',
  //   till: '2021-07-13'
  // };

  public AvailableSleepingOptionsByDay = new BehaviorSubject<any>([
    {
      "date": "2021-09-03T00:00:00",
      "AvailableLodgingList": [
        {
          "accomodationTypeId": 1,
          "acoomodationTypeName": "בקתה",
          "maxOccupancy": 20,
          "availableUnits": 10,
          "nameEng": "cabin",
          "img": "/assets/images/cabin.svg"
        },
        {
          "accomodationTypeId": 1,
          "acoomodationTypeName": "אוהל",
          "maxOccupancy": 20,
          "availableUnits": 10,
          "nameEng": "cabin",
          "img": "/assets/images/cabin.svg"
        },
        {
          "accomodationTypeId": 1,
          "acoomodationTypeName": "גיחה",
          "maxOccupancy": 20,
          "availableUnits": 10,
          "nameEng": "cabin",
          "img": "/assets/images/cabin.svg"
        }
      ]
    }
  ]);

  forestCenter = this.centerFieldObj.asObservable();
  AvailableSleepingOptions = this.AvailableSleepingOptionsByDay.asObservable();

  setFreeSpacesArray(freeSpacesArray: any) {
    this.freeSpacesArray = freeSpacesArray;
  }

  updateForestCenter(forestCenter: any) {
    this.centerFieldObj.next(forestCenter);
  }

  // updateSleepingDates() {
  //   this.getAvailableSleepingOptions()
  // }

  convertDatesFromSlashToMinus() {
    //for replacing the dash of dates to minus
    let from = this.sleepingDates.from.replace(/\//g, '-');
    let till = this.sleepingDates.till.replace(/\//g, '-');
    let sleepingDateObj = {
      from: from,
      till: till
    }
    return sleepingDateObj;
  }

  getAvailableSleepingOptions() {
    // this.convertDatesFromSlashToMinus() 
    let from = this.sleepingDates.from.replace(/\//g, '-');
    let till = this.sleepingDates.till.replace(/\//g, '-');

    console.log('this.centerFieldObj.value.id, from, till' + this.centerFieldObj.value.id, from, till)
    this.userService.getAvailableSleepingOptionsByDates(this.centerFieldObj.value.id, from, till).subscribe((sleepingAvailability: any) => {
      console.log('sleepingAvailability ==>', { sleepingAvailability });
      if (sleepingAvailability) {
        this.AvailableSleepingOptionsByDay.next(sleepingAvailability);
      }
    },
      error => {
        console.log({ error });
      });
  }

  getLookupFieldForestCenters() {
    this.userService.getLookupFieldForestCenters().subscribe(
      response => {
        console.log(response)
        this.formOptions = response;
      },
      error => console.log(error),       // error
      () => console.log('completed')     // complete
    )
  }
}