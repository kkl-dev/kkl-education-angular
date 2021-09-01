import { IconCardModel } from 'src/app/utilities/models/IconCardModel';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { LocationModel } from '../models/location.model';
import { ScheduleModel } from 'src/app/screens/order-tour/additions/models/schedule.model';

@Injectable({
  providedIn: 'root'
})
export class AdditionsService {

  private navigationCrds: IconCardModel[] = [
    {
      label: 'הפעלה מוסיקלית',
      isActive: false,
      svgUrl: 'music',
    },
    {
      label: 'הדרכה',
      isActive: false,
      svgUrl: 'guide',
    },
    {
      label: 'אירוח',
      isActive: false,
      svgUrl: 'tent',
    },
    {
      label: 'כלכלה',
      isActive: false,
      svgUrl: 'dinner',
    },
    {
      label: 'אתרים',
      isActive: false,
      svgUrl: 'site',
    },
    {
      label: 'אבטחה',
      isActive: false,
      svgUrl: 'shield',
    },

    {
      label: 'היסעים',
      isActive: true,
      svgUrl: 'bus',
      badgeValue: 3,
    },
  ];

  private navigationCardsSubject = new BehaviorSubject<IconCardModel[]>(this.navigationCrds)
  public navigationCards$ = this.navigationCardsSubject.asObservable()

  private locationsSubject = new BehaviorSubject<LocationModel[]>([])
  public locations$: Observable<LocationModel[]> = this.locationsSubject.asObservable();

  private scheduleSubject = new BehaviorSubject<ScheduleModel[]>([])
  public schedule$: Observable<ScheduleModel[]> = this.scheduleSubject.asObservable();

  constructor() { }

  public getNavigationCrds(): IconCardModel[] {
    return [...this.navigationCrds]
  }

  private findItemIndex(key: string, value: any): number {
    return this.navigationCrds.findIndex((item) => item[key] === value)
  }

  public toggleCardStatus(item: IconCardModel, key: string) {

    const indexToUnActive = this.findItemIndex('isActive', true)
    const indexToActive = this.findItemIndex(key, item[key])

    this.navigationCrds[indexToActive].isActive = true
    this.navigationCrds[indexToUnActive].isActive = false
  }

  public emitSchedule(schedule: ScheduleModel[]) {
    this.scheduleSubject.next(schedule)
  }

  public emitLocations(locations: LocationModel[]) {
    this.locationsSubject.next(locations)
  }

}
