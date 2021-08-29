export class TourModel {
  constructor(
    public id: number,
    public title: string,
    public date: Date,
  ) { }

  static create(tour: TourModel) {
    return new TourModel(tour.id, tour.title, tour.date);
  }
}
