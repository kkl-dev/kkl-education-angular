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
    // this.tripId = this.squadAssembleService.tripInfofromService.trip.id;

    // this.tripId = 52973;
    // this.tripId = 52979;
    // this.tripId = 52970;
    // this.tripId = 52974;
    // this.tripId = 52975;
    // this.tripId =52977;
    this.tripId = 52990;

    // this.tripDetails = this.JSON_OrderDetails;

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
            supplier: n.globalParameters.location,
            item: null,
            comments: n.globalParameters.comments,
            amount: n.globalParameters.quantity,
            price: n.globalParameters.itemCost,
            supplierCharge: n.order.totalPayCustomer,
            customerBilling: n.order.totalPaySupplier,
            customerOrder: true
          }
        })
      }
    });

    this.tableBodyTitles = [...new Set(tableBodyTitlesRaw.map(obj => obj.id))]
      .map(id => { return tableBodyTitlesRaw.find(obj => obj.id === id) })
      .sort(function (a, b) { return a.id - b.id; });

    this.tableBodyTitles.map(n => {
      n["amount"] = n["orderList"].reduce((sum, current) => sum + current["amount"], 0),
        n["price"] = n["orderList"].reduce((sum, current) => sum + current["price"], 0),
        n["supplierCharge"] = n["orderList"].reduce((sum, current) => sum + current["supplierCharge"], 0),
        n["customerBilling"] = n["orderList"].reduce((sum, current) => sum + current["customerBilling"], 0)
    })

    this.PriceTotal = this.tableBodyTitles.reduce((sum, current) => sum + current["customerBilling"], 0);
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

  public JSON_OrderDetails: any = {
    "orderList": [
      {
        "guideName": "יובל ברוכיאן",
        "order": {
          "tripId": 52979,
          "orderId": 1,
          "orderType": {
            "id": 6,
            "name": "הדרכה",
            "finOrderType": "Y0075"
          },
          "supplier": {
            "id": 414,
            "name": "שחר גל         ",
            "finId": null,
            "cityId": null,
            "supplierType": null,
            "isValid": null,
            "isGuideSupplier": null
          },
          "siteId": null,
          "sentToSupplier": "2021-01-18T15:11:00",
          "voucherNum": null,
          "cancelDate": "1900-01-01T00:00:00",
          "causeCancellation": "סיבת שינוי תאריכי הטיול: קורונה הטיול נדחה לתאריך: 24/01/2021",
          "cancelBy": "אסתי שמסיאב         ",
          "paidToSupplier": 1338.00,
          "openDate": "2021-01-18T15:10:00",
          "finOrderType": "Y0075",
          "budgetItem": null,
          "confirmDate": "2021-01-20T12:30:00",
          "confirmBy": "ניצן חורי",
          "confirmUserTz": 29971462,
          "confirmByUser": "דף לספק        ",
          "confirmCancelBy": "ניצן חורי",
          "confirmCancelDate": "2021-01-21T14:27:00",
          "confirmCancelUserTz": 2997146,
          "supplierProcedureNum": "3557/17/מפ",
          "totalPayCustomer": 1100.00,
          "totalPaySupplier": 1538.00,
          "totalPayAfterKklSubsidy": 0.00
        },
        "globalParameters": {
          "itemId": 248,
          "itemOrderRecordId": 1,
          "orderId": 1,
          "tempOrderIdentity": 0,
          "orderItemDetails": {
            "credit": null,
            "costVat": null,
            "isCustomerBilling": null,
            "isNight": null,
            "orderType": null,
            "isSumPeopleOrAmount": null,
            "groupTypeId": null,
            "typeSleepId": null,
            "customerId": null,
            "supplierId": null,
            "classroomTypeId": null,
            "isSmallRange": null,
            "amountLimit": null,
            "participantsLimit": null,
            "numSeat": null,
            "isMore": null
          },
          "supplierId": 414,
          "quantity": 1,
          "itemCost": 669.00,
          "billingSupplier": 669.00,
          "billingCustomer": 550.00,
          "peopleInTrip": 42,
          "location": "התיצבות- בכניסה של מבו מודיעים יש הכוונה",
          "startDate": "2021-01-24T00:00:00",
          "endDate": "2021-01-24T00:00:00",
          "startHour": "1900-01-01T09:30:00",
          "endHour": "1900-01-01T15:00:00",
          "comments": "",
          "internalComment": "",
          "openDate": "2021-01-18T15:10:00",
          "isVat": false,
          "userInfo": "רוני אוזן"
        }
      },
      {
        "guideName": "יגאל חן",
        "order": {
          "tripId": 52979,
          "orderId": 1,
          "orderType": {
            "id": 6,
            "name": "הדרכה",
            "finOrderType": "Y0075"
          },
          "supplier": {
            "id": 414,
            "name": "שחר גל         ",
            "finId": null,
            "cityId": null,
            "supplierType": null,
            "isValid": null,
            "isGuideSupplier": null
          },
          "siteId": null,
          "sentToSupplier": "2021-01-18T15:11:00",
          "voucherNum": null,
          "cancelDate": "1900-01-01T00:00:00",
          "causeCancellation": "סיבת שינוי תאריכי הטיול: קורונה הטיול נדחה לתאריך: 24/01/2021",
          "cancelBy": "אסתי שמסיאב         ",
          "paidToSupplier": 1338.00,
          "openDate": "2021-01-18T15:10:00",
          "finOrderType": "Y0075",
          "budgetItem": null,
          "confirmDate": "2021-01-20T12:30:00",
          "confirmBy": "ניצן חורי",
          "confirmUserTz": 29971462,
          "confirmByUser": "דף לספק        ",
          "confirmCancelBy": "ניצן חורי",
          "confirmCancelDate": "2021-01-21T14:27:00",
          "confirmCancelUserTz": 2997146,
          "supplierProcedureNum": "3557/17/מפ",
          "totalPayCustomer": 1100.00,
          "totalPaySupplier": 1538.00,
          "totalPayAfterKklSubsidy": 0.00
        },
        "globalParameters": {
          "itemId": 248,
          "itemOrderRecordId": 2,
          "orderId": 1,
          "tempOrderIdentity": 0,
          "orderItemDetails": {
            "credit": null,
            "costVat": null,
            "isCustomerBilling": null,
            "isNight": null,
            "orderType": null,
            "isSumPeopleOrAmount": null,
            "groupTypeId": null,
            "typeSleepId": null,
            "customerId": null,
            "supplierId": null,
            "classroomTypeId": null,
            "isSmallRange": null,
            "amountLimit": null,
            "participantsLimit": null,
            "numSeat": null,
            "isMore": null
          },
          "supplierId": 414,
          "quantity": 1,
          "itemCost": 669.00,
          "billingSupplier": 669.00,
          "billingCustomer": 550.00,
          "peopleInTrip": 42,
          "location": "התיצבות- בכניסה של מבו מודיעים יש הכוונה",
          "startDate": "2021-01-24T00:00:00",
          "endDate": "2021-01-24T00:00:00",
          "startHour": "1900-01-01T09:30:00",
          "endHour": "1900-01-01T15:00:00",
          "comments": "",
          "internalComment": "",
          "openDate": "2021-01-18T15:10:00",
          "isVat": false,
          "userInfo": "רוני אוזן"
        }
      },
      {
        "guideName": "יובל ברוכיאן",
        "order": {
          "tripId": 52979,
          "orderId": 1,
          "orderType": {
            "id": 6,
            "name": "הדרכה",
            "finOrderType": "Y0075"
          },
          "supplier": {
            "id": 414,
            "name": "שחר גל         ",
            "finId": null,
            "cityId": null,
            "supplierType": null,
            "isValid": null,
            "isGuideSupplier": null
          },
          "siteId": null,
          "sentToSupplier": "2021-01-18T15:11:00",
          "voucherNum": null,
          "cancelDate": "1900-01-01T00:00:00",
          "causeCancellation": "סיבת שינוי תאריכי הטיול: קורונה הטיול נדחה לתאריך: 24/01/2021",
          "cancelBy": "אסתי שמסיאב         ",
          "paidToSupplier": 1338.00,
          "openDate": "2021-01-18T15:10:00",
          "finOrderType": "Y0075",
          "budgetItem": null,
          "confirmDate": "2021-01-20T12:30:00",
          "confirmBy": "ניצן חורי",
          "confirmUserTz": 29971462,
          "confirmByUser": "דף לספק        ",
          "confirmCancelBy": "ניצן חורי",
          "confirmCancelDate": "2021-01-21T14:27:00",
          "confirmCancelUserTz": 2997146,
          "supplierProcedureNum": "3557/17/מפ",
          "totalPayCustomer": 1100.00,
          "totalPaySupplier": 1538.00,
          "totalPayAfterKklSubsidy": 0.00
        },
        "globalParameters": {
          "itemId": 455,
          "itemOrderRecordId": 3,
          "orderId": 1,
          "tempOrderIdentity": 0,
          "orderItemDetails": {
            "credit": null,
            "costVat": null,
            "isCustomerBilling": null,
            "isNight": null,
            "orderType": null,
            "isSumPeopleOrAmount": null,
            "groupTypeId": null,
            "typeSleepId": null,
            "customerId": null,
            "supplierId": null,
            "classroomTypeId": null,
            "isSmallRange": null,
            "amountLimit": null,
            "participantsLimit": null,
            "numSeat": null,
            "isMore": null
          },
          "supplierId": 414,
          "quantity": 1,
          "billingSupplier": 130.00,
          "billingCustomer": null,
          "peopleInTrip": 1,
          "startDate": "2021-01-24T00:00:00",
          "endDate": "2021-01-24T00:00:00",
          "startHour": "2021-01-24T00:00:00",
          "endHour": "2021-01-24T00:00:00",
          "openDate": "2021-01-19T09:08:00",
          "isVat": false,
          "userInfo": "אדיוסיסטמס בע\"מ"
        }
      },
      {
        "guideName": "יגאל חן",
        "order": {
          "tripId": 52979,
          "orderId": 1,
          "orderType": {
            "id": 6,
            "name": "הדרכה",
            "finOrderType": "Y0075"
          },
          "supplier": {
            "id": 414,
            "name": "שחר גל         ",
            "finId": null,
            "cityId": null,
            "supplierType": null,
            "isValid": null,
            "isGuideSupplier": null
          },
          "siteId": null,
          "sentToSupplier": "2021-01-18T15:11:00",
          "voucherNum": null,
          "cancelDate": "1900-01-01T00:00:00",
          "causeCancellation": "סיבת שינוי תאריכי הטיול: קורונה הטיול נדחה לתאריך: 24/01/2021",
          "cancelBy": "אסתי שמסיאב         ",
          "paidToSupplier": 1338.00,
          "openDate": "2021-01-18T15:10:00",
          "finOrderType": "Y0075",
          "budgetItem": null,
          "confirmDate": "2021-01-20T12:30:00",
          "confirmBy": "ניצן חורי",
          "confirmUserTz": 29971462,
          "confirmByUser": "דף לספק        ",
          "confirmCancelBy": "ניצן חורי",
          "confirmCancelDate": "2021-01-21T14:27:00",
          "confirmCancelUserTz": 2997146,
          "supplierProcedureNum": "3557/17/מפ",
          "totalPayCustomer": 1100.00,
          "totalPaySupplier": 1538.00,
          "totalPayAfterKklSubsidy": 0.00
        },
        "globalParameters": {
          "itemId": 455,
          "itemOrderRecordId": 4,
          "orderId": 1,
          "tempOrderIdentity": 0,
          "orderItemDetails": {
            "credit": null,
            "costVat": null,
            "isCustomerBilling": null,
            "isNight": null,
            "orderType": null,
            "isSumPeopleOrAmount": null,
            "groupTypeId": null,
            "typeSleepId": null,
            "customerId": null,
            "supplierId": null,
            "classroomTypeId": null,
            "isSmallRange": null,
            "amountLimit": null,
            "participantsLimit": null,
            "numSeat": null,
            "isMore": null
          },
          "supplierId": 414,
          "quantity": 1,
          "billingSupplier": 70.00,
          "billingCustomer": null,
          "peopleInTrip": 1,
          "startDate": "2021-01-24T00:00:00",
          "endDate": "2021-01-24T00:00:00",
          "startHour": "2021-01-24T00:00:00",
          "endHour": "2021-01-24T00:00:00",
          "openDate": "2021-01-20T12:30:00",
          "isVat": false,
          "userInfo": "אדיוסיסטמס בע\"מ"
        }
      },
      {
        "order": {
          "tripId": 52979,
          "orderId": 2,
          "orderType": {
            "id": 6,
            "name": "הדרכה"
          },
          "supplier": {
            "id": 414,
            "name": "שחר גל         ",
            "finId": null,
            "cityId": null,
            "supplierType": null,
            "isValid": null,
            "isGuideSupplier": null
          },
          "siteId": null,
          "sentToSupplier": null,
          "voucherNum": null,
          "cancelDate": "2021-02-11T09:35:00",
          "causeCancellation": "קורונה",
          "cancelBy": "אסתי שמסיאב         ",
          "paidToSupplier": 1338.00,
          "openDate": "2021-01-21T14:15:00",
          "budgetItem": null,
          "confirmDate": null,
          "confirmUserTz": null,
          "confirmCancelDate": null,
          "confirmCancelUserTz": null,
          "totalPayCustomer": 1100.00,
          "totalPaySupplier": 1338.00,
          "totalPayAfterKklSubsidy": 0.00
        },
        "globalParameters": {
          "itemId": 248,
          "itemOrderRecordId": 1,
          "orderId": 2,
          "tempOrderIdentity": 0,
          "orderItemDetails": {
            "credit": null,
            "costVat": null,
            "isCustomerBilling": null,
            "isNight": null,
            "orderType": null,
            "isSumPeopleOrAmount": null,
            "groupTypeId": null,
            "typeSleepId": null,
            "customerId": null,
            "supplierId": null,
            "classroomTypeId": null,
            "isSmallRange": null,
            "amountLimit": null,
            "participantsLimit": null,
            "numSeat": null,
            "isMore": null
          },
          "supplierId": 414,
          "quantity": 1,
          "billingSupplier": 669.00,
          "billingCustomer": 550.00,
          "peopleInTrip": 42,
          "location": "התיצבות- בכניסה של מבו מודיעים יש הכוונה",
          "startDate": "2020-02-01T00:00:00",
          "endDate": "2020-02-01T00:00:00",
          "startHour": "1900-01-01T09:30:00",
          "endHour": "1900-01-01T15:00:00",
          "comments": "",
          "internalComment": "",
          "openDate": "2021-01-21T14:15:00",
          "isVat": false,
          "userInfo": "אסתי שמסיאב"
        }
      },
      {
        "order": {
          "tripId": 52979,
          "orderId": 2,
          "orderType": {
            "id": 6,
            "name": "הדרכה"
          },
          "supplier": {
            "id": 414,
            "name": "שחר גל         ",
            "finId": null,
            "cityId": null,
            "supplierType": null,
            "isValid": null,
            "isGuideSupplier": null
          },
          "siteId": null,
          "sentToSupplier": null,
          "voucherNum": null,
          "cancelDate": "2021-02-11T09:35:00",
          "causeCancellation": "קורונה",
          "cancelBy": "אסתי שמסיאב         ",
          "paidToSupplier": 1338.00,
          "openDate": "2021-01-21T14:15:00",
          "budgetItem": null,
          "confirmDate": null,
          "confirmUserTz": null,
          "confirmCancelDate": null,
          "confirmCancelUserTz": null,
          "totalPayCustomer": 1100.00,
          "totalPaySupplier": 1338.00,
          "totalPayAfterKklSubsidy": 0.00
        },
        "globalParameters": {
          "itemId": 248,
          "itemOrderRecordId": 2,
          "orderId": 2,
          "tempOrderIdentity": 0,
          "orderItemDetails": {
            "credit": null,
            "costVat": null,
            "isCustomerBilling": null,
            "isNight": null,
            "orderType": null,
            "isSumPeopleOrAmount": null,
            "groupTypeId": null,
            "typeSleepId": null,
            "customerId": null,
            "supplierId": null,
            "classroomTypeId": null,
            "isSmallRange": null,
            "amountLimit": null,
            "participantsLimit": null,
            "numSeat": null,
            "isMore": null
          },
          "supplierId": 414,
          "quantity": 1,
          "billingSupplier": 669.00,
          "billingCustomer": 550.00,
          "peopleInTrip": 42,
          "location": "התיצבות- בכניסה של מבו מודיעים יש הכוונה",
          "startDate": "2020-02-01T00:00:00",
          "endDate": "2020-02-01T00:00:00",
          "startHour": "1900-01-01T09:30:00",
          "endHour": "1900-01-01T15:00:00",
          "comments": "",
          "internalComment": "",
          "openDate": "2021-01-21T14:15:00",
          "isVat": false,
          "userInfo": "אסתי שמסיאב"
        }
      },
      {
        "scatterLocation": "כנל",
        "order": {
          "tripId": 52979,
          "orderId": 3,
          "orderType": {
            "id": 1,
            "name": "היסעים",
            "finOrderType": "Y0076"
          },
          "supplier": {
            "id": 356,
            "name": "נעמי כהן       ",
            "finId": null,
            "cityId": null,
            "supplierType": null,
            "isValid": null,
            "isGuideSupplier": null
          },
          "comment": "\rאזור הטיול: שפלת יהודה הרי יהודה ושומרון",
          "siteId": null,
          "sentToSupplier": "2021-05-06T10:17:00",
          "voucherNum": null,
          "cancelDate": "2020-11-08T11:23:00",
          "causeCancellation": "הטיול הוקפא אוטומטית שבוע לפני תאריך הטיול כיוון שלא היתה חתימת לקוח",
          "cancelBy": "אפליקציה יומית      ",
          "paidToSupplier": 7107.00,
          "openDate": "2021-05-02T15:03:00",
          "finOrderType": "Y0076",
          "budgetItem": null,
          "confirmDate": "2021-05-06T10:27:00",
          "confirmBy": "טל",
          "confirmUserTz": null,
          "confirmByUser": "אסתי שמסיאב    ",
          "confirmCancelDate": null,
          "confirmCancelUserTz": null,
          "supplierProcedureNum": "99",
          "totalPayCustomer": 7818.00,
          "totalPaySupplier": 7107.00,
          "totalPayAfterKklSubsidy": 3909.00
        },
        "globalParameters": {
          "itemId": 1032,
          "itemOrderRecordId": 1,
          "orderId": 3,
          "tempOrderIdentity": 0,
          "orderItemDetails": {
            "credit": null,
            "costVat": null,
            "isCustomerBilling": null,
            "isNight": null,
            "orderType": null,
            "isSumPeopleOrAmount": null,
            "groupTypeId": null,
            "typeSleepId": null,
            "customerId": null,
            "supplierId": null,
            "classroomTypeId": null,
            "isSmallRange": null,
            "amountLimit": null,
            "participantsLimit": null,
            "numSeat": null,
            "isMore": null
          },
          "supplierId": 356,
          "quantity": 1,
          "itemCost": 2369.00,
          "billingSupplier": 2369.00,
          "billingCustomer": 2606.00,
          "peopleInTrip": 103,
          "location": "נחל קישון 46 רמת בית שמש א' ",
          "startDate": "2021-05-11T00:00:00",
          "endDate": "2021-05-11T00:00:00",
          "startHour": "1900-01-01T08:00:00",
          "endHour": "1900-01-01T20:30:00",
          "comments": "עלות הפריט: 2,606\rסך כמות לחיוב: 1\rסך ימי פעילות: 1\rמכפלת החיוב : 1*2,606*1",
          "internalComment": "עלות הפריט: 2,606\rסך כמות לחיוב: 1\rסך ימי פעילות: 1\rמכפלת החיוב : 1*2,606*1",
          "openDate": "2021-05-02T15:03:00",
          "isVat": true,
          "userInfo": "הדר אברהמי"
        }
      },
      {
        "scatterLocation": "כנ\"ל",
        "order": {
          "tripId": 52979,
          "orderId": 3,
          "orderType": {
            "id": 1,
            "name": "היסעים",
            "finOrderType": "Y0076"
          },
          "supplier": {
            "id": 356,
            "name": "נעמי כהן       ",
            "finId": null,
            "cityId": null,
            "supplierType": null,
            "isValid": null,
            "isGuideSupplier": null
          },
          "comment": "\rאזור הטיול: שפלת יהודה הרי יהודה ושומרון",
          "siteId": null,
          "sentToSupplier": "2021-05-06T10:17:00",
          "voucherNum": null,
          "cancelDate": "2020-11-08T11:23:00",
          "causeCancellation": "הטיול הוקפא אוטומטית שבוע לפני תאריך הטיול כיוון שלא היתה חתימת לקוח",
          "cancelBy": "אפליקציה יומית      ",
          "paidToSupplier": 7107.00,
          "openDate": "2021-05-02T15:03:00",
          "finOrderType": "Y0076",
          "budgetItem": null,
          "confirmDate": "2021-05-06T10:27:00",
          "confirmBy": "טל",
          "confirmUserTz": null,
          "confirmByUser": "אסתי שמסיאב    ",
          "confirmCancelDate": null,
          "confirmCancelUserTz": null,
          "supplierProcedureNum": "99",
          "totalPayCustomer": 7818.00,
          "totalPaySupplier": 7107.00,
          "totalPayAfterKklSubsidy": 3909.00
        },
        "globalParameters": {
          "itemId": 1032,
          "itemOrderRecordId": 2,
          "orderId": 3,
          "tempOrderIdentity": 0,
          "orderItemDetails": {
            "credit": null,
            "costVat": null,
            "isCustomerBilling": null,
            "isNight": null,
            "orderType": null,
            "isSumPeopleOrAmount": null,
            "groupTypeId": null,
            "typeSleepId": null,
            "customerId": null,
            "supplierId": null,
            "classroomTypeId": null,
            "isSmallRange": null,
            "amountLimit": null,
            "participantsLimit": null,
            "numSeat": null,
            "isMore": null
          },
          "supplierId": 356,
          "quantity": 1,
          "itemCost": 2369.00,
          "billingSupplier": 2369.00,
          "billingCustomer": 2606.00,
          "peopleInTrip": 103,
          "location": "ירושלים המ\"ג 4",
          "startDate": "2021-05-11T00:00:00",
          "endDate": "2021-05-11T00:00:00",
          "startHour": "1900-01-01T08:30:00",
          "endHour": "1900-01-01T20:30:00",
          "comments": "עלות הפריט: 2,606\rסך כמות לחיוב: 1\rסך ימי פעילות: 1\rמכפלת החיוב : 1*2,606*1",
          "internalComment": "עלות הפריט: 2,606\rסך כמות לחיוב: 1\rסך ימי פעילות: 1\rמכפלת החיוב : 1*2,606*1",
          "openDate": "2021-05-02T15:09:00",
          "isVat": true,
          "userInfo": "הדר אברהמי"
        }
      },
      {
        "scatterLocation": "כנ\"ל",
        "order": {
          "tripId": 52979,
          "orderId": 3,
          "orderType": {
            "id": 1,
            "name": "היסעים",
            "finOrderType": "Y0076"
          },
          "supplier": {
            "id": 356,
            "name": "נעמי כהן       ",
            "finId": null,
            "cityId": null,
            "supplierType": null,
            "isValid": null,
            "isGuideSupplier": null
          },
          "comment": "\rאזור הטיול: שפלת יהודה הרי יהודה ושומרון",
          "siteId": null,
          "sentToSupplier": "2021-05-06T10:17:00",
          "voucherNum": null,
          "cancelDate": "2020-11-08T11:23:00",
          "causeCancellation": "הטיול הוקפא אוטומטית שבוע לפני תאריך הטיול כיוון שלא היתה חתימת לקוח",
          "cancelBy": "אפליקציה יומית      ",
          "paidToSupplier": 7107.00,
          "openDate": "2021-05-02T15:03:00",
          "finOrderType": "Y0076",
          "budgetItem": null,
          "confirmDate": "2021-05-06T10:27:00",
          "confirmBy": "טל",
          "confirmUserTz": null,
          "confirmByUser": "אסתי שמסיאב    ",
          "confirmCancelDate": null,
          "confirmCancelUserTz": null,
          "supplierProcedureNum": "99",
          "totalPayCustomer": 7818.00,
          "totalPaySupplier": 7107.00,
          "totalPayAfterKklSubsidy": 3909.00
        },
        "globalParameters": {
          "itemId": 1032,
          "itemOrderRecordId": 3,
          "orderId": 3,
          "tempOrderIdentity": 0,
          "orderItemDetails": {
            "credit": null,
            "costVat": null,
            "isCustomerBilling": null,
            "isNight": null,
            "orderType": null,
            "isSumPeopleOrAmount": null,
            "groupTypeId": null,
            "typeSleepId": null,
            "customerId": null,
            "supplierId": null,
            "classroomTypeId": null,
            "isSmallRange": null,
            "amountLimit": null,
            "participantsLimit": null,
            "numSeat": null,
            "isMore": null
          },
          "supplierId": 356,
          "quantity": 1,
          "itemCost": 2369.00,
          "billingSupplier": 2369.00,
          "billingCustomer": 2606.00,
          "peopleInTrip": 103,
          "location": "רבי עקיבא 30 ביתר עילית בתחנה ליד בניין העירייה",
          "startDate": "2021-05-11T00:00:00",
          "endDate": "2021-05-11T00:00:00",
          "startHour": "1900-01-01T08:30:00",
          "endHour": "1900-01-01T20:30:00",
          "comments": "עלות הפריט: 2,606\rסך כמות לחיוב: 1\rסך ימי פעילות: 1\rמכפלת החיוב : 1*2,606*1",
          "internalComment": "עלות הפריט: 2,606\rסך כמות לחיוב: 1\rסך ימי פעילות: 1\rמכפלת החיוב : 1*2,606*1",
          "openDate": "2021-05-02T15:10:00",
          "isVat": true,
          "userInfo": "הדר אברהמי"
        }
      },
      {
        "order": {
          "tripId": 52979,
          "orderId": 4,
          "orderType": {
            "id": 6,
            "name": "הדרכה",
            "finOrderType": "Y0075"
          },
          "supplier": {
            "id": 414,
            "name": "שחר גל         ",
            "finId": null,
            "cityId": null,
            "supplierType": null,
            "isValid": null,
            "isGuideSupplier": null
          },
          "comment": "מדריכות חרדיות - תנסה את מרים בן דוד, נחמה כהן, ענת סעדה, יהודית, בת שבע, בתיה",
          "siteId": null,
          "sentToSupplier": "2021-05-03T13:01:00",
          "voucherNum": null,
          "cancelDate": "2020-11-08T11:23:00",
          "causeCancellation": "הטיול הוקפא אוטומטית שבוע לפני תאריך הטיול כיוון שלא היתה חתימת לקוח",
          "cancelBy": "אפליקציה יומית      ",
          "paidToSupplier": 2062.00,
          "openDate": "2021-05-03T09:27:00",
          "finOrderType": "Y0075",
          "budgetItem": null,
          "confirmDate": null,
          "confirmUserTz": null,
          "confirmCancelBy": "ניצן חורי",
          "confirmCancelDate": "2021-05-05T10:06:00",
          "confirmCancelUserTz": 29971462,
          "supplierProcedureNum": "3557/17/מפ",
          "totalPayCustomer": 1650.00,
          "totalPaySupplier": 2062.00,
          "totalPayAfterKklSubsidy": 0.00
        },
        "globalParameters": {
          "itemId": 248,
          "itemOrderRecordId": 1,
          "orderId": 4,
          "tempOrderIdentity": 0,
          "orderItemDetails": {
            "credit": null,
            "costVat": null,
            "isCustomerBilling": null,
            "isNight": null,
            "orderType": null,
            "isSumPeopleOrAmount": null,
            "groupTypeId": null,
            "typeSleepId": null,
            "customerId": null,
            "supplierId": null,
            "classroomTypeId": null,
            "isSmallRange": null,
            "amountLimit": null,
            "participantsLimit": null,
            "numSeat": null,
            "isMore": null
          },
          "supplierId": 414,
          "quantity": 1,
          "itemCost": 669.00,
          "billingSupplier": 669.00,
          "billingCustomer": 550.00,
          "peopleInTrip": 103,
          "location": "התיצבות- בכניסה של מבו מודיעים יש הכוונה",
          "startDate": "2021-05-11T00:00:00",
          "endDate": "2021-05-11T00:00:00",
          "startHour": "1900-01-01T09:30:00",
          "endHour": "1900-01-01T15:00:00",
          "comments": "",
          "internalComment": "",
          "openDate": "2021-05-03T09:27:00",
          "isVat": false,
          "userInfo": "גילי גן אור"
        }
      },
      {
        "order": {
          "tripId": 52979,
          "orderId": 4,
          "orderType": {
            "id": 6,
            "name": "הדרכה",
            "finOrderType": "Y0075"
          },
          "supplier": {
            "id": 414,
            "name": "שחר גל         ",
            "finId": null,
            "cityId": null,
            "supplierType": null,
            "isValid": null,
            "isGuideSupplier": null
          },
          "comment": "מדריכות חרדיות - תנסה את מרים בן דוד, נחמה כהן, ענת סעדה, יהודית, בת שבע, בתיה",
          "siteId": null,
          "sentToSupplier": "2021-05-03T13:01:00",
          "voucherNum": null,
          "cancelDate": "2020-11-08T11:23:00",
          "causeCancellation": "הטיול הוקפא אוטומטית שבוע לפני תאריך הטיול כיוון שלא היתה חתימת לקוח",
          "cancelBy": "אפליקציה יומית      ",
          "paidToSupplier": 2062.00,
          "openDate": "2021-05-03T09:27:00",
          "finOrderType": "Y0075",
          "budgetItem": null,
          "confirmDate": null,
          "confirmUserTz": null,
          "confirmCancelBy": "ניצן חורי",
          "confirmCancelDate": "2021-05-05T10:06:00",
          "confirmCancelUserTz": 29971462,
          "supplierProcedureNum": "3557/17/מפ",
          "totalPayCustomer": 1650.00,
          "totalPaySupplier": 2062.00,
          "totalPayAfterKklSubsidy": 0.00
        },
        "globalParameters": {
          "itemId": 248,
          "itemOrderRecordId": 2,
          "orderId": 4,
          "tempOrderIdentity": 0,
          "orderItemDetails": {
            "credit": null,
            "costVat": null,
            "isCustomerBilling": null,
            "isNight": null,
            "orderType": null,
            "isSumPeopleOrAmount": null,
            "groupTypeId": null,
            "typeSleepId": null,
            "customerId": null,
            "supplierId": null,
            "classroomTypeId": null,
            "isSmallRange": null,
            "amountLimit": null,
            "participantsLimit": null,
            "numSeat": null,
            "isMore": null
          },
          "supplierId": 414,
          "quantity": 1,
          "itemCost": 669.00,
          "billingSupplier": 669.00,
          "billingCustomer": 550.00,
          "peopleInTrip": 103,
          "location": "התיצבות- בכניסה של מבו מודיעים יש הכוונה",
          "startDate": "2021-05-11T00:00:00",
          "endDate": "2021-05-11T00:00:00",
          "startHour": "1900-01-01T09:30:00",
          "endHour": "1900-01-01T15:00:00",
          "comments": "",
          "internalComment": "",
          "openDate": "2021-05-03T09:27:00",
          "isVat": false,
          "userInfo": "גילי גן אור"
        }
      },
      {
        "order": {
          "tripId": 52979,
          "orderId": 4,
          "orderType": {
            "id": 6,
            "name": "הדרכה",
            "finOrderType": "Y0075"
          },
          "supplier": {
            "id": 414,
            "name": "שחר גל         ",
            "finId": null,
            "cityId": null,
            "supplierType": null,
            "isValid": null,
            "isGuideSupplier": null
          },
          "comment": "מדריכות חרדיות - תנסה את מרים בן דוד, נחמה כהן, ענת סעדה, יהודית, בת שבע, בתיה",
          "siteId": null,
          "sentToSupplier": "2021-05-03T13:01:00",
          "voucherNum": null,
          "cancelDate": "2020-11-08T11:23:00",
          "causeCancellation": "הטיול הוקפא אוטומטית שבוע לפני תאריך הטיול כיוון שלא היתה חתימת לקוח",
          "cancelBy": "אפליקציה יומית      ",
          "paidToSupplier": 2062.00,
          "openDate": "2021-05-03T09:27:00",
          "finOrderType": "Y0075",
          "budgetItem": null,
          "confirmDate": null,
          "confirmUserTz": null,
          "confirmCancelBy": "ניצן חורי",
          "confirmCancelDate": "2021-05-05T10:06:00",
          "confirmCancelUserTz": 29971462,
          "supplierProcedureNum": "3557/17/מפ",
          "totalPayCustomer": 1650.00,
          "totalPaySupplier": 2062.00,
          "totalPayAfterKklSubsidy": 0.00
        },
        "globalParameters": {
          "itemId": 248,
          "itemOrderRecordId": 3,
          "orderId": 4,
          "tempOrderIdentity": 0,
          "orderItemDetails": {
            "credit": null,
            "costVat": null,
            "isCustomerBilling": null,
            "isNight": null,
            "orderType": null,
            "isSumPeopleOrAmount": null,
            "groupTypeId": null,
            "typeSleepId": null,
            "customerId": null,
            "supplierId": null,
            "classroomTypeId": null,
            "isSmallRange": null,
            "amountLimit": null,
            "participantsLimit": null,
            "numSeat": null,
            "isMore": null
          },
          "supplierId": 414,
          "quantity": 1,
          "itemCost": 669.00,
          "billingSupplier": 669.00,
          "billingCustomer": 550.00,
          "peopleInTrip": 103,
          "location": "התיצבות- בכניסה של מבו מודיעים יש הכוונה",
          "startDate": "2021-05-11T00:00:00",
          "endDate": "2021-05-11T00:00:00",
          "startHour": "1900-01-01T09:30:00",
          "endHour": "1900-01-01T15:00:00",
          "comments": "",
          "internalComment": "",
          "openDate": "2021-05-03T09:27:00",
          "isVat": false,
          "userInfo": "גילי גן אור"
        }
      },
      {
        "order": {
          "tripId": 52979,
          "orderId": 4,
          "orderType": {
            "id": 6,
            "name": "הדרכה",
            "finOrderType": "Y0075"
          },
          "supplier": {
            "id": 414,
            "name": "שחר גל         ",
            "finId": null,
            "cityId": null,
            "supplierType": null,
            "isValid": null,
            "isGuideSupplier": null
          },
          "comment": "מדריכות חרדיות - תנסה את מרים בן דוד, נחמה כהן, ענת סעדה, יהודית, בת שבע, בתיה",
          "siteId": null,
          "sentToSupplier": "2021-05-03T13:01:00",
          "voucherNum": null,
          "cancelDate": "2020-11-08T11:23:00",
          "causeCancellation": "הטיול הוקפא אוטומטית שבוע לפני תאריך הטיול כיוון שלא היתה חתימת לקוח",
          "cancelBy": "אפליקציה יומית      ",
          "paidToSupplier": 2062.00,
          "openDate": "2021-05-03T09:27:00",
          "finOrderType": "Y0075",
          "budgetItem": null,
          "confirmDate": null,
          "confirmUserTz": null,
          "confirmCancelBy": "ניצן חורי",
          "confirmCancelDate": "2021-05-05T10:06:00",
          "confirmCancelUserTz": 29971462,
          "supplierProcedureNum": "3557/17/מפ",
          "totalPayCustomer": 1650.00,
          "totalPaySupplier": 2062.00,
          "totalPayAfterKklSubsidy": 0.00
        },
        "globalParameters": {
          "itemId": 234,
          "itemOrderRecordId": 4,
          "orderId": 4,
          "tempOrderIdentity": 0,
          "orderItemDetails": {
            "credit": null,
            "costVat": null,
            "isCustomerBilling": null,
            "isNight": null,
            "orderType": null,
            "isSumPeopleOrAmount": null,
            "groupTypeId": null,
            "typeSleepId": null,
            "customerId": null,
            "supplierId": null,
            "classroomTypeId": null,
            "isSmallRange": null,
            "amountLimit": null,
            "participantsLimit": null,
            "numSeat": null,
            "isMore": null
          },
          "supplierId": 414,
          "quantity": 1,
          "itemCost": 55.00,
          "billingSupplier": 55.00,
          "billingCustomer": null,
          "peopleInTrip": 103,
          "location": "התיצבות- בכניסה של מבו מודיעים יש הכוונה",
          "startDate": "2021-05-11T00:00:00",
          "endDate": "2021-05-11T00:00:00",
          "startHour": "1900-01-01T09:30:00",
          "endHour": "1900-01-01T15:00:00",
          "comments": "",
          "internalComment": "",
          "openDate": "2021-05-03T09:27:00",
          "isVat": false,
          "userInfo": "גילי גן אור"
        }
      },
      {
        "guideName": "מרים בן דוד ",
        "order": {
          "tripId": 52979,
          "orderId": 5,
          "orderType": {
            "id": 6,
            "name": "הדרכה",
            "finOrderType": "Y0075"
          },
          "supplier": {
            "id": 171,
            "name": "שחר גל         ",
            "finId": null,
            "cityId": null,
            "supplierType": null,
            "isValid": null,
            "isGuideSupplier": null
          },
          "comment": "מדריכות חרדיות",
          "siteId": null,
          "sentToSupplier": "2021-05-09T09:41:00",
          "voucherNum": null,
          "cancelDate": null,
          "paidToSupplier": 1821.00,
          "openDate": "2021-05-05T16:08:00",
          "finOrderType": "Y0075",
          "budgetItem": null,
          "confirmDate": "2021-05-10T13:51:00",
          "confirmBy": "מעין ארד",
          "confirmUserTz": 43464601,
          "confirmByUser": "דף לספק        ",
          "confirmCancelDate": null,
          "confirmCancelUserTz": null,
          "supplierProcedureNum": "145/20/פ",
          "totalPayCustomer": 1650.00,
          "totalPaySupplier": 1949.22,
          "totalPayAfterKklSubsidy": 1320.00
        },
        "globalParameters": {
          "itemId": 693,
          "itemOrderRecordId": 1,
          "orderId": 5,
          "tempOrderIdentity": 0,
          "orderItemDetails": {
            "credit": null,
            "costVat": null,
            "isCustomerBilling": null,
            "isNight": null,
            "orderType": null,
            "isSumPeopleOrAmount": null,
            "groupTypeId": null,
            "typeSleepId": null,
            "customerId": null,
            "supplierId": null,
            "classroomTypeId": null,
            "isSmallRange": null,
            "amountLimit": null,
            "participantsLimit": null,
            "numSeat": null,
            "isMore": null
          },
          "supplierId": 171,
          "quantity": 1,
          "itemCost": 606.84,
          "billingSupplier": 607.00,
          "billingCustomer": 550.00,
          "peopleInTrip": 103,
          "location": "התיצבות- ביתר עילית, בית שמש וירושלים",
          "startDate": "2021-05-11T00:00:00",
          "endDate": "2021-05-11T00:00:00",
          "startHour": "1900-01-01T08:30:00",
          "endHour": "1900-01-01T20:30:00",
          "comments": "",
          "internalComment": "",
          "openDate": "2021-05-05T16:08:00",
          "isVat": false,
          "userInfo": "שלגית היימן"
        }
      },
      {
        "guideName": "ענת סעדה ",
        "order": {
          "tripId": 52979,
          "orderId": 5,
          "orderType": {
            "id": 6,
            "name": "הדרכה",
            "finOrderType": "Y0075"
          },
          "supplier": {
            "id": 171,
            "name": "שחר גל         ",
            "finId": null,
            "cityId": null,
            "supplierType": null,
            "isValid": null,
            "isGuideSupplier": null
          },
          "comment": "מדריכות חרדיות",
          "siteId": null,
          "sentToSupplier": "2021-05-09T09:41:00",
          "voucherNum": null,
          "cancelDate": null,
          "paidToSupplier": 1821.00,
          "openDate": "2021-05-05T16:08:00",
          "finOrderType": "Y0075",
          "budgetItem": null,
          "confirmDate": "2021-05-10T13:51:00",
          "confirmBy": "מעין ארד",
          "confirmUserTz": 43464601,
          "confirmByUser": "דף לספק        ",
          "confirmCancelDate": null,
          "confirmCancelUserTz": null,
          "supplierProcedureNum": "145/20/פ",
          "totalPayCustomer": 1650.00,
          "totalPaySupplier": 1949.22,
          "totalPayAfterKklSubsidy": 1320.00
        },
        "globalParameters": {
          "itemId": 693,
          "itemOrderRecordId": 2,
          "orderId": 5,
          "tempOrderIdentity": 0,
          "orderItemDetails": {
            "credit": null,
            "costVat": null,
            "isCustomerBilling": null,
            "isNight": null,
            "orderType": null,
            "isSumPeopleOrAmount": null,
            "groupTypeId": null,
            "typeSleepId": null,
            "customerId": null,
            "supplierId": null,
            "classroomTypeId": null,
            "isSmallRange": null,
            "amountLimit": null,
            "participantsLimit": null,
            "numSeat": null,
            "isMore": null
          },
          "supplierId": 171,
          "quantity": 1,
          "itemCost": 606.84,
          "billingSupplier": 607.00,
          "billingCustomer": 550.00,
          "peopleInTrip": 103,
          "location": "התיצבות- ביתר עילית, בית שמש וירושלים",
          "startDate": "2021-05-11T00:00:00",
          "endDate": "2021-05-11T00:00:00",
          "startHour": "1900-01-01T08:30:00",
          "endHour": "1900-01-01T20:30:00",
          "comments": "",
          "internalComment": "",
          "openDate": "2021-05-05T16:08:00",
          "isVat": false,
          "userInfo": "שלגית היימן"
        }
      },
      {
        "guideName": "עדינה בינשטוק",
        "order": {
          "tripId": 52979,
          "orderId": 5,
          "orderType": {
            "id": 6,
            "name": "הדרכה",
            "finOrderType": "Y0075"
          },
          "supplier": {
            "id": 171,
            "name": "שחר גל         ",
            "finId": null,
            "cityId": null,
            "supplierType": null,
            "isValid": null,
            "isGuideSupplier": null
          },
          "comment": "מדריכות חרדיות",
          "siteId": null,
          "sentToSupplier": "2021-05-09T09:41:00",
          "voucherNum": null,
          "cancelDate": null,
          "paidToSupplier": 1821.00,
          "openDate": "2021-05-05T16:08:00",
          "finOrderType": "Y0075",
          "budgetItem": null,
          "confirmDate": "2021-05-10T13:51:00",
          "confirmBy": "מעין ארד",
          "confirmUserTz": 43464601,
          "confirmByUser": "דף לספק        ",
          "confirmCancelDate": null,
          "confirmCancelUserTz": null,
          "supplierProcedureNum": "145/20/פ",
          "totalPayCustomer": 1650.00,
          "totalPaySupplier": 1949.22,
          "totalPayAfterKklSubsidy": 1320.00
        },
        "globalParameters": {
          "itemId": 248,
          "itemOrderRecordId": 3,
          "orderId": 5,
          "tempOrderIdentity": 0,
          "orderItemDetails": {
            "credit": null,
            "costVat": null,
            "isCustomerBilling": null,
            "isNight": null,
            "orderType": null,
            "isSumPeopleOrAmount": null,
            "groupTypeId": null,
            "typeSleepId": null,
            "customerId": null,
            "supplierId": null,
            "classroomTypeId": null,
            "isSmallRange": null,
            "amountLimit": null,
            "participantsLimit": null,
            "numSeat": null,
            "isMore": null
          },
          "supplierId": 171,
          "quantity": 1,
          "itemCost": 606.84,
          "billingSupplier": 607.00,
          "billingCustomer": 550.00,
          "peopleInTrip": 103,
          "location": "התיצבות- ביתר עילית, בית שמש וירושלים",
          "startDate": "2021-05-11T00:00:00",
          "endDate": "2021-05-11T00:00:00",
          "startHour": "1900-01-01T08:30:00",
          "endHour": "1900-01-01T20:30:00",
          "comments": "",
          "internalComment": "",
          "openDate": "2021-05-05T16:09:00",
          "isVat": false,
          "userInfo": "שלגית היימן"
        }
      },
      {
        "guideName": "מרים בן דוד ",
        "order": {
          "tripId": 52979,
          "orderId": 5,
          "orderType": {
            "id": 6,
            "name": "הדרכה",
            "finOrderType": "Y0075"
          },
          "supplier": {
            "id": 171,
            "name": "שחר גל         ",
            "finId": null,
            "cityId": null,
            "supplierType": null,
            "isValid": null,
            "isGuideSupplier": null
          },
          "comment": "מדריכות חרדיות",
          "siteId": null,
          "sentToSupplier": "2021-05-09T09:41:00",
          "voucherNum": null,
          "cancelDate": null,
          "paidToSupplier": 1821.00,
          "openDate": "2021-05-05T16:08:00",
          "finOrderType": "Y0075",
          "budgetItem": null,
          "confirmDate": "2021-05-10T13:51:00",
          "confirmBy": "מעין ארד",
          "confirmUserTz": 43464601,
          "confirmByUser": "דף לספק        ",
          "confirmCancelDate": null,
          "confirmCancelUserTz": null,
          "supplierProcedureNum": "145/20/פ",
          "totalPayCustomer": 1650.00,
          "totalPaySupplier": 1949.22,
          "totalPayAfterKklSubsidy": 1320.00
        },
        "globalParameters": {
          "itemId": 455,
          "itemOrderRecordId": 4,
          "orderId": 5,
          "tempOrderIdentity": 0,
          "orderItemDetails": {
            "credit": null,
            "costVat": null,
            "isCustomerBilling": null,
            "isNight": null,
            "orderType": null,
            "isSumPeopleOrAmount": null,
            "groupTypeId": null,
            "typeSleepId": null,
            "customerId": null,
            "supplierId": null,
            "classroomTypeId": null,
            "isSmallRange": null,
            "amountLimit": null,
            "participantsLimit": null,
            "numSeat": null,
            "isMore": null
          },
          "supplierId": 171,
          "quantity": 1,
          "billingSupplier": 42.74,
          "billingCustomer": null,
          "peopleInTrip": 1,
          "startDate": "2021-05-11T00:00:00",
          "endDate": "2021-05-11T00:00:00",
          "startHour": "2021-05-11T00:00:00",
          "endHour": "2021-05-11T00:00:00",
          "openDate": "2021-05-09T10:12:00",
          "isVat": false,
          "userInfo": "מרכז סיור ולימו"
        }
      },
      {
        "guideName": "ענת סעדה ",
        "order": {
          "tripId": 52979,
          "orderId": 5,
          "orderType": {
            "id": 6,
            "name": "הדרכה",
            "finOrderType": "Y0075"
          },
          "supplier": {
            "id": 171,
            "name": "שחר גל         ",
            "finId": null,
            "cityId": null,
            "supplierType": null,
            "isValid": null,
            "isGuideSupplier": null
          },
          "comment": "מדריכות חרדיות",
          "siteId": null,
          "sentToSupplier": "2021-05-09T09:41:00",
          "voucherNum": null,
          "cancelDate": null,
          "paidToSupplier": 1821.00,
          "openDate": "2021-05-05T16:08:00",
          "finOrderType": "Y0075",
          "budgetItem": null,
          "confirmDate": "2021-05-10T13:51:00",
          "confirmBy": "מעין ארד",
          "confirmUserTz": 43464601,
          "confirmByUser": "דף לספק        ",
          "confirmCancelDate": null,
          "confirmCancelUserTz": null,
          "supplierProcedureNum": "145/20/פ",
          "totalPayCustomer": 1650.00,
          "totalPaySupplier": 1949.22,
          "totalPayAfterKklSubsidy": 1320.00
        },
        "globalParameters": {
          "itemId": 455,
          "itemOrderRecordId": 5,
          "orderId": 5,
          "tempOrderIdentity": 0,
          "orderItemDetails": {
            "credit": null,
            "costVat": null,
            "isCustomerBilling": null,
            "isNight": null,
            "orderType": null,
            "isSumPeopleOrAmount": null,
            "groupTypeId": null,
            "typeSleepId": null,
            "customerId": null,
            "supplierId": null,
            "classroomTypeId": null,
            "isSmallRange": null,
            "amountLimit": null,
            "participantsLimit": null,
            "numSeat": null,
            "isMore": null
          },
          "supplierId": 171,
          "quantity": 1,
          "billingSupplier": 42.74,
          "billingCustomer": null,
          "peopleInTrip": 1,
          "startDate": "2021-05-11T00:00:00",
          "endDate": "2021-05-11T00:00:00",
          "startHour": "2021-05-11T00:00:00",
          "endHour": "2021-05-11T00:00:00",
          "openDate": "2021-05-10T10:32:00",
          "isVat": false,
          "userInfo": "מרכז סיור ולימו"
        }
      },
      {
        "guideName": "עדינה בינשטוק",
        "order": {
          "tripId": 52979,
          "orderId": 5,
          "orderType": {
            "id": 6,
            "name": "הדרכה",
            "finOrderType": "Y0075"
          },
          "supplier": {
            "id": 171,
            "name": "שחר גל         ",
            "finId": null,
            "cityId": null,
            "supplierType": null,
            "isValid": null,
            "isGuideSupplier": null
          },
          "comment": "מדריכות חרדיות",
          "siteId": null,
          "sentToSupplier": "2021-05-09T09:41:00",
          "voucherNum": null,
          "cancelDate": null,
          "paidToSupplier": 1821.00,
          "openDate": "2021-05-05T16:08:00",
          "finOrderType": "Y0075",
          "budgetItem": null,
          "confirmDate": "2021-05-10T13:51:00",
          "confirmBy": "מעין ארד",
          "confirmUserTz": 43464601,
          "confirmByUser": "דף לספק        ",
          "confirmCancelDate": null,
          "confirmCancelUserTz": null,
          "supplierProcedureNum": "145/20/פ",
          "totalPayCustomer": 1650.00,
          "totalPaySupplier": 1949.22,
          "totalPayAfterKklSubsidy": 1320.00
        },
        "globalParameters": {
          "itemId": 455,
          "itemOrderRecordId": 6,
          "orderId": 5,
          "tempOrderIdentity": 0,
          "orderItemDetails": {
            "credit": null,
            "costVat": null,
            "isCustomerBilling": null,
            "isNight": null,
            "orderType": null,
            "isSumPeopleOrAmount": null,
            "groupTypeId": null,
            "typeSleepId": null,
            "customerId": null,
            "supplierId": null,
            "classroomTypeId": null,
            "isSmallRange": null,
            "amountLimit": null,
            "participantsLimit": null,
            "numSeat": null,
            "isMore": null
          },
          "supplierId": 171,
          "quantity": 1,
          "billingSupplier": 42.74,
          "billingCustomer": null,
          "peopleInTrip": 1,
          "startDate": "2021-05-11T00:00:00",
          "endDate": "2021-05-11T00:00:00",
          "startHour": "2021-05-11T00:00:00",
          "endHour": "2021-05-11T00:00:00",
          "openDate": "2021-05-10T13:51:00",
          "isVat": false,
          "userInfo": "מרכז סיור ולימו"
        }
      }
    ]
  };

}

