import { SchedualeModel } from './ScheduleModel';
import { LocationModel } from './LocationModel';
import { TourModel } from './TourModel';

export class TourTransportlModel extends TourModel {
  constructor(
    public id: number,
    public title: string,
    public date: Date,
    public schedule: SchedualeModel[],
    ) {
    super(id, title, date);
  }

  static create(tour: TourTransportlModel) {
    return new TourTransportlModel(tour.id, tour.title, tour.date, tour.schedule);
  }
}
