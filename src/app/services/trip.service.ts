import { Injectable } from '@angular/core';
import { FieldForestCenter } from 'src/app/open-api/model/models';
import { BehaviorSubject } from 'rxjs';
import { FakeService } from 'src/app/services/fake.service';




@Injectable({
  providedIn: 'root'
})
export class TripService {

  constructor(public fakeApi: FakeService) { }

  centerField: FieldForestCenter | undefined; // id 
  dateObj: any;
  sleepingDates: any;

  //  forestCenters: any = {};

  //need to add array of object for available dates
  //need to add array of object for available accomedations of chosen dates

  public centerFieldObj = new BehaviorSubject<any>({
    "id": 101,
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

  public sleepingDatesObj = new BehaviorSubject<any>([
    {
      "date": "2021-09-01T00:00:00",
      "availableBedsTent": 20,
      "availableBedsCabin": 10,
      "availableBedsCamping": 100,
      "availableBedsRoom": 3
    },
    {
      "date": "2021-09-02T00:00:00",
      "availableBedsTent": 10,
      "availableBedsCabin": 4,
      "availableBedsCamping": 80,
      "availableBedsRoom": 2
    },
    {
      "date": "2021-09-03T00:00:00",
      "availableBedsTent": 5,
      "availableBedsCabin": 2,
      "availableBedsCamping": 40,
      "availableBedsRoom": 5
    },
    {
      "date": "2021-09-04T00:00:00",
      "availableBedsTent": 4,
      "availableBedsCabin": 5,
      "availableBedsCamping": 200,
      "availableBedsRoom": 7
    }

  ]);

  forestCenter = this.centerFieldObj.asObservable();
  AvailableSleepingOptions = this.AvailableSleepingOptionsByDay.asObservable();


  updateForestCenter(forestCenter: any) {
    this.centerFieldObj.next(forestCenter);

    this.sleepingDatesValues.forestCenter = forestCenter.name;
  }

  // updateAvailableSleepingOptionsObj(dates: any) {
  //   this.sleepingDatesObj.next(dates);
  // }

  updateSleepingDates(dates: any) {
    this.sleepingDates = dates;
    this.getAvailableSleepingOptions(dates)
  }

  getAvailableSleepingOptions(dates: string) {    
    this.fakeApi.getAvailableSleepingOptionsByDay(dates).subscribe((sleepingAvailability) => {
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
  }

}