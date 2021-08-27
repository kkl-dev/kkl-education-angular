export interface LocationModel {
  date: Date;
  pickup: string;
  dropdown: string;
}

export class TourPanelModel {
  constructor(
    public id: number,
    public title: string,
    public date: Date,
    public locations: LocationModel[]) { }

  static create(tour: TourPanelModel) {
    return new TourPanelModel(tour.id, tour.title, tour.date, tour.locations);
  }
}
