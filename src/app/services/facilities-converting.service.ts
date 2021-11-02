import { Injectable } from '@angular/core';
import { TripCalendar } from '../open-api';
import { FacilityModel } from '../screens/order-tour/facilities/models/facility.model';
import { SquadAssembleService } from '../screens/order-tour/squad-assemble/services/squad-assemble.service';

@Injectable({
  providedIn: 'root'
})
export class FacilitiesConvertingService {

  constructor(private squadAssembleService: SquadAssembleService) { }
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

  convertActivityForApi(arr: any, userName: string) {
    let tripId = 52896;
    try {
      tripId = this.squadAssembleService.tripInfofromService.trip.id || 52896;
    } catch (error) {
      console.log(error);
    }
    let calendar = {} as TripCalendar;
    let tempOrderArr = [];
    let activityArr = [];
    let tempOrder;
    let activity;

    for (let i = 0; i < arr.length; i++) {
      console.log(arr[i]);
      let orderTypeCode = 4;
      let orderTypeName = ''
      // if (arr[i].type == "facility") {
      //check if goes into tempOrderArr
      if (arr[i].svgUrl && !arr[i].additions) {

        if (arr[i].facilityId) {
          orderTypeCode = 7;
          orderTypeName = 'אירוח/פעילות';
        }
        tempOrder = {
          "tripId": tripId,
          "orderTypeCode": orderTypeCode,
          "orderTypeName": orderTypeName,
          "itemId": arr[i].facilityId || null,
          "startDate": arr[i].start,
          "endDate": arr[i].end,
          "fromHour": arr[i].start,
          "tillHour": arr[i].end,
          "userName": userName
        }
        tempOrderArr.push(tempOrder);
      }
      else {
        activity = {
          "activityId": arr[i].activityId,
          "activityName": arr[i].title,
          "date": arr[i].start,
          "description": arr[i].description || '',
          "fromHour": arr[i].start,
          "tillHour": arr[i].end,
          "tripId": tripId,
          "userName": userName
        }
        activityArr.push(activity);
      }
      if (arr[i].additions) {
        for (let j = 0; i < arr[i].additions.length; j++) {

          switch (arr[i].additions[j].name) {
            case "הסעה":
              orderTypeCode = 1
              orderTypeName = 'היסעים'
              break;
            case "הדרכה":
              orderTypeCode = 6
              orderTypeName = 'הדרכה'
              break;
            case "כלכלה":
              orderTypeCode = 4
              orderTypeName = 'היסעים'
              break;

            default:
              orderTypeCode = 0
              orderTypeName = 'לא ידוע'
              break;
          }

          tempOrder = {
            "tripId": tripId,
            "orderTypeCode": orderTypeCode,
            "orderTypeName": orderTypeName,
            //"itemId": null,
            "startDate": arr[i].start,
            "endDate": arr[i].end,
            "fromHour": arr[i].start,
            "tillHour": arr[i].end,
            "userName": userName
          }
          tempOrderArr.push(tempOrder);
        }
      }
    }

    // if (arr[i].title == 'התייצבות') {
    //   tempOrder = {
    //     "tripId": this.squadAssembleService.tripInfofromService.trip.id,
    //     "orderTypeCode": 1,
    //     "orderTypeName": "היסעים",
    //     "itemId": arr[i].id || null,
    //     "startDate": arr[i].start,
    //     "endDate": arr[i].end,
    //     "fromHour": arr[i].start,
    //     "tillHour": arr[i].end,
    //     "userName": "גל שחר"
    //   }
    //   tempOrderArr.push(tempOrder);
    // }
    // if (arr[i].title == 'ארוחת בוקר' || arr[i].title == 'ארוחת צהרים' || arr[i].title == 'ארוחת ערב') {
    //   tempOrder = {
    //     "tripId": this.squadAssembleService.tripInfofromService.trip.id,
    //     "orderTypeCode": 4,
    //     "orderTypeName": "כלכלה",
    //     // "itemId": arr[i].id || null,
    //     "startDate": arr[i].start,
    //     "endDate": arr[i].end,
    //     "fromHour": arr[i].start,
    //     "tillHour": arr[i].end,
    //     "userName": "גל שחר"
    //   }
    //   tempOrderArr.push(tempOrder);
    // }

    //   activity = {
    //     "activityId": arr[i].activityId,
    //     "activityName": arr[i].title,
    //     "date": "2021-11-12T00:00:00",
    //     "description": "students education",
    //     "fromHour": arr[i].start,
    //     "tillHour": arr[i].end,
    //     "tripId": tripId,
    //     "userName": "גל שחר"
    //   }
    //   activityArr.push(activity);
    // }
    calendar.tripId = tripId;
    calendar.tempOrderList = tempOrderArr;
    calendar.activityList = activityArr;
    return calendar;
  }
}