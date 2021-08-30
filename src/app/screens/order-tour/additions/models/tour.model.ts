import { ScheduleModel } from './schedule.model';

export class TourModel {
  constructor(
    public id: number,
    public title: string,
    public date: Date,
    public schedule: ScheduleModel[]
  ) {}

  static create(tour: TourModel) {
    return new TourModel(
      tour.id,
      tour.title,
      tour.date,
      tour.schedule
    );
  }
}
