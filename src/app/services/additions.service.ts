import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { NavigationCardModel } from '../models/nav-card-model';

@Injectable({
  providedIn: 'root'
})
export class AdditionsService {



  private navigationButtonSubject = new Subject<NavigationCardModel>()
  public navButton$: Observable<NavigationCardModel> = this.navigationButtonSubject.asObservable();

  constructor() { }

  public findItenIndex(key: string, value: any, items: any[]): number {
    return items.findIndex((item) => item[key] === value)
  }

  public setItems(items: NavigationCardModel[], indexActive: number, indexUnActive: number): NavigationCardModel[] {
  items[indexActive].active = true
  items[indexUnActive].active = false
  return items
}
}
