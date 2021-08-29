import { ScheduleModel } from './schedule.model';
import { TourModel } from './tour.model';

export class TourTransportModel extends TourModel {
  constructor(
    public id: number,
    public title: string,
    public date: Date,
    public schedule: ScheduleModel[],
    ) {
    super(id, title, date);
  }

  static create(tour: TourTransportModel) {
    return new TourTransportModel(tour.id, tour.title, tour.date, tour.schedule);
  }
}
