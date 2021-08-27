import { LocationModel } from "./LocationModel";

export class SchedualeModel {

  constructor(
    public date?: Date,
    public locations?: LocationModel[]
  ) {
    this.date = this.date || new Date(),
    this.locations = this.locations || [new LocationModel()]
  }
}
