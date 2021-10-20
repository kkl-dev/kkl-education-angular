import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { ScheduleModel } from '../../models/schedule.model';
import { AdditionsService } from '../../services/additions.service';
import { TourModel } from '../../models/tour.model';

import { tourTransport } from 'src/mock_data/transport';
import { TourService } from '../../services/tour.service';
import { SquadAssembleService } from '../../../squad-assemble/services/squad-assemble.service';
import { OrderService, Order, OrderEvent, TransportOrder, OrderItemCommonDetails, OrderType } from 'src/app/open-api';
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
  //public orderModel = {} as OrderModel;
  public item$: Observable<TransportOrder[]>;
  public item: TransportOrder;
  public addItem: boolean = false;

  public tempOrderReduce: any;

  constructor(
    private tourService: TourService,
    private additionsService: AdditionsService, private squadAssembleService: SquadAssembleService, private orderService: OrderService,
  ) { }

  ngOnInit(): void {
   // this.getTempOrder();
    // this.tourService.setTour(TourModel.create(tourTransport));
    // this.tour = this.tourService.getTour();
    this.tour.id = this.squadAssembleService.tripInfofromService.trip.id;
    this.tour.title = this.squadAssembleService.tripInfofromService.trip.tripDescription;
    console.log('this.squadAssembleService.peopleInTrip:', this.squadAssembleService.peopleInTrip)
    // this.tour.id = 5555;
    // this.tour.title = 'טיול נסיון';
    // this.additionsService.emitSchedule(this.tour.schedule);
    this.onAdd();
  }

  public onAdd() {
    // this.schedule = new ScheduleModel();
    // this.addSchedule = true;
    this.item = {} as TransportOrder;
    this.addItem = true;
  }
  getTempOrder() {
    // var tripId =tourTransport.id= this.squadAssembleService.tripInfofromService.trip.id
    var tripId = 52573;
    this.orderService.getTempOrders(tripId).subscribe(
      response => {
        console.log(response)
        this.additionsService.tempOrder = response;
        this.tempOrderReduce = this.additionsService.tempOrder.reduce(function (acc, obj) {
          let key = obj['orderTypeCode']
          if (!acc[key]) { acc[key] = [] }
          acc[key].push(obj)
          return acc
        }, {})

        var TransportOrderList = [];
        for (var i in response) {
          var t = {} as TransportOrder;
          t.globalParameters = {} as OrderItemCommonDetails;
          t.order = {} as Order;
          t.order.orderType = {} as OrderType;
          t.globalParameters.startDate = response[i].startDate;
          t.globalParameters.endDate = response[i].endDate;
          t.globalParameters.startHour = response[i].fromHour;
          t.globalParameters.endHour = response[i].tillHour;
          t.order.tripId = response[i].tripId;
          t.order.orderType.name = response[i].orderTypeName;
          t.order.orderType.id = response[i].orderTypeCode;
          t.globalParameters.endHour
          TransportOrderList.push(t);
        }
        this.additionsService.emitItem(TransportOrderList);
        this.item$ = this.additionsService.item$;
      },
      error => console.log(error),       // error
      () => console.log('completed')     // complete
    )
  }
}
