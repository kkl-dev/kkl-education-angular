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
    let tripId = 0;
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
    let orderId = null;
    let orderItemIdentity = null;

    for (let i = 0; i < arr.length; i++) {
      tripActivityIdentity = arr[i].tripActivityIdentity || null;
      orderTempId = arr[i].orderTempId || 0;
      orderId = arr[i].orderId || null;
      orderItemIdentity = arr[i].orderItemIdentity || null;
      try {
        tripId = arr[i].tripId;
      } catch (error) {

      }
      if (!tripId) {
        tripId = this.squadAssembleService.tripInfofromService.trip.id;
      }
      //console.log('arr ' + i + ': ', arr[i]);
      //check if valid start
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
    return newTempOrderObj;
  }

  convertActivityListforTripCalendar(activityList: any) {
    //fix if date is from 1900
    if (activityList.fromHour.includes("1900") || activityList.date.includes("1900")) {
      activityList.date = activityList.tillHour;
      activityList.fromHour = activityList.tillHour;

      let [date, time] = activityList.fromHour.split('T');
      let fromHour = date + 'T07:00:00';

      let [date2, time2] = activityList.tillHour.split('T');
      let tillHour = date2 + 'T08:00:00';
      activityList.fromHour = fromHour;
      activityList.tillHour = tillHour;
    }
    let newActivityListObj = {
      activityId: activityList.activityId || null,
      tripActivityIdentity: activityList.tripActivityIdentity || null,
      tripId: activityList.tripId || null,
      backgroundColor: "#f0f9f1",
      className: "border-activities",
      date: activityList.date,
      end: activityList.tillHour,
      facilityId: activityList.itemId || null,
      selectedDay: 0,
      start: activityList.fromHour,
      svgUrl: "assets/images/defaultFacility.svg",
      title: activityList.activityName || null,
      type: "activity"
    };
    return newActivityListObj;
  }
}