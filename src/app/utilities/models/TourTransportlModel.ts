export interface LocationModel {
  date: Date;
  pickup: string;
  dropdown: string;
}

export class TourTransportlModel {
  constructor(
    public id: number,
    public title: string,
    public date: Date,
    public locations: LocationModel[]) { }

  static create(tour: TourTransportlModel) {
    return new TourTransportlModel(tour.id, tour.title, tour.date, tour.locations);
  }
}
