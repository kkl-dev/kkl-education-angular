import { LocationModel } from "./location.model";

export class ScheduleModel {

  constructor(
    public id?: number,
    public date?: Date,
    public locations?: LocationModel[]
  ) {
    this.locations = this.locations || [new LocationModel()]
  }
}
