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
      tripId = this.squadAssembleService.tripInfofromService.trip.id;
    } catch (error) {
      console.log(error);
    }
    let calendar = {} as TripCalendar;
    let tempOrderArr = [];
    let activityArr = [];
    let tempOrder;
    let activity;
    let tripActivityIdentity = 0;
    let orderTempId = 0;
    let orderId = 0;
    let orderItemIdentity = 0;

    for (let i = 0; i < arr.length; i++) {
      tripActivityIdentity = arr[i].tripActivityIdentity || 0;
      orderTempId = arr[i].orderTempId || 0;
      orderId = arr[i].orderId || 0;
      orderItemIdentity = arr[i].orderItemIdentity || 0;
      try {
        tripId = arr[i].tripId;
      } catch (error) {
        
      }
      if (!tripId) {
        tripId = this.squadAssembleService.tripInfofromService.trip.id;
      }
      console.log('arr ' + i + ': ', arr[i]);
      //check
      if (arr[i].start != undefined && arr[i].start.includes("T")) {

        let orderTypeCode = 4;
        let orderTypeName = '';
        // if (arr[i].type == "facility") {
        //check if goes into tempOrderArr
        // if (arr[i].svgUrl && !arr[i].additions) {
        if (arr[i].facilityId || arr[i].itemId || arr[i].type == "facility") {
          orderTypeName = arr[i].title;
          orderTypeCode = arr[i].orderTypeCode;
          orderTypeName = arr[i].orderTypeName;

          if (arr[i].facilityId) {
            orderTypeCode = 7;
            orderTypeName = 'אירוח/פעילות';
          }
          tempOrder = {
            "orderTempId": arr[i].orderTempId || 0,
            "orderId": arr[i].orderId,
            "orderItemIdentity": arr[i].orderItemIdentity,
            "tripId": tripId,
            "orderTypeCode": orderTypeCode,
            "orderTypeName": orderTypeName,
            "itemId": arr[i].facilityId || arr[i].itemId,
            "startDate": arr[i].start,
            "endDate": arr[i].end,
            "fromHour": arr[i].start,
            "tillHour": arr[i].end
          }
          tempOrderArr.push(tempOrder);
        }
        else {
          activity = {
            "tripActivityIdentity": arr[i].tripActivityIdentity || null,
            "activityId": arr[i].activityId || null,
            "activityName": arr[i].title || '',
            "date": arr[i].start,
            "description": arr[i].description || arr[i].title,
            "fromHour": arr[i].start,
            "tillHour": arr[i].end,
            "tripId": tripId
          }
          activityArr.push(activity);
        }
        if (arr[i].additions) {
          for (let j = 0; j < arr[i].additions.length; j++) {
            switch (arr[i].additions[j].name) {
              case "הסעה":
                orderTypeCode = 1
                orderTypeName = 'היסעים',
                  arr[i].itemId = null
                break;
              case "הדרכה":
                orderTypeCode = 6
                orderTypeName = 'הדרכה'
                arr[i].itemId = null
                break;
              case "כלכלה":
                orderTypeCode = 4
                orderTypeName = 'כלכלה'
                arr[i].itemId = null
                break;
              default:
                orderTypeCode = 0
                orderTypeName = 'לא ידוע'
                arr[i].itemId = null
                break;
            }
            tempOrder = {
              "orderTempId": orderTempId || 0,
              "orderId": orderId,
              "orderItemIdentity": orderItemIdentity,
              "tripId": tripId,
              "orderTypeCode": orderTypeCode,
              "orderTypeName": orderTypeName,
              "itemId": arr[i].itemId,
              "startDate": arr[i].start,
              "endDate": arr[i].end,
              "fromHour": arr[i].start,
              "tillHour": arr[i].end
            }
            tempOrderArr.push(tempOrder);
          }
        }
      }
    }
    calendar.tripId = tripId;
    calendar.tempOrderList = tempOrderArr;
    calendar.activityList = activityArr;
    return calendar;
  }

  convertTempOrderListforTripCalendar(tempOrderList: any) {
    let newTempOrderObj = {
      // tripActivityIdentity: tempOrderList.tripActivityIdentity,
      tripId: tempOrderList.tripId,
      orderTypeCode: tempOrderList.orderTypeCode,
      orderTypeName: tempOrderList.orderTypeName,
      orderTempId: tempOrderList.orderTempId,
      orderId: tempOrderList.orderId,
      orderItemIdentity: tempOrderList.orderItemIdentity,
      availability: [],
      backgroundColor: "#F0F6FE",
      className: "border-facilities",
      date: "",
      end: tempOrderList.tillHour,
      facilityId: tempOrderList.itemId || null,
      selectedDay: 0,
      start: tempOrderList.fromHour,
      svgUrl: "assets/images/defaultFacility.svg",
      title: tempOrderList.orderTypeName || tempOrderList.activityName || null,
      type: "facility"
    };

    // for (let i = 0; i < arr.length; i++) {
    //   console.log(arr[i]);
    //   if (arr[i].svgUrl && !arr[i]) {
    //     tempOrder = {
    //       availability: [],
    //       backgroundColor: "#F0F6FE",
    //       className: "border-facilities",
    //       date: "",
    //       end: arr[i].tillHour,
    //       facilityId: 1825,
    //       selectedDay: 0,
    //       start: arr[i].fromHour,
    //       svgUrl: "assets/images/de",
    //       title: "מתחם הפרגולה(עד 100 משתתפים)",
    //       type: "facility"
    //     }
    //     tempOrderArr.push(tempOrder);
    //   }
    //   else {
    //     activity = {
    //       "activityId": arr[i].activityId,
    //       "activityName": arr[i].title,
    //       "date": arr[i].start,
    //       "description": arr[i].description || '',
    //       "fromHour": arr[i].start,
    //       "tillHour": arr[i].end,
    //       "tripId": tripId,
    //       "userName": userName
    //     }
    //     activityArr.push(activity);
    //   }
    //   if (arr[i].additions) {
    //   }
    // }
    return newTempOrderObj;
  }

  convertActivityListforTripCalendar(activityList: any) {
    if(activityList.fromHour.includes("1900") || activityList.date.includes("1900")) {
      activityList.date = activityList.tillHour;
      activityList.date = activityList.tillHour;
      activityList.date = activityList.tillHour;
    } 
    let newActivityListObj = {
      activityId: activityList.activityId,
      tripActivityIdentity: activityList.tripActivityIdentity,
      tripId: activityList.tripId,
      //availability: [],
      backgroundColor: "#f0f9f1",
      className: "border-activities",
      date: activityList.date,
      end: activityList.tillHour,
      facilityId: activityList.itemId || null,
      selectedDay: 0,
      start: activityList.fromHour,
      svgUrl: "assets/images/defaultFacility.svg",
      title: activityList.activityName,
      type: "activity"
    };
    return newActivityListObj;
  }
}