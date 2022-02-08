import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { ScheduleModel } from '../../models/schedule.model';
import { AdditionsService } from '../../services/additions.service';
import { TourModel } from '../../models/tour.model';

import { tourTransport } from 'src/mock_data/transport';
import { TourService } from '../../services/tour.service';
import { SquadAssembleService } from '../../../squad-assemble/services/squad-assemble.service';
import { OrderService, Order, OrderEvent, TransportOrder, OrderItemCommonDetails, OrderType, ItemsByTypeOrder } from 'src/app/open-api';
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

    if(this.squadAssembleService.tripInfofromService){
      this.tripId = this.squadAssembleService.tripInfofromService.trip.id;
      this.generalFormService.tripId= this.tripId;
      this.generalFormService.tripInfo= this.squadAssembleService.tripInfofromService;
      this.generalFormService.peopleInTrip= this.squadAssembleService.peopleInTrip;
      this.generalFormService.isOneDayTrip= this.squadAssembleService.isOneDayTrip
    }
    else{
      this.tripId= parseInt(localStorage.getItem('tripId'));
      this.generalFormService.tripId= this.tripId;
      this.generalFormService.peopleInTrip = parseInt(localStorage.getItem('peopleInTrip'))
      //let retrievedObject = localStorage.getItem('centerFieldObj');
      let retrievedObject = localStorage.getItem('tripInfofromService');
      let retrievedObj = JSON.parse(retrievedObject);
       this.generalFormService.tripInfo= retrievedObj;
       console.log('retrievedObject: ', retrievedObj);
       if(this.generalFormService.tripInfo.trip.tripStart===this.generalFormService.tripInfo.trip.tripEnding)
       this.generalFormService.isOneDayTrip=true;
       else
       this.generalFormService.isOneDayTrip=false;
    }

     this.tourTitle= this.generalFormService.tripInfo.trip.tripDescription;
     if(!this.generalFormService.isGudianceOrderByGuidesNumExist)
      this.createGudianceOrders();
    this.getOrders();
     this.generalFormService.enableButton.subscribe(res=>{
       this.disabled=!res;
       this.addItem = false;
       this.change(this.orderType);
     })
  }

  public onAdd() {
    this.addItem = true;
    this.disabled=true;
  }

  createGudianceOrders(){
    this.orderService.addGudianceOrdersByGudiesNum(this.tripId).subscribe(res=>{
      console.log(res);
      if(res.length>0)
      this.generalFormService.setGudianceOrderList(res);
    },(err)=>{
      console.log(err);
    })
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
          continue;
        var order = {} as OrderEvent;
         order.order ={} as Order;
         order.order.orderType = {} as OrderType;
        order.globalParameters = {} as OrderItemCommonDetails;
        let startDate = this.generalFormService.changeDateFormat(this.tempOrderReduce[orderTypId][i].startDate, 'israel');
        order.globalParameters.startDate = startDate;
        let endDate = this.generalFormService.changeDateFormat(this.tempOrderReduce[orderTypId][i].endDate, 'israel');
        order.globalParameters.endDate = endDate;
        let startHour = (this.tempOrderReduce[orderTypId][i].fromHour).split('T');
        order.globalParameters.startHour = startHour[1];
        let tillHour = (this.tempOrderReduce[orderTypId][i].tillHour).split('T');
        order.globalParameters.endHour = tillHour[1];
        if(this.orderType==7)
        order.globalParameters.itemId = this.tempOrderReduce[orderTypId][i].itemId
        order.globalParameters.orderItemDetails = {} as ItemsByTypeOrder;
        order.globalParameters.orderItemDetails.name =this.tempOrderReduce[orderTypId][i].orderItemName;

        order.globalParameters.tempOrderIdentity = this.tempOrderReduce[orderTypId][i].tempOrderId;
        order.order.orderType.id= this.orderType;
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
        break;
    }
    this.orderType = event;
    if (event == 1 || event == 4 || event == 6 || event == 7) {
      this.mapTempOrder(event);
    }
    
  }

}
