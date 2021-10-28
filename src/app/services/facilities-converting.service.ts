import { Injectable } from '@angular/core';
import { TripCalendar } from '../open-api';
import { FacilityModel } from '../screens/order-tour/facilities/models/facility.model';

@Injectable({
  providedIn: 'root'
})
export class FacilitiesConvertingService {

  constructor() { }

  public getFacilitiesDays(arr: any[]): any[] {
    console.log('getFacilitiesDays');
    const datesArr: any[] = [];
    arr.map(item => datesArr.push(item.date));
    return datesArr;
  }

  public convertFacilityActivity(arrToConvert: any[]): any[] {
    const arr = [];
    arrToConvert.map(item => {
      item.facilitiesList.map(obj => {
        const { id, name, maxOccupancy, iconPath, occupiedHours } = obj;
        const newObj = {
          id: id,
          svgUrl: iconPath,
          title: name,
          maxParticipants: maxOccupancy,
          availability: [
            occupiedHours.map(obj => {
              return {
                startingHour: obj['fromHour'],
                endingHour: obj['tillHour'],
                totalTime: obj['totalTime'],
                user: obj['customerName']
              };

            })
          ]
        };
        arr.push(newObj);
      });
    });
    return arr;
  }

  public convertTripActivities(arr: any[]) {
    let tmpArr: any[] = [];
    arr.map(obj => {
      //console.log(obj);
      const newObj = {
        activityId: obj.activityId,
        img: obj.sitePicture,
        title: obj.name,
        content: obj.description,
        categoryId: obj.categoryId,
        regionId: obj.regionId
      }
      tmpArr.push(newObj);
    });
    return tmpArr;
  }

  convertActivityForApi(arr: any[]) {
    let calendar= {} as TripCalendar;
   
    
    let tmpArr: any = [];
    arr.map(obj => {
      //console.log(obj);
      const newObj =   {
        "tripId": 52896,
        "tempOrderList": [
          {
            "tripId": 52896,
            "orderTypeCode": 1,
            "orderTypeName": "היסעים",
            "startDate": obj.start,
            "endDate": obj.end,
            "fromHour": obj.start,
            "tillHour": obj.end,
            "userName": "גל שחר"
          }
        ],
        "activityList": [
          {
            "activityId": 118,
            "activityName": obj.title,
            "date": "2021-11-12T00:00:00",
            "description": "students education",	
            "fromHour": obj.start,	
            "tillHour":  obj.end,
            "tripId": 52896,
            "userName": "גל שחר"
          }
        ]
      }
      tmpArr.push(newObj);
    });

    var q = Object.assign({}, tmpArr)
    console.log("q: " + q)
    return tmpArr;
  }


//   0:
// additions: Array(5)
// 0: {name: 'הסעה', completed: false}
// 1: {name: 'אבטחה', completed: false}
// 2: {name: 'הדרכה', completed: false}
// 3: {name: 'כלכלה', completed: false}
// 4: {name: 'הפעלה מוסיקלית', completed: false}
// length: 5
// [[Prototype]]: Array(0)
// backgroundColor: "#F0F6FE"
// className: "border-facilities"
// date: ""
// editable: true
// end: "2021-11-01T09:00"
// haveAdditions: true
// id: "0"
// img: null
// invitingCustomer: false
// selectedDay: 0
// start: "2021-11-01T08:00"
// svgUrl: null
// textColor: "black"
// title: "נחל חרמון, בניאס: מים ונחלים בגליל העליון"
// type: "activity"


//   {
//   "tripId": 52896,
//   "tempOrderList": [
//     {
//       "tripId": 52896,
//       "orderTypeCode": 1,
//       "orderTypeName": "היסעים",
//       "startDate": "2021-11-12T00:00:00",
//       "endDate": "2021-11-12T00:00:00",
//       "fromHour": "2021-11-12T13:00:00",
//       "tillHour": "2021-11-12T15:00:00",
//       "userName": "גל שחר"
//     }
//   ],
//   "activityList": [
//     {
//       "activityId": 118,
//       "activityName": "ישעיהו גבעת",
//       "date": "2021-11-12T00:00:00",
//  "description": "students education",	
//       "fromHour": "2021-11-12T10:00:00",	
//       "tillHour": "2021-11-12T12:00:00",
//       "tripId": 52896,
//       "userName": "גל שחר"
//     }
//   ]
// }

}
