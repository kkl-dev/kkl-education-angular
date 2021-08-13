import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { NavigationCardModel } from '../../models/nav-card-model';

@Injectable({
  providedIn: 'root'
})
export class AdditionsService {


  private navigationItems: NavigationCardModel[] = []
  private navigationButtonSubject = new Subject<NavigationCardModel>()
  public navButton$: Observable<NavigationCardModel> = this.navigationButtonSubject.asObservable();

  constructor() { }

  public getNavigationItems(): NavigationCardModel[] {
    return [...this.navigationItems]
  }

  public setNavigationStatus(items: NavigationCardModel[]) {
    this.navigationItems = items
  }
  public findItenIndex(key: string, value: any): number {
    return this.navigationItems.findIndex((item) => item[key] === value)
  }

  public setNanigationStatus(item : NavigationCardModel, key : string) {

    console.log(item)

    const indexToUnActive = this.findItenIndex('isActive', true)
    const indexToActive = this.findItenIndex(key, item[key])

    this.navigationItems[indexToActive].isActive = true
    this.navigationItems[indexToUnActive].isActive = false
  }

  public emitItem(item: NavigationCardModel) {
    this.navigationButtonSubject.next(item)
  }
}
