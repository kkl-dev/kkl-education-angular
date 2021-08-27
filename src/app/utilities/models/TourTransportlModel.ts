import { TourModel } from './TourModel';
export interface LocationModel {
  pickUpDate: Date;
  pickupLocation: string;
  dropdownLocation: string;
}

export class TourTransportlModel extends TourModel {
  constructor(
    public id: number,
    public title: string,
    public date: Date,
    public locations: LocationModel[]) {
    super(id, title, date);
  }

  static create(tour: TourTransportlModel) {
    return new TourTransportlModel(tour.id, tour.title, tour.date, tour.locations);
  }
}
