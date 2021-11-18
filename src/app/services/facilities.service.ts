import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { EventInput } from '@fullcalendar/angular';
import { INITIAL_EVENTS } from '../screens/order-tour/facilities/calendar/event-utils';
import { InfoCard } from '../screens/education-results/education-results.component';
import { ActivitiesCardInterface } from '../components/activities-card/activities-card.component';
import { FacilityModel } from '../screens/order-tour/facilities/models/facility.model';
import { FacilitiesConvertingService } from './facilities-converting.service';
import { ActivitiesService } from 'src/app/open-api';

@Injectable({
  providedIn: 'root'
})
export class FacilitiesService {

  constructor(private facilitiesConvertingService: FacilitiesConvertingService, private activitiyService: ActivitiesService) { }

  private closeModalObs = new BehaviorSubject('');
  //private calendarEventsArr = new BehaviorSubject<EventInput[] | any>(INITIAL_EVENTS);
  public calendarEventsArr = new BehaviorSubject<EventInput[] | any>(INITIAL_EVENTS);
  private selectedFacility = new BehaviorSubject(null);
  private selectedActivity = new BehaviorSubject(null);

  public getCalendarEventsArr(): Observable<EventInput[]> {
    console.log("get Calendar EventsArr: ");
    return this.calendarEventsArr.asObservable();
  }

  public updateCalendarEventsArr(args: EventInput, fromTripCalendarApi: boolean): void {
    console.log("update Calendar EventsArr: args ", args);
    this.calendarEventsArr.next([...this.calendarEventsArr.value, args]);

    // del for temp 
    // if (!fromTripCalendarApi) {
    //   let eventsArr = this.facilitiesConvertingService.convertActivityForApi(this.calendarEventsArr.value);

    //   this.activitiyService.createTripActivities(eventsArr).subscribe(res => {
    //     console.log(res);
    //   }, (err) => {
    //     console.log(err);

    //   })
    // }
  }

  public closeModal(args: string): void {
    console.log("close Modal: args ", args);
    this.closeModalObs.next(args);
  }
  public getCloseModalObs(): Observable<string> {
    console.log("get CloseModalObs: ");
    return this.closeModalObs.asObservable();
  }

  public findObjectInCalendarArray(id: string | number) {
    console.log("find Object In CalendarArray: " + id);
    const [item] = this.calendarEventsArr.value.filter((item: any) => item.id === id);
    if (item.type === 'activity') {
      this.updateSelectedActivity(item);
    }
    if (item.type === 'facility') {
      this.updateSelectedFacility(item);
    }
    this.closeModal(item.type);
  }

  // public updateSelectedFacility(args: FacilityModel): void {
  //   console.log("updateSelected Facility: args ", args);
  //   this.selectedFacility.next(args);
  // }

  // public getSelectedFacility(): Observable<FacilityModel> {
  //   return this.selectedFacility.asObservable();
  // }

  public updateSelectedFacility(args: any): void {
    console.log("updateSelected Facility: args ", args);
    this.selectedFacility.next(args);
  }
  public getSelectedFacility(): Observable<any> {
    return this.selectedFacility.asObservable();
  }

  public updateSelectedActivity(args: ActivitiesCardInterface): void {
    console.log("updateSelected Activity: args ", args);
    this.selectedActivity.next(args);
  }
  public getSelectedActivity(): Observable<ActivitiesCardInterface> {
    return this.selectedActivity.asObservable();
  }

  public updateItemInArrayOfCalendar(args): void {
    const index = this.calendarEventsArr.value.findIndex((item: any) => item.id === args.id);
    const arr = [...this.calendarEventsArr.value];
    arr[index] = args;
    this.calendarEventsArr.next(arr);
  }

  public deleteItemFromArray(id: string | number): void {
    const index = this.calendarEventsArr.value.findIndex((item: any) => item.id === id);
    const arr = [...this.calendarEventsArr.value];
    arr.splice(index, 1);
    this.calendarEventsArr.next(arr);
  }

  public updateTimesInArray(id: string | number, dates: string[]): void {
    const index = this.calendarEventsArr.value.findIndex((item: any) => item.id === id);
    const arr = [...this.calendarEventsArr.value];
    const [start, end] = dates;
    arr[index].start = start;
    arr[index].end = end;
    this.calendarEventsArr.next(arr);
  }
}
