import { Component, OnInit } from '@angular/core';
import { SquadAssembleService } from 'src/app/screens/order-tour/squad-assemble/services/squad-assemble.service';
import { TripModel, UserService } from 'src/app/open-api';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})

export class SummaryComponent implements OnInit {
  public activateIndex: number[] = [];
  // public examplePrice: number = 1000;
  tripId: number;
  tripDetails: TripModel;

  public PriceTotal: number;
  public PriceTotalVat: number;
  public totalPriceAfterKklSubsidy: number;

  public tableBodyTitles: Array<object>;

  constructor(private squadAssembleService: SquadAssembleService, private userService: UserService) { }

  ngOnInit(): void {
    this.tripId = this.squadAssembleService.tripInfofromService.trip.id;

    // this.tripId = 52973;
    // this.tripId = 52979;
    // this.tripId = 52970;
    // this.tripId = 52974;
    // this.tripId = 52975;
    // this.tripId = 52977;
    // this.tripId = 52990;
    // this.tripId = 52989;

    this.userService.getTripDetails(this.tripId).subscribe(TM => {
      this.tripDetails = TM;
      this.SetArrays();
    });
  }

  public SetArrays() {
    let tableBodyTitlesRaw = this.tripDetails.orderList.map(m => {
      return {
        id: m.order.orderType.id,
        name: m.order.orderType.name,
        amount: null,
        price: null,
        supplierCharge: null,
        customerBilling: null,
        orderList: this.tripDetails.orderList.filter(k => k.order.orderType.id == m.order.orderType.id).map(n => {
          return {
            date: n.globalParameters.startDate,
            supplier: n.order.supplier.name,
            item: n.globalParameters.orderItemDetails.name,
            comments: n.globalParameters.comments,
            amount: n.globalParameters.quantity,
            price: (n.globalParameters.itemCost == undefined) ? 0 : n.globalParameters.itemCost,
            supplierCharge: (n.globalParameters.billingSupplier == undefined) ? 0 : n.globalParameters.billingSupplier,
            customerBilling: (n.globalParameters.billingCustomer == undefined) ? 0 : n.globalParameters.billingCustomer,
            customerOrder: true
          }
        })
      }
    });

    this.tableBodyTitles = [...new Set(tableBodyTitlesRaw.map(obj => obj.id))]
      .map(id => { return tableBodyTitlesRaw.find(obj => obj.id === id) })
      .sort(function (a, b) { return a.id - b.id; });

    this.tableBodyTitles.map(n => {
      n["amount"] = n["orderList"].reduce((sum, current) => sum + ((current["amount"] == undefined) ? 0 : current["amount"]), 0),
        n["price"] = n["orderList"].reduce((sum, current) => sum + ((current["price"] == undefined) ? 0 : current["price"]), 0),
        n["supplierCharge"] = n["orderList"].reduce((sum, current) => sum + ((current["supplierCharge"] == undefined) ? 0 : current["supplierCharge"]), 0),
        n["customerBilling"] = n["orderList"].reduce((sum, current) => sum + ((current["customerBilling"] == undefined) ? 0 : current["customerBilling"]), 0)
    })

    this.PriceTotal = this.tableBodyTitles.reduce((sum, current) => sum + ((current["customerBilling"] == undefined) ? 0 : current["customerBilling"]), 0);
    this.PriceTotalVat = this.PriceTotal * 1.17;
    this.totalPriceAfterKklSubsidy = this.PriceTotalVat;
  }

  // open / close table
  public toggleItems(index: number) {
    if (this.activateIndex.includes(index)) {
      this.activateIndex = this.activateIndex.filter(item => item !== index);
    } else {
      this.activateIndex.push(index);
    }
  }
  // open / close all tables
  public toggleAllItems() {
    if (this.activateIndex.length !== this.tableBodyTitles.length) {
      for (let i = 0; i < this.tableBodyTitles.length; i++) {
        if (!this.activateIndex.includes(i)) {
          this.activateIndex.push(i);
        }
      }
    } else {
      this.activateIndex.length = 0;
    }
  }

  public mySwitch(n: number): any {
    // switch (n) {
    //   case 0:
    //     return this.activity;
    //   case 1:
    //     return this.transportation;
    //   case 2:
    //     return this.economy;
    // }
    return this.tableBodyTitles[n]["orderList"];
  }
  // public activity: Array<object> = [
  //   {
  //     date: '15.06.21', supplier: 'נס הרים', item: 'אירוח בקיתות למוסדות חינוך - אמצע שבוע', comments: 'לקוח מזמין',
  //     amount: 15, price: 870, supplierCharge: 680, customerBilling: 120, customerOrder: true
  //   },
  //   {
  //     date: '16.06.21', supplier: 'נס הרים', item: 'אירוח בקיתות למוסדות חינוך - אמצע שבוע', comments: 'לקוח מזמין',
  //     amount: 15, price: 870, supplierCharge: 680, customerBilling: 120, customerOrder: true
  //   },
  //   {
  //     date: '17.06.21', supplier: 'נס הרים', item: 'אירוח בקיתות למוסדות חינוך - אמצע שבוע', comments: 'לקוח מזמין',
  //     amount: 15, price: 870, supplierCharge: 680, customerBilling: 120, customerOrder: true
  //   }
  // ];
  // public transportation: Array<object> = [
  //   {
  //     date: '15.06.21', supplier: 'ספקים שונים', item: 'אוטובוס - יום מלא', comments: 'בית ספר תמיר - נס הרים',
  //     amount: 2, supplierCharge: 0, customerBilling: 7818, customerOrder: false
  //   },
  //   {
  //     date: '16.06.21', supplier: 'נס הרים', item: 'ניווט ביער -נס הרים', comments: 'לקוח מזמין',
  //     amount: 15, price: 870, supplierCharge: 680, customerBilling: 120, customerOrder: false
  //   }
  // ];
  // public economy: Array<object> = [
  //   {
  //     date: '15.06.21', supplier: 'שבולת בע"מ', item: 'ארוח בוקר בהגשה', comments: '',
  //     amount: 15, price: 870, supplierCharge: 680, customerBilling: 120, customerOrder: false
  //   },
  //   {
  //     date: '16.06.21', supplier: 'שבולת בע"מ', item: '150', comments: 'לקוח מזמין',
  //     amount: 150, price: 0, supplierCharge: 135, customerBilling: 1218, customerOrder: false
  //   }
  // ];

  // public tableBodyTitles: Array<object> = [
  //   { name: 'אירוח/פעילות', amount: 15, price: 2610, supplierCharge: 2040, customerBilling: 360 },
  //   { name: 'הסעים', amount: 8, price: 2610, supplierCharge: 2040, customerBilling: 360 },
  //   { name: 'כלכלה', amount: 3, price: 2610, supplierCharge: 2040, customerBilling: 360 }
  // ];

  public tableTitles: Array<object> = [
    { name: 'תאריך' },
    { name: 'ספק' },
    { name: 'פריט', width: '250px' },
    { name: 'הערות' },
    { name: 'כמות' },
    { name: 'מחיר' },
    { name: 'חיוב ספק' },
    { name: 'חיוב לקוח' },
    { icon: 'delete.svg' },
  ];
}

