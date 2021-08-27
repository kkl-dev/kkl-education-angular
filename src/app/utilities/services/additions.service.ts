import { TourPanelModel } from 'src/app/utilities/models/TourPanelModel';
import { IconCardModel } from 'src/app/utilities/models/IconCardModel';
import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdditionsService {

  private navigationCrds: IconCardModel[] = [
    {
      title: 'הפעלה מוסיקלית',
      isActive: false,
      svgUrl: 'music',
    },
    {
      title: 'הדרכה',
      isActive: false,
      svgUrl: 'guide',
    },
    {
      title: 'אירוח',
      isActive: false,
      svgUrl: 'tent',
    },
    {
      title: 'כלכלה',
      isActive: false,
      svgUrl: 'dinner',
    },
    {
      title: 'אתרים',
      isActive: false,
      svgUrl: 'site',
    },
    {
      title: 'אבטחה',
      isActive: false,
      svgUrl: 'shield',
    },

    {
      title: 'היסעים',
      isActive: true,
      svgUrl: 'bus',
      badgeValue: 3,
    },
  ];


  private navigationButtonSubject = new Subject<IconCardModel>()
  public navButton$: Observable<IconCardModel> = this.navigationButtonSubject.asObservable();

  private navigationCardsSubject = new Subject<IconCardModel[]>()
  public navigationCards$ = this.navigationCardsSubject.asObservable()

  private tourPanalSubject = new BehaviorSubject<TourPanelModel[]>([])
  public tourTransport$: Observable<TourPanelModel[]> = this.tourPanalSubject.asObservable();

  constructor() { }

  public getNavigationCrds(): IconCardModel[] {
    return [...this.navigationCrds]
  }

  public setNavigationStatus(items: IconCardModel[]) {
    this.navigationCrds = items
  }

  public findItenIndex(key: string, value: any): number {
    return this.navigationCrds.findIndex((item) => item[key] === value)
  }

  public setNanigationStatus(item: IconCardModel, key: string) {

    const indexToUnActive = this.findItenIndex('isActive', true)
    const indexToActive = this.findItenIndex(key, item[key])

    this.navigationCrds[indexToActive].isActive = true
    this.navigationCrds[indexToUnActive].isActive = false
  }

  public emitItem(item: IconCardModel) {
    this.navigationButtonSubject.next(item)
  }

  public emitPanallData(tourTransport: TourPanelModel[]) {
    this.tourPanalSubject.next(tourTransport)
  }
}
