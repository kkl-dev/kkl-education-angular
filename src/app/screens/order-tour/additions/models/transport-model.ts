import { Injectable } from '@angular/core';

export class TransportDetailsModel {
  constructor(
    public supplier: string,
    public item: string,
    public quantity: number,
    public participants: string,
    public price: number,
    public supplierCost: number,
    public customerCost: number,
    public total: number
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

export class TransportLocationsModel {
  constructor(
    public pickUpDate: Date,
    public pickUpHour: Date,
    public pickUpLocation: string,
    public pickUpAddress: string,
    public dropDownDate: Date,
    public dropDownHour: Date
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
    public id: number,
    public details: TransportDetailsModel,
    public locations: TransportLocationsModel,
    public comments: string
  ) {}

  static create(transport: TransportModel) {
    return new TransportModel(
      transport.id,
      TransportDetailsModel.create(transport.details),
      TransportLocationsModel.create(transport.locations),
      transport.comments
    );
  }
}
