import { Injectable } from '@angular/core';
import { ScheduleModel } from '../models/schedule.model';
import { TourModel } from '../models/tour.model';

@Injectable({
  providedIn: 'root',
})
export class TourService {
  private tour: TourModel;

  constructor() {}

  public setTour(tour: TourModel) {
    this.tour = { ...tour };
  }

  public getTour() {
    return this.tour;
  }

  public findSchedule(key: string, value: any) : void {
    const item = this.tour.schedule.find(
      (schedule: ScheduleModel) => schedule.id === value
    );
  }

  private findItemIndex(key: string, value: any): number {
    return this.tour.schedule.findIndex(
      (schedule: ScheduleModel) => schedule[key] === value
    );
  }
}
