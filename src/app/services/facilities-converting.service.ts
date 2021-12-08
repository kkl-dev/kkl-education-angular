import { Injectable } from '@angular/core';
import { TripCalendar } from '../open-api';
import { FacilityModel } from '../screens/order-tour/facilities/models/facility.model';
import { SquadAssembleService } from '../screens/order-tour/squad-assemble/services/squad-assemble.service';
 import { FacilitiesComponent } from '../screens/order-tour/facilities/facilities.component';
@Injectable({
  providedIn: 'root'
})
export class FacilitiesConvertingService {

  constructor(private squadAssembleService: SquadAssembleService) { }

  //not in use
  getFacilitiesDays(arr: any[]): any[] {
    console.log('getFacilitiesDays');
    const datesArr: any[] = [];
    arr.map(item => datesArr.push(item.date));
    return datesArr;
  }

  convertFacilityActivity(arrToConvert: any[]): any[] {
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
  //END not in use 

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

  convertActivityForApi(arr: any) {
    let tripId = 0;
    //fix for temp
    tripId = 57256;
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
    let tempOrderId = 0;
    let orderId = null;
    let orderItemIdentity = null;
    let hasAdditions: boolean = false;
    let GUID: string = '';

    for (let i = 0; i < arr.length; i++) {
      tripActivityIdentity = arr[i].tripActivityIdentity || null;
      tempOrderId = arr[i].tempOrderId || 0;
      orderId = arr[i].orderId || null;
      orderItemIdentity = arr[i].orderItemIdentity || null;
      try {
        tripId = arr[i].tripId;
      } catch (error) {

      }
      if (!tripId) {
        try {
          tripId = this.squadAssembleService.tripInfofromService.trip.id;
        } catch (error) {
  
        }
      }
      //console.log('arr ' + i + ': ', arr[i]);
      //check if valid start
      if (arr[i].start != undefined && arr[i].start.includes("T")) {

        let orderTypeCode = 4;
        let orderTypeName = 'כלכלה';
        // if (arr[i].type == "facility") {
        //check if goes into tempOrderArr
        // if (arr[i].svgUrl && !arr[i].additions) {
        if (arr[i].additions) {
          hasAdditions = true;
          //GUID = this.generateUUID();
          for (let j = 0; j < arr[i].additions.length; j++) {
            switch (arr[i].additions[j].name) {
              case "הסעה":
                orderTypeCode = 1
                orderTypeName = 'היסעים'
                //arr[i].itemId = null
                break;
              case "הדרכה":
                orderTypeCode = 6
                orderTypeName = 'הדרכה'
                //arr[i].itemId = null
                break;
              case "כלכלה":
                orderTypeCode = 4
                orderTypeName = 'כלכלה'
                //arr[i].itemId = null
                break;
              default:
                orderTypeCode = 0
                orderTypeName = 'לא ידוע'
                //arr[i].itemId = null
                break;
            }
            tempOrder = {
              "tempOrderId": tempOrderId || 0,
              "orderId": orderId,
              "orderItemIdentity": orderItemIdentity,
              "tripId": tripId,
              "orderTypeCode": orderTypeCode,
              "orderTypeName": orderTypeName,
              // "orderItemName": arr[i].title, // not meant to send orderItemName 
              //"itemId": arr[i].itemId,
              "orderItemName": '',
              "itemId": null,
              //
              "startDate": arr[i].start,
              "endDate": arr[i].end,
              "fromHour": arr[i].start,
              "tillHour": arr[i].end
            }
            tempOrderArr.push(tempOrder);
          }
        }
        else hasAdditions = false;
        if (arr[i].facilityId || arr[i].itemId) {
          // if (arr[i].facilityId || arr[i].type == "facility") {

          // orderTypeCode = arr[i].orderTypeCode;
          // orderTypeName = arr[i].orderTypeName;

          if (arr[i].facilityId) {
            orderTypeCode = 7;
            orderTypeName = 'אירוח/פעילות';
          }
          tempOrder = {
            "tempOrderId": arr[i].tempOrderId || 0,
            "orderId": arr[i].orderId,
            "orderItemIdentity": arr[i].orderItemIdentity,
            "tripId": tripId,
            "orderTypeCode": orderTypeCode,
            "orderTypeName": orderTypeName,
            //"orderItemName": arr[i].title,
            "orderItemName": arr[i].orderItemName,
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
            //"activityName": arr[i].title || '',
            "activityName": arr[i].activityName || '',
            "date": arr[i].date || arr[i].start,
            "description": arr[i].description || arr[i].title,
            "fromHour": arr[i].start,
            "tillHour": arr[i].end,
            "tripId": tripId
          }
          activityArr.push(activity);
        }

      }
    }
    calendar.tripId = tripId;
    calendar.tempOrderList = tempOrderArr;
    calendar.activityList = activityArr;
    return calendar;
  }

  generateUUID() {
    let d = new Date().getTime();//Timestamp
    let d2 = (performance && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      let r = Math.random() * 16;//random number between 0 and 16
      if (d > 0) {//Use timestamp until depleted
        r = (d + r) % 16 | 0;
        d = Math.floor(d / 16);
      } else {//Use microseconds since page-load if supported
        r = (d2 + r) % 16 | 0;
        d2 = Math.floor(d2 / 16);
      }
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  convertTempOrderListfromTripCalendarApi(tempOrderList: any) {
    let newTempOrderObj = {
      // tripActivityIdentity: tempOrderList.tripActivityIdentity,
      tripId: tempOrderList.tripId,
      orderTypeCode: tempOrderList.orderTypeCode,
      orderTypeName: tempOrderList.orderTypeName,
      tempOrderId: tempOrderList.tempOrderId,
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
      // svgUrl: "assets/images/defaultFacility.svg",
      svgUrl: "defaultFacility.svg",
      title: tempOrderList.orderItemName || '',
      //adding more from what came from api
      itemId: tempOrderList.itemId || null,
      itemName: tempOrderList.orderItemName || null,
      type: "facility",
      endDate: tempOrderList.endDate,
      startDate: tempOrderList.startDate
    };

    return newTempOrderObj;
  }
  //old
  // convertActivityListfromTripCalendarApi(activityList: any) {
  //   //fix if date is from 1900
  //   if (activityList.fromHour.includes("1900") || activityList.tillHour.includes("1900")) {
  //     let [date] = activityList.date.split('T');
  //     let [d, from] = activityList.fromHour.split('T');
  //     let till = activityList.tillHour.split('T');
  //     activityList.fromHour = `${date}T${from}`;
  //     activityList.tillHour = `${date}T${till[1]}`;

  //     activityList.fromHour = this.arrangeTime(activityList.fromHour);
  //     activityList.tillHour = this.arrangeTime(activityList.tillHour);

  //   }

  //   //   if (activityList.fromHour.includes("1900")) {
  //   //     let [d] = activityList.date.split('T');
  //   //     let [, t] = activityList.fromHour.split('T');
  //   //     activityList.tillHour = `${d}T${t}`


  //   //   activityList.fromHour = activityList.tillHour;

  //   //   let [date, time] = activityList.fromHour.split('T');
  //   //   let fromHour = date + 'T07:00:00';

  //   //   let [date2, time2] = activityList.tillHour.split('T');
  //   //   let tillHour = date2 + 'T08:00:00';
  //   //   activityList.fromHour = fromHour;
  //   //   activityList.tillHour = tillHour;
  //   // }

  //   let newActivityListObj = {
  //     activityId: activityList.activityId || null,
  //     tripActivityIdentity: activityList.tripActivityIdentity || null,
  //     tripId: activityList.tripId || null,
  //     backgroundColor: "#f0f9f1",
  //     className: "border-activities",
  //     date: activityList.date,
  //     end: activityList.tillHour,
  //     facilityId: activityList.itemId || null,
  //     selectedDay: 0,
  //     start: activityList.fromHour,
  //     // svgUrl: "assets/images/defaultFacility.svg",
  //     svgUrl: "defaultFacility.svg",
  //     title: activityList.activityName || null,
  //     //ItemName: activityList.activityName || null,
  //     type: "activity"
  //   };
  //   return newActivityListObj;
  // }

  //new from internal yakov
  convertActivityListfromTripCalendarApi(activityList: any, tempOrderList) {
    let newActivityListObj = {};
    let hasAdditions: boolean = false;
    //fix if date is from 1900
    if (activityList.fromHour.includes("1900") || activityList.tillHour.includes("1900")) {
      let [date] = activityList.date.split('T');
      let [d, from] = activityList.fromHour.split('T');
      let till = activityList.tillHour.split('T');
      activityList.fromHour = `${date}T${from}`;
      activityList.tillHour = `${date}T${till[1]}`;
      activityList.fromHour = this.arrangeTime(activityList.fromHour);
      activityList.tillHour = this.arrangeTime(activityList.tillHour);
    }
    if (activityList.additions) { //check if has additions for orders in activities
      hasAdditions = true;
      //let tempOrderList;
      //let tempOrderList = this.facilities.tempOrderList;

      tempOrderList.forEach(element => {
        if (element.tripActivityIdentity === activityList.tripActivityIdentity) {
          //has the same tripActivityIdentity -- must build an obj with additions
          newActivityListObj = {
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
            svgUrl: "defaultFacility.svg",
            title: activityList.activityName || null,
            activityName: activityList.activityName || null,
            //ItemName: activityList.activityName || null,
            type: "activity",
            additions: {
              "tempOrderId": 900,
              "tripId": activityList.tripId,
              "orderTypeCode": 4,
              "orderTypeName": "כלכלה",
              "orderId": null,
              "orderItemIdentity": null,
              "itemId": null,
              "orderItemName": "",
              "startDate": activityList.startDate,
              "endDate": activityList.endDate,
              "fromHour": activityList.fromHour,
              "tillHour": activityList.tillHour,
              "activityList": activityList.tripActivityIdentity
            }
          };
        }
        
      });
      // for (let i = 0; i < tempOrderList.length; i++) {
      //   console.log('temp Order List. ' + i + ": ", tempOrderList[i]);
      //   //newTempActivityList = this.facilitiesConvertingService.convertActivityListfromTripCalendarApi(this.activityList[i]);
      // }
    }
    else {      
    newActivityListObj = {
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
      // svgUrl: "assets/images/defaultFacility.svg",
      svgUrl: "defaultFacility.svg",
      title: activityList.activityName || null,
      activityName: activityList.activityName || null,
      //ItemName: activityList.activityName || null,
      type: "activity"
    };
    }
    return newActivityListObj;
  }


  arrangeTime(date: string) {
    // yak 
    let day = date.split("T");
    let [hours, minutes] = day[1].split(':');

    if (hours.length == 1) {
      hours = `0${hours}`;
    }
    return `${day[0]}T${hours}:${minutes}`;
  }

}