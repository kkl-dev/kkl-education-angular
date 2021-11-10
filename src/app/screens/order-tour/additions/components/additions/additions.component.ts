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
import { ConfirmDialogComponent } from 'src/app/utilities/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
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
  public items: any[];
  public item: any;
  public addItem: boolean = false;
  tripId: number;
  tourTitle: any;
  orderType: number = 1;
  disabled: boolean= false;
  public tempOrderReduce: any;

  constructor(private _dialog: MatDialog,
    private tourService: TourService,
    private additionsService: AdditionsService, private squadAssembleService: SquadAssembleService, private orderService: OrderService,
    private generalFormService: GeneralFormService) { }

  ngOnInit(): void {


    this.tripId = this.squadAssembleService.tripInfofromService.trip.id;
   
    this.tourTitle= this.squadAssembleService.tripInfofromService.trip.tripDescription;

    this.getOrders();
    //this.getTempOrder();
    // this.tourService.setTour(TourModel.create(tourTransport));
    // this.tour = this.tourService.getTour();

    // this.additionsService.emitSchedule(this.tour.schedule);
    //this.onAdd();
     this.generalFormService.enableButton.subscribe(res=>{
       this.disabled=!res;
     })
  }

  public onAdd() {
    // this.item = {} as OrderEvent;

    // if (this.orderType === 1 && this.items.length > 10) {
    //   const dialogRef = this._dialog.open(ConfirmDialogComponent, {
    //     width: '500px',
    //     data: { message: 'שים לב שכמות הפריטים בהזמנת היסעים גדולה מ - 10', content: '', rightButton: 'ביטול', leftButton: 'המשך' }
    //   })
    // }

    this.addItem = true;
  }

  test(){
    this.addItem = false;
  }
  getOrders() {
    this.orderService.getOrders(this.tripId).subscribe(res => {
      console.log(res);
      this.generalFormService.mapOrderList(res);
      this.getTempOrder();
    }, (err) => {
      console.log(err);
    })
  }
  getTempOrder() {

    this.tripId = this.squadAssembleService.tripInfofromService.trip.id
   // this.tripId= 52973;
    this.orderService.getTempOrders(this.tripId).subscribe(
      response => {
        console.log(response);
        if (response.length > 0) {
          
          this.additionsService.tempOrder = response;
          this.tempOrderReduce = this.additionsService.tempOrder.reduce(function (acc, obj) {
            let key = obj['orderTypeCode']
            if (!acc[key]) { acc[key] = [] }
            acc[key].push(obj)
            return acc
          }, {})
          this.generalFormService.updateTempOrderReduce(this.tempOrderReduce,this.orderType);
          //this.generalFormService.updateTempOrderReduce(this.tempOrderReduce);
          this.mapTempOrder(this.orderType);
        }
        else {
          this.addItem = true;
          this.disabled=true;
          return;
        }

      },
      error => console.log(error),       // error
      () => console.log('completed')     // complete
    )
  }
  mapTempOrder(orderTypId: number) {
    if (this.tempOrderReduce !== undefined && this.tempOrderReduce !== null) {
      var orderList = [];
      // if (this.tempOrderReduce[orderTypId] === undefined) { this.item$ = new Observable<any[]>(); return; }
      if (this.tempOrderReduce[orderTypId] === undefined) {
        if(this.items == undefined){
          this.addItem = true;
        }
      return;
    }
    else{
      this.addItem = false;
    }  
      for (var i in this.tempOrderReduce[orderTypId]) {
         if (this.tempOrderReduce[orderTypId][i].orderId != undefined && this.tempOrderReduce[orderTypId][i].orderId && this.tempOrderReduce[orderTypId][i].orderId!=0 )
        // if (this.tempOrderReduce[orderTypId][i].orderId)
          continue;
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
        order.globalParameters.tempOrderIdentity = this.tempOrderReduce[orderTypId][i].orderTempId;
        orderList.push(order);
      }
      // this.additionsService.emitItem(OrderList);
      // this.item$ = this.additionsService.item$;
      if (this.items != undefined && this.items.length != 0) {
        if (this.items.length > 0) {
          let tempArr = this.items.concat(orderList);
          this.items = [];
          this.items = tempArr;
        }
      }
      else {
          this.items = [];
          if(orderList.length>0){
            this.items = orderList;  
          }
          else if (this.orderType==1 && this.generalFormService.transportOrderList.length > 0){
            this.items = this.generalFormService.transportOrderList; 
          }
          else{
            this.addItem = true;
          }
              
      }
    }
    // if (this.tempOrderReduce[1].length > 10) {
    //   const dialogRef = this._dialog.open(ConfirmDialogComponent, {
    //     width: '500px',
    //     data: { message: 'שים לב שכמות הפריטים בהזמנת היסעים גדולה מ - 10', content: '', rightButton: 'ביטול', leftButton: 'המשך' }
    //   })
    // }
  }
  change(event) {
    switch (event) {
      case 1:
        if (this.generalFormService.transportOrderList.length > 0) {
          this.items = this.generalFormService.transportOrderList;
          this.addItem = false;
          this.disabled=false;
        }
        else {
          this.items = [];
          this.addItem = true;
          this.disabled=true;
        }
        //this.disabled=true;
        break;
      case 2:
        if (this.generalFormService.securingOrderList.length > 0) {
          this.items = this.generalFormService.securingOrderList;
          this.addItem = false;
          this.disabled=false;
        }
        else {
          this.items = [];
          this.addItem = true;
          this.disabled=true;
        }
        //this.disabled=true;
        break;
      case 3:

        if (this.generalFormService.siteOrderList.length > 0) {
          this.items = this.generalFormService.siteOrderList;
          this.addItem = false;
          this.disabled=false;
        }
        else {
          this.items = [];
          this.addItem = true;
          this.disabled=true;
        }
        //this.disabled=true;
        break;
      case 4:
        if (this.generalFormService.economyOrderList.length > 0) {
          this.items = this.generalFormService.economyOrderList;
          this.addItem = false;
          this.disabled=false;
        }
        else {
          this.items = [];
          this.addItem = true;
          this.disabled=true;
        }
        //this.disabled=true;
        break;
      case 6:
        if (this.generalFormService.gudianceOrderList.length > 0) {
          this.items = this.generalFormService.gudianceOrderList;
          this.addItem = false;
          this.disabled=false;
        }
        else {
          this.items = [];
          this.addItem = true;
          this.disabled=true;
        }
        //this.disabled=true;
        break;
      case 7:
        if (this.generalFormService.hostingOrderList.length > 0) {
          this.items = this.generalFormService.hostingOrderList;
          this.addItem = false;
          this.disabled=false;
        }
        else {
          this.items = [];
          this.addItem = true;
          this.disabled=true;
        }
        //this.disabled=true;
        break;
      case 10:
        if (this.generalFormService.musicOrderList.length > 0) {
          this.items = this.generalFormService.musicOrderList;
          this.addItem = false;
          this.disabled=false;
        }
        else {
          this.items = [];
          this.addItem = true;
          this.disabled=true;
        }
        //this.disabled=true;
        break;
    }
    if (event == 1 || event == 4 || event == 6 || event == 7) {
      this.mapTempOrder(event);
    }
    this.orderType = event;
  }

}
