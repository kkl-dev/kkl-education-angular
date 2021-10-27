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
  public items: any [];
  public item: any[];
  public addItem: boolean = false;
  tripId : number;
  orderType: number = 1;

  public tempOrderReduce: any;

  constructor(
    private tourService: TourService,
    private additionsService: AdditionsService, private squadAssembleService: SquadAssembleService, private orderService: OrderService,
   private generalFormService: GeneralFormService ) { }

  ngOnInit(): void {
    //this.getOrders();
    //this.items=[];
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
    // this.schedule = new ScheduleModel();
    // this.addSchedule = true;
   // this.item = {} as OrderEvent;
    this.addItem = true;
  }
  // getOrders(){
  //  this.orderService.getOrdersList(this.tripId).subscribe(res=>{
  //    console.log(res);
  //  },(err)=>{
  //   console.log(err);
  //  })
  // }
  getTempOrder() {
    
    this.tripId =this.squadAssembleService.tripInfofromService.trip.id
     //this.tripId= 52910;
    this.orderService.getTempOrders(this.tripId).subscribe(
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
      var orderList = [];
      // if (this.tempOrderReduce[orderTypId] === undefined) { this.item$ = new Observable<any[]>(); return; }
      if (this.tempOrderReduce[orderTypId] === undefined) { return; }
      for (var i in this.tempOrderReduce[orderTypId]) {
        if(this.tempOrderReduce[orderTypId][i].orderId  != undefined)
        continue;
        var order = {} as OrderEvent;
        order.globalParameters = {} as OrderItemCommonDetails;
        let startDate = this.generalFormService.changeDateFormat(this.tempOrderReduce[orderTypId][i].startDate,'israel');
        order.globalParameters.startDate = startDate;
        let endDate = this.generalFormService.changeDateFormat(this.tempOrderReduce[orderTypId][i].endDate,'israel');
        order.globalParameters.endDate = endDate;
        let startHour = (this.tempOrderReduce[orderTypId][i].fromHour).split('T');
        order.globalParameters.startHour = startHour[1];
        let tillHour = (this.tempOrderReduce[orderTypId][i].tillHour).split('T');
        order.globalParameters.endHour = tillHour[1];
      
        orderList.push(order);
      }
      // this.additionsService.emitItem(OrderList);
      // this.item$ = this.additionsService.item$;
      if(this.items!= undefined && this.items.length != 0 ){
        if (this.items.length>0){
          let tempArr= this.items.concat(orderList);
          this.items=[];
          this.items= tempArr;
        }        
      }     
      else{
        this.items= orderList;
      }
    }
  }
  change(event) {
    switch (event) {
      case 1:
        if(this.generalFormService.transportOrderList.length>0)
          this.items=this.generalFormService.transportOrderList;
        break;
      case 4:
        if(this.generalFormService.economyOrderList.length>0)
        this.items=this.generalFormService.economyOrderList;
        else{
          this.items=[];
        }
        break;
   }
    this.mapTempOrder(event);
    this.orderType = event;
  }
}
