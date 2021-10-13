import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { EventInput } from '@fullcalendar/angular';
import { INITIAL_EVENTS } from '../screens/order-tour/facilities/calendar/event-utils';

@Injectable({
  providedIn: 'root'
})
export class FacilitiesService {

  constructor() { }

  private closeModalObs = new BehaviorSubject('');
  private calendarEventsArr = new BehaviorSubject<EventInput[]>(INITIAL_EVENTS);

  public getCalendarEventsArr(): Observable<EventInput[]> {
    return this.calendarEventsArr.asObservable();
  }

  public updateCalendarEventsArr(args: EventInput): void {
    this.calendarEventsArr.next([...this.calendarEventsArr.value,args]);
    console.log(this.calendarEventsArr);
    
  }

  public closeModal(args: string): void {
    this.closeModalObs.next(args);
  }
  public getCloseModalObs(): Observable<string> {
    return this.closeModalObs.asObservable();
  }
}
