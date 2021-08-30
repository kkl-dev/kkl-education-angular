import { Injectable } from '@angular/core';
import * as uuid from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class TransportDetailsModel {
  constructor(
    public supplier?: string,
    public item?: string,
    public quantity?: number,
    public participants?: string,
    public price?: number,
    public supplierCost?: number,
    public customerCost?: number,
    public total?: number
  ) {}

  static create(transportDetails: TransportDetailsModel) {
    return new TransportDetailsModel(
      transportDetails.supplier,
      transportDetails.item,
      transportDetails.quantity,
      transportDetails.participants,
      transportDetails.price,
      transportDetails.supplierCost,
      transportDetails.customerCost,
      transportDetails.total
    );
  }
}

@Injectable({
  providedIn: 'root',
})
export class TransportLocationsModel {
  constructor(
    public pickUpDate?: Date,
    public pickUpHour?: Date,
    public pickUpLocation?: string,
    public pickUpAddress?: string,
    public dropDownDate?: Date,
    public dropDownHour?: Date
  ) {}

  static create(transportLocation: TransportLocationsModel) {
    return new TransportLocationsModel(
      transportLocation.pickUpDate,
      transportLocation.pickUpHour,
      transportLocation.pickUpLocation,
      transportLocation.pickUpAddress,
      transportLocation.dropDownDate,
      transportLocation.dropDownHour
    );
  }
}

@Injectable({
  providedIn: 'root',
})
export class TransportModel {
  constructor(
    public details?: TransportDetailsModel,
    public locations?: TransportLocationsModel,
    public comments?: string
  ) {}

  static create(transport: TransportModel) {
    return new TransportModel(
      TransportDetailsModel.create(transport.details),
      TransportLocationsModel.create(transport.locations),
      transport.comments
    );
  }
}
