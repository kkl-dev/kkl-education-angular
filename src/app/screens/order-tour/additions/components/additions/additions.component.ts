import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ScheduleModel } from '../../models/schedule.model';
import { AdditionsService } from '../../services/additions.service';
import { TourModel } from '../../models/tour.model';

import { tourTransport } from 'src/mock_data/transport';
import { TourService } from '../../services/tour.service';
import { SquadAssembleService } from '../../../squad-assemble/services/squad-assemble.service';
import { OrderService, Order, OrderModel, OrderEvent, TransportOrder, OrderItemCommonDetails, OrderType } from 'src/app/open-api';
import { analyzeAndValidateNgModules } from '@angular/compiler';

export interface TourDayModel {
  date: Date;
  locations: any[];
}

@Component({
  selector: 'app-additions',
  templateUrl: './additions.component.html',
  styleUrls: ['./additions.component.scss'],
})
export class AdditionsComponent implements OnInit {
  public tour = {} as TourModel;
  public schedule$: Observable<ScheduleModel[]>;
  public schedule: ScheduleModel;
  public addSchedule: boolean = false;
  public orderModel = {} as OrderModel;
  public item$: Observable<TransportOrder[]>;
  public item: TransportOrder;
  public addItem: boolean = false;

  constructor(
    private tourService: TourService,
    private additionsService: AdditionsService, private squadAssembleService: SquadAssembleService, private orderService: OrderService,
  ) { }

  ngOnInit(): void {
    this.getTempOrder();
    // this.tourService.setTour(TourModel.create(tourTransport));
    // this.tour = this.tourService.getTour();
    // this.tour.id = this.squadAssembleService.tripInfofromService.trip.id;
    // this.tour.title = this.squadAssembleService.tripInfofromService.trip.tripDescription;
    this.tour.id = 5555;
    this.tour.title = 'טיול נסיון';
    // this.additionsService.emitSchedule(this.tour.schedule);
    this.onAdd();
  }

  public onAdd() {
    this.schedule = new ScheduleModel();
    // this.addSchedule = true;
    // this.item = new TransportOrder();
    this.addItem = true;
  }
  getTempOrder() {
    // var tripId =tourTransport.id= this.squadAssembleService.tripInfofromService.trip.id
    var tripId = 52573;
    this.orderService.getTempOrders(tripId).subscribe(
      response => {
        console.log(response)
        this.additionsService.tempOrder = response;
        var TransportOrderList = [];
        for (var i in response) {
          var t = {} as TransportOrder;
          t.common = {} as OrderItemCommonDetails;
          t.order = {} as Order;
          t.order.orderType = {} as OrderType;
          t.common.startDate = response[i].date;
          t.common.endDate = response[i].date;
          t.common.startHour = response[i].fromHour;
          t.common.endHour = response[i].tillHour;
          t.order.tripId = response[i].tripId;
          t.order.orderType.name = response[i].orderTypeName;
          t.order.orderType.id = response[i].orderTypeCode;
          t.common.endHour
          TransportOrderList.push(t);
        }
        this.additionsService.emitItem(TransportOrderList);
        this.item$ = this.additionsService.item$;
        // this.item = this.item$[0]
      },
      error => console.log(error),       // error
      () => console.log('completed')     // complete
    )
  }
}
