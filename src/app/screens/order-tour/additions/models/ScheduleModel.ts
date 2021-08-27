import { LocationModel } from "./LocationModel";

export class SchedualeModel {

  constructor(
    public date?: Date,
    public locations?: LocationModel[]
  ) {

  }
}
