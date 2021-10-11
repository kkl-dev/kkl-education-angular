import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FacilitiesService {

  constructor() { }

  private closeModalObs = new BehaviorSubject('');
  private arr: any[] = [];

  public closeModal(args: string): void {
    this.closeModalObs.next(args);
  }
  public getCloseModalObs(): Observable<string> {
    return this.closeModalObs.asObservable();
  }
}
