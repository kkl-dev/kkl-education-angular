import { StepModel } from 'src/app/utilities/models/step.model';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { LocationModel } from '../models/location.model';
import { ScheduleModel } from 'src/app/screens/order-tour/additions/models/schedule.model';

@Injectable({
  providedIn: 'root'
})
export class AdditionsService {

  private steps: StepModel[] = [
    {
      label: 'היסעים',
      isActive: true,
      svgUrl: 'bus',
      badgeValue: 3,
    },
    {
      label: 'אבטחה',
      isActive: false,
      svgUrl: 'shield',
    },
    {
      label: 'אתרים',
      isActive: false,
      svgUrl: 'site',
    },
    {
      label: 'כלכלה',
      isActive: false,
      svgUrl: 'dinner',
    },
    {
      label: 'אירוח',
      isActive: false,
      svgUrl: 'tent',
    },
    {
      label: 'הדרכה',
      isActive: false,
      svgUrl: 'guide',
    },
    {
      label: 'הפעלה מוסיקלית',
      isActive: false,
      svgUrl: 'music',
    },
  ].reverse();

  private stepsSubject = new BehaviorSubject<StepModel[]>(this.steps)
  public steps$ = this.stepsSubject.asObservable()

  private locationsSubject = new BehaviorSubject<LocationModel[]>([])
  public locations$: Observable<LocationModel[]> = this.locationsSubject.asObservable();

  private scheduleSubject = new BehaviorSubject<ScheduleModel[]>([])
  public schedule$: Observable<ScheduleModel[]> = this.scheduleSubject.asObservable();

  constructor() { }

   private findItemIndex(key: string, value: any): number {
    return this.steps.findIndex((item) => item[key] === value)
  }

  public toggleCardStatus(item: StepModel, key: string) {

    const indexToUnActive = this.findItemIndex('isActive', true)
    const indexToActive = this.findItemIndex(key, item[key])

    this.steps[indexToUnActive].isActive = false
    this.steps[indexToActive].isActive = true

    this.emitCards()


  }

  public emitCards() {
    this.stepsSubject.next(this.steps)
  }

  public emitSchedule(schedule: ScheduleModel[]) {
    this.scheduleSubject.next(schedule)
  }

  public emitLocations(locations: LocationModel[]) {
    this.locationsSubject.next(locations)
  }

}
