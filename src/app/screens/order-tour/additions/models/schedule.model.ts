import { TransportOrder } from "src/app/open-api";
import { LocationModel } from "./location.model";
import { TransportModel } from "./transport.model";

export class ScheduleModel {

  constructor(
    public id?: number,
    public date?: Date,
    public locations?: LocationModel[],
    public transport?: TransportModel,    
  ) {
    this.locations = this.locations || [new LocationModel()]
    this.transport = this.transport || new TransportModel()
  }
}
