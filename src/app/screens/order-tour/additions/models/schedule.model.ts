import { LocationModel } from "./location.model";

export class ScheduleModel {

  constructor(
    public date?: Date,
    public locations?: LocationModel[]
  ) {
    this.locations = this.locations || [new LocationModel()]
  }
}
