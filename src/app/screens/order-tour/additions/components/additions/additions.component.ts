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
import { GeneralFormService } from '../../services/general-form.service';

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
  // public schedule$: Observable<ScheduleModel[]>;
  // public schedule: ScheduleModel;
  // public addSchedule: boolean = false;
  //public orderModel = {} as OrderModel;
  public item$: Observable<any[]>;
  public item: any;
  public addItem: boolean = false;
  orderType: number = 1;

  public tempOrderReduce: any;

  constructor(
    private tourService: TourService,
    private additionsService: AdditionsService, private squadAssembleService: SquadAssembleService, private orderService: OrderService,
    private generalFormService: GeneralFormService) { }

  ngOnInit(): void {
    this.getTempOrder();
    // this.tourService.setTour(TourModel.create(tourTransport));
    // this.tour = this.tourService.getTour();
    // this.tour.id = this.squadAssembleService.tripInfofromService.trip.id;
    // this.tour.title = this.squadAssembleService.tripInfofromService.trip.tripDescription;
    console.log('this.squadAssembleService.peopleInTrip:', this.squadAssembleService.peopleInTrip)
    this.tour.id = 5555;
    this.tour.title = 'טיול נסיון';
    // this.additionsService.emitSchedule(this.tour.schedule);
    this.onAdd();
  }

  public onAdd() {
    // this.schedule = new ScheduleModel();
    // this.addSchedule = true;
    // this.item = {} as OrderEvent;
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
        this.additionsService.sendtempOrderReduce(this.tempOrderReduce);
        this.mapTempOrder(1);
      },
      error => console.log(error),       // error
      () => console.log('completed')     // complete
    )
  }
  mapTempOrder(orderTypId: number) {
    if (this.tempOrderReduce !== undefined && this.tempOrderReduce !== null) {
      var OrderList = [];
      if (this.tempOrderReduce[orderTypId] === undefined) { this.item$ = new Observable<any[]>(); return; }
      for (var i in this.tempOrderReduce[orderTypId]) {
        var order = {} as OrderEvent;
        order.globalParameters = {} as OrderItemCommonDetails;
        let startDate = this.generalFormService.changeDateFormat(this.tempOrderReduce[orderTypId][i].startDate, 'israel');
        order.globalParameters.startDate = startDate;
        let endDate = this.generalFormService.changeDateFormat(this.tempOrderReduce[orderTypId][i].endDate, 'israel');
        order.globalParameters.endDate = endDate;
        let startHour = (this.tempOrderReduce[orderTypId][i].fromHour).split('T');
        order.globalParameters.startHour = startHour[1];
        let tillHour = (this.tempOrderReduce[orderTypId][i].tillHour).split('T');
        order.globalParameters.endHour = tillHour[1];

        OrderList.push(order);
      }
      this.additionsService.emitItem(OrderList);
      this.item$ = this.additionsService.item$;
    }
  }
  change(event) {
    this.mapTempOrder(event);
    this.orderType = event;
    }
  }
