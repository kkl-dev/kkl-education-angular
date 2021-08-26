export interface LocationModel {
  date: Date;
  pickup: string;
  dropdown: string;
}

export class TourPanelModel {
  constructor(public date: Date, public locations: LocationModel[]) {}

  static create(options: TourPanelModel) {
    return new TourPanelModel(options.date, options.locations);
  }
}
