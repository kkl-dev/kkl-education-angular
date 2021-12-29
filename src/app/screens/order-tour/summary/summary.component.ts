import { Component, OnInit } from '@angular/core';
import { SquadAssembleService } from 'src/app/screens/order-tour/squad-assemble/services/squad-assemble.service';
import { Movements, MovementsService, TripModel, UserService, OrderService } from 'src/app/open-api';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/utilities/confirm-dialog/confirm-dialog.component';

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

  constructor(private squadAssembleService: SquadAssembleService, private _dialog: MatDialog, private userService: UserService, private movementsService: MovementsService, private orderService: OrderService) { }

  ngOnInit(): void {
    this.tripId = this.squadAssembleService.tripInfofromService.trip.id;
    this.userService.getTripDetails(this.tripId).subscribe(TM => {
      this.tripDetails = TM;
      this.SetArrays(); this.moveOrderCenterInDb();
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
            customerOrder: true,
            totalPayAfterKklSubsidy: n.order.totalPayAfterKklSubsidy
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
        n["customerBilling"] = n["orderList"].reduce((sum, current) => sum + ((current["customerBilling"] == undefined) ? 0 : current["customerBilling"]), 0),
        n["totalPayAfterKklSubsidy"] = n["orderList"][0].totalPayAfterKklSubsidy
    })



    this.PriceTotal = this.tableBodyTitles.reduce((sum, current) => sum + ((current["customerBilling"] == undefined) ? 0 : current["customerBilling"]), 0);
    this.PriceTotalVat = this.PriceTotal; // this.PriceTotal * 1.17;

    this.totalPriceAfterKklSubsidy = this.tableBodyTitles.reduce((sum, current) => sum + ((current["totalPayAfterKklSubsidy"] == undefined) ? 0 : current["totalPayAfterKklSubsidy"]), 0);
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
  setDialogMessage(message) {
    const dialogRef = this._dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: { message: message, content: '', leftButton: 'אישור' }
    })
  }
  checkIfNeedCustomerSign() {
    // האם טיולים עם הסוג פעילות הנ"ל אמורים לעבור חתימת לקוח או לא
    //  צורך באישור לקוח
    var isSkipCustomerSignature = this.tripDetails.trip.activity.isCustomerSignature != null ? isSkipCustomerSignature : 0
    if (isSkipCustomerSignature == 0 && this.tripDetails.trip.isSalKKlGroup == 1) isSkipCustomerSignature = 1;
    var isSkipConfirm = this.tripDetails.trip.collectiveGroupId != null ? this.tripDetails.trip.collectiveGroupId : 0
    // אם סוג הפעילות: העצמת כיתות מנהיגות/סיוע מנהלי
    // אין צורך באישור של מנהל מרכז ההזמנות (גם לא אישור תאריכים) והטיול נפתח ישר בסטטוס אושר
    // אם תיק משנה של תיק מאגד וסוג הפעילות: השתלמות מדריכים/ניידת חינוכית/שביל ישראל
    // אין צורך באישור של מנהל מרכז ההזמנות (גם לא אישור תאריכים) והטיול נפתח ישר בסטטוס אושר
    if ((this.tripDetails.trip.activity.id == 41 ||
      this.tripDetails.trip.activity.id == 67) ||
      (this.tripDetails.trip.collectiveGroupId > 0 && (
        this.tripDetails.trip.activity.id == 2 ||
        this.tripDetails.trip.activity.id == 6 ||
        this.tripDetails.trip.activity.id == 51
      )))
      isSkipConfirm = 1;
    // טיולים שאין צורך באישור לקוח או באישור בכלל (כמו העצמת כיתות מנהיגות)
    if (isSkipCustomerSignature == 1 || isSkipConfirm == 1)
      return 1
    return 0
  }

  moveOrderCenterInDb() {
    //בטיול עם פעילות מחזון להגשמה חובה להזמין הזמנת היסעים
    if (this.tripDetails.trip.activity.id === 38) {
      var flag = false;
      this.tripDetails.orderList.forEach(element => { if (element.order.orderType.id === 1) flag = true; })
      if (!flag) { this.setDialogMessage('בטיול מסוג חזון להגשמה - חובה להזמין אוטובוס'); return; }
    }
//בטיול מעל יום עם לינה במרכז שדה חובה להוסיף הזמנת אבטחה
if (!this.squadAssembleService.isOneDayTrip) {
  var flag = false;
  this.tripDetails.orderList.forEach(element => { if (element.order.orderType.id === 2) flag = true; })
  if (!flag) { this.setDialogMessage('בטיול מעל יום עם לינה במרכז שדה - חובה להוסיף הזמנת אבטחה'); return; }
}
    // הודעה הבסיסית שמציגים למשתמש
    let msg = "האם להעביר את הטיול לאישור מרכז ההזמנות"
    var transaction = {} as Movements
    transaction.openDate = new Date().toString();
    transaction.tripId = this.tripDetails.trip?.id;
    transaction.userInfo = this.tripDetails.trip?.userInfo;
    // if ((this.currentUser.currentPermission.id == 4 || this.currentUser.currentPermission.id == 7) ||
    //   (this.currentUser.currentPermission.id == 2 && this._trip.tripModel.trip?.status?.id < 25)) {
    //  אם טיול שלא מצריך חתימת לקוח 
    const noNeedCustomerSign = this.checkIfNeedCustomerSign();
    let IsScanChoze
    if (this.tripDetails.trip?.tripStatus?.id == 13) { // תאריכים לא מאושרים
      msg = "האם להעביר את הטיול שוב לאישור תאריכים?"
      IsScanChoze = -90 // סטטוס ישתנה ל: ממתין לאישור תאריכים
    }
    else {
      if (noNeedCustomerSign == 1) {// אם טיול שלא מצריך חתימת לקוח
        IsScanChoze = -9  // טיול לא מצריך חוזה סרוק - סטטוס ישתנה ל: ממתין לאישור מ. הזמנות
        msg = "טיול לא מצריך חוזה סרוק - האם להעביר לאישור מרכז ההזמנות"
      }
      else {
        if (this.tripDetails.trip?.customer.name == null) {
          if (this.tripDetails.trip?.customer?.id > 125000001)
            this.orderService.isThereScanContract(this.tripDetails.trip?.id)
              .subscribe((x: any) => { IsScanChoze = x }) // בדוק אם יש חוזה סרוק
          if (IsScanChoze == 0 || this.tripDetails.trip?.tripStatus?.id == 10)    // אם אין חוזה סרוק או שזה טיול בסטטוס חדש - סטטוס ישתנה ל: ממתין לאישור תאריכים
            msg = "האם להעביר הטיול לאישור תאריכים"
          else if (IsScanChoze > 0) // אם יש חוזה סרוק - סטטוס ישתנה ל: ממתין לאישור מ. הזמנות
            msg = "זוהה חוזה סרוק" + "האם להעביר את הטיול לאישור מרכז ההזמנות";
          else
            msg = "האם להעביר את הטיול לאישור מרכז ההזמנות"
        }
      }
    }
    let status;
    if (IsScanChoze == 0 || this.tripDetails.trip?.tripStatus?.id == 10 || IsScanChoze == -90) status = 15  // אם אין חוזה סרוק או שזה טיול בסטטוס חדש - סטטוס ישתנה ל: ממתין לאישור תאריכים
    else if (IsScanChoze > 0 || IsScanChoze == -9) status = 25 // יש חוזה סרוק או שטיול לא מצריך חוזה סרוק - סטטוס ישתנה ל: ממתין לאישור מ. הזמנות
    else if (IsScanChoze == -99) status = 20      // יש צורך בחתימה נוספת - סטטוס ישתנה ל: ממתין לחתימת לקוח
    else if (IsScanChoze == -98) status = 24      // סטטוס ישתנה ל: לא מאושר
    if (status == 15) {
      if (this.tripDetails.trip.tripStatus.id == 13)// אם סטטוס מקורי = תאריכים לא מאושרים והשתנה ל: ממתין לאישור תאריכים
        transaction.description = "הועבר למ.הזמנות לאישור נוסף של תאריכי הטיול"
      else
        var orders = this.tripDetails.orderList.find(x => x.order.orderType.id == 2 && x.order.status.id < 91)
      if (orders == undefined)
        transaction.description = "הועבר למ.הזמנות לאישור ראשוני של תאריכים, ללא הזמנת אבטחה"
      else
        transaction.description = "הועבר למ.הזמנות לאישור ראשוני של תאריכים"
      transaction.typeId = 62
    }
    else if (status == 20) { // אם סטטוס- ממתין לחתימת הלקוח
      if (IsScanChoze > 0) transaction.description = "הטיול הועבר לאישור נוסף של הלקוח"
      else transaction.description = "הטיול הועבר לאישור הלקוח"
      transaction.typeId = 80
    }
    else {
      transaction.description = "הועבר לאישור מ.ההזמנות"      // אחרת, אם סטטוס = ממתין לאישור מ. הזמנות
      if (noNeedCustomerSign == 1)
        transaction.description = "הועבר לאישור למרכז הזמנות ללא צורך באישור הלקוח בגלל סוג הטיול"
      if (status == 25) {// אם סטטוס: ממתין לאישור מ. הזמנות
        //לפני העברה לאישור קרא לממשק 322
        // if (f_call_to_mimshak_322(il_group_id) = -1) then return -1
      }
      transaction.typeId = 81
    }
    // }
    // else if (this.currentUser.currentPermission.id == 2) {
    //   transaction.type.id = 71
    //   transaction.description = "הטיול הועבר להזמנות, אצל מתאם אופרציה"
    // }
    this.squadAssembleService.transaction = transaction;
    this.squadAssembleService.transactionMessage = msg
    this.squadAssembleService.tripStatus = status;
    // const dialogRef = this._dialog.open(ConfirmDialogComponent, {
    //   width: '250px',
    //   data: { message: msg, rightButton: "אישור", leftButton: "ביטול" }
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result !== undefined) {
    //     // this.tripDetails.trip.tripStatus = status;
    //     // this.userService.updateTrip(this.tripDetails.trip.id, this.tripDetails.trip).subscribe(x => {
    //     this.orderService.sendToOrderCenter(transaction.tripId, transaction.description, transaction.typeId, status).subscribe(status => {
    //       const dialogRef = this._dialog.open(ConfirmDialogComponent, {
    //         width: '250px',
    //         data: { message: 'טיול הועבר למרכז הזמנות בהצלחה!', rightButton: "אישור" }
    //       });
    //       this.movementsService.addMove(transaction).subscribe(x => {
    //         this.tripDetails.movementsList.push(x)
    //       })

    //     }, err => {
    //       this.setDialogMessage('העברת טיול למרכז הזמנות - נכשל!');
    //     })

    //   }
    // })
  }

}



