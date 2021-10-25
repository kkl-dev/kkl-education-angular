import { Injectable } from '@angular/core';
import { FacilityModel } from '../screens/order-tour/facilities/models/facility.model';

@Injectable({
  providedIn: 'root'
})
export class FacilitiesConvertingService {
  // public days: any[] = [];
  // public facilities: FacilityModel[] = [
  //   {
  //     date: "2021-10-24",
  //     facilitiesList: [
  //       {
  //         id: 8,
  //         name: 'כיתה גדולה',
  //         maxOccupancy: 40,
  //         iconPath: 'assets/images/museum.svg',
  //         occupiedHours: [
  //           {
  //             fromHour: '13:00',
  //             tillHour: '15:00',
  //             totalTime: 1.25,
  //             customerName: 'סימינר הקיבוצים'
  //           },
  //           {
  //             fromHour: '18:00',
  //             tillHour: '20:00',
  //             totalTime: 1.25,
  //             customerName: 'סימינר הקיבוצים'
  //           }
  //         ]
  //       }
  //     ]
  //   },
  //   {
  //     date: "2021-10-25",
  //     facilitiesList: [
  //       {
  //         id: 8,
  //         name: 'כיתה גדולה',
  //         maxOccupancy: 40,
  //         iconPath: 'assets/images/museum.svg',
  //         occupiedHours: [
  //           {
  //             fromHour: '13:00',
  //             tillHour: '15:00',
  //             totalTime: 1.25,
  //             customerName: 'סימינר הקיבוצים'
  //           }
  //         ]
  //       }
  //     ]
  //   }
  // ];
  public tripActivities = [
    {
      "activityId": 1,
      "name": "education",
      "sitePicture": "http://",
      "linkToDetails": "http://",
      "description": "",
      "categoryId": 1,
      "regionId": 3
    }

  ]
  constructor() { }

  public getFacilitiesDays(arr: any[]): any[] {
    const datesArr: any[] = [];
    arr.map(item => datesArr.push(item.date));
    return datesArr;
  }

  public convertFacilityNactivity(arrToConvert: any[]): any[] {
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
  //   {
  //     "activityId": 1,
  //     "name": "education",
  //     "sitePicture": "http://",
  //     "linkToDetails": "http://",
  //     "description": "",
  //     "categoryId": 1,
  //     "regionId": 3
  // }
  // { img: "assets/images/img-1.png", title: "ניווט יערני במחנה", content: "על הפעילות הסבר על הפעילות הסבר על הפעילות הסבר על הפעילות", hours: 1.5 },

  public convertTripActivities(arr: any[]) {
    let tmpArr: any[] = [];
    this.tripActivities.map(obj => {
      console.log(obj);
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

}
