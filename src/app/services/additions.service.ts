import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { NavigationCardModel } from '../models/nav-card-model';

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

  public setNanigationItems(items: NavigationCardModel[]) {
    this.navigationItems = items
  }
  public findItenIndex(key: string, value: any): number {
    return this.navigationItems.findIndex((item) => item[key] === value)
  }

  public setNanigationStatus(indexActive: number, indexUnActive: number) {
    this.navigationItems[indexActive].active = true
    this.navigationItems[indexUnActive].active = false
  }

  public emitItem(item: NavigationCardModel) {
    this.navigationButtonSubject.next(item)
  }
}
