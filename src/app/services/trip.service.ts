import { Injectable } from '@angular/core';
import { FieldForestCenter } from 'src/app/open-api/model/models';
import { BehaviorSubject } from 'rxjs';
import { FakeService } from 'src/app/services/fake.service';
import { UserService } from '../open-api/api/user.service';

@Injectable({
  providedIn: 'root'
})
export class TripService {

  constructor(public fakeApi: FakeService, public userService: UserService) { }

  // dateObj: any = {
  //   from: '2021-07-01T00:00:00',
  //   till: '2021-07-13T00:00:00'
  // };

  //  forestCenters: any = {};

  //need to add array of object for available dates
  //need to add array of object for available accomedations of chosen dates

  centerField: FieldForestCenter={
    id: 0,
    name: ''
  };
  dateObj: any;
  dateRange: any;
  formOptions!: FieldForestCenter[];
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

  sleepingDates: any = {
    from: '2021-07-01',
    till: '2021-07-13'
  };
 

  sleepingDatesValues: {
    calendarInput: string;
    forestCenter: string;
    acommodationList: {};

    //claendar input value for development in real app it will redirect to search page if calendar input wasnt set in the search page
  } = {
      calendarInput: '09/01/2021-09/04/2021', forestCenter: '', acommodationList: [
        {
          id: 20,
          name: "בקתה",
          maxOccupancy: 40,
          // totalUnits: 40,
          img: "..href",
          nameEng: "something"
        }
      ]
    };

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
      },
      {
        "date": "2021-09-04T00:00:00",
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
            "maxOccupancy": 100,
            "availableUnits": 144,
            "nameEng": "cabin",
            "img": "assets/images/tent.svg"
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

  updateForestCenter(forestCenter: any) {
    this.centerFieldObj.next(forestCenter);

    this.sleepingDatesValues.forestCenter = forestCenter.name;
  }

  updateSleepingDates(dates: any) {
    this.getAvailableSleepingOptions(dates)
  }

  getAvailableSleepingOptions(dates: string) {   
    this.userService.getAvailableSleepingOptionsByDates(this.centerFieldObj.value.id, this.sleepingDates.from, this.sleepingDates.till).subscribe((sleepingAvailability: any) => {
      if (sleepingAvailability) {
            console.log('sleepingAvailability ==>', { sleepingAvailability });
            
            this.AvailableSleepingOptionsByDay.next(sleepingAvailability);
    
          } else {
            console.log('no data in sleepingAvailability');
      }
    },
      error => {
        console.log({ error });
      }); 
    // this.fakeApi.getAvailableSleepingOptionsByDay(dates).subscribe((sleepingAvailability) => {
    //   if (sleepingAvailability) {
    //     console.log('sleepingAvailability ==>', { sleepingAvailability });
        
    //     this.AvailableSleepingOptionsByDay.next(sleepingAvailability);

    //   } else {
    //     console.log('no data in sleepingAvailability');
    //   }
    // },
    //   error => {
    //     console.log({ error });
    //   });

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


     