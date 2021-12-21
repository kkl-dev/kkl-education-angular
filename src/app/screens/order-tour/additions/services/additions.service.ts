import { StepperService } from './../../../../utilities/services/stepper.service';
import { StepModel } from 'src/app/utilities/models/step.model';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { LocationModel } from '../models/location.model';
import { ScheduleModel } from 'src/app/screens/order-tour/additions/models/schedule.model';
import { EconomyOrder, Order, OrderEvent, OrderService, OrderType, TempOrder, TransportOrder } from 'src/app/open-api';
import { TripService } from 'src/app/services/trip.service';
import { TransportService } from './transport.service';
import { GeneralFormService } from './general-form.service';
import { SquadAssembleService } from 'src/app/screens/order-tour/squad-assemble/services/squad-assemble.service';
import { ConfirmDialogComponent } from 'src/app/utilities/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
@Injectable({
  providedIn: 'root'
})
export class AdditionsService {
  item = {} as TransportOrder;
  orderTypes: OrderType[];
  tempOrder: TempOrder[];
  supplierList = [];
  private steps: StepModel[] = [
    // {
    //   label: 'היסעים',
    //   isActive: true,
    //   svgUrl: 'bus',
    //   badgeValue: 3,
    // },
    // {
    //   label: 'אבטחה',
    //   isActive: false,
    //   svgUrl: 'shield',
    // },
    // {
    //   label: 'אתרים',
    //   isActive: false,
    //   svgUrl: 'site',
    // },
    // {
    //   label: 'כלכלה',
    //   isActive: false,
    //   svgUrl: 'dinner',
    // },
    // {
    //   label: 'אירוח',
    //   isActive: false,
    //   svgUrl: 'tent',
    // },
    // {
    //   label: 'הדרכה',
    //   isActive: false,
    //   svgUrl: 'guide',
    // },
    // {
    //   label: 'הפעלה מוסיקלית',
    //   isActive: false,
    //   svgUrl: 'music',
    // },
  ];

  // private locationsSubject = new BehaviorSubject<LocationModel[]>([])
  // public locations$: Observable<LocationModel[]> = this.locationsSubject.asObservable();

  // private scheduleSubject = new BehaviorSubject<ScheduleModel[]>([])
  // public schedule$: Observable<ScheduleModel[]> = this.scheduleSubject.asObservable();

  private itemSubject = new BehaviorSubject<any[]>([])
  public item$: Observable<any[]> = this.itemSubject.asObservable();
  // public tempOrderReduce = new BehaviorSubject<any>(null)

  public emitItem(item: any[]) {
    this.itemSubject.next(item)
  }
  constructor(
    private stepperService: StepperService, private _dialog: MatDialog, private generalFormService: GeneralFormService, private tripService: TripService, private orderService: OrderService, public transportService: TransportService, private squadAssembleService: SquadAssembleService) { }

  public getSteps(): StepModel[] {
    return [... this.steps]
  }

  public updateStepStatus(step: StepModel, key: string) {
    this.steps = this.stepperService.updateStepStatus(this.steps, step, key)
  }

  // public emitSchedule(schedule: ScheduleModel[]) {
  //   this.scheduleSubject.next(schedule)
  // }

  // public emitLocations(locations: LocationModel[]) {
  //   this.locationsSubject.next(locations)
  // }
  // public updateTempOrderReduce(temp) {
  //   this.tempOrderReduce.next(temp);
  // }



  public orderList: OrderEvent[] = []
  //public orderToServer = {} as OrderModel
  addOrderItems(item: any) {
    // this.item$.subscribe(response => this.orderList = response);
    this.orderList.push(item);
    console.log(this.orderList);
  }
  getDaysArray = function (start, end) {
    for (var arr = [], dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
      arr.push(new Date(dt));
    }
    return arr;
  };
  calculateBillings(itemOrder: any,isXemptedFromVat) {
    var currentVat = 1.17;
    itemOrder.quantity = +itemOrder.quantity;
    // itemOrder.startDate = "27/11/2021";
    let str = itemOrder.startDate.split("/");
    let startDate1 = str[2] + '-' + str[1] + '-' + str[0];
    let startDate = new Date(startDate1);
    // itemOrder.endDate = "27/11/2021";
    let str2 = itemOrder.endDate.split("/");
    let endDate1 = str2[2] + '-' + str2[1] + '-' + str2[0];
    let endDate = new Date(endDate1);
    var MultiplyByDays
    var MultiplyByAmountOrPeople
    var MultiplyByAfterSibsud;
    var addToCommentNumOfDaysNights
    var totalNoCharge;
    var ParticipantsOrAmount;
    var numDayActivity = this.getDaysArray(startDate, endDate).length;
    var numNightActivity = (numDayActivity - 1 == 0 ?  1: numDayActivity - 1)
    if(itemOrder.startDate==""){
      numDayActivity=1;
      numNightActivity=1;
    }
    if(itemOrder.endDate==""){
      numDayActivity=1;
      numNightActivity=1;
    }
    
    itemOrder.internalComment = " "
    var item = this.generalFormService.originalItemList.find(el => el.id.toString() === itemOrder.itemId);
    //-----------------------חישוב מחיר-----------------------------------------------------------------
    //------------------------הפריט מוגדר כזיכוי או תוספת נסיעות-------------------------------
    if (item?.credit == 1) itemOrder.comment = 'הפריט מוגדר כזיכוי'
    // if (item?.type == 266 || item?.credit == 1) return itemOrder;
    if (item?.credit == 1) return itemOrder;

    //------------------ ברירת המחדל היא: להזמנות כלכלה/אתרים: לפי משתתפים, לכל השאר: לפי כמות---------
    //------------------אם החישוב הוא לפי משתתפים הקוד הוא 2 ואם החישוב הוא לפי כמות הקוד הוא 1--------
    if (item?.isSumPeopleOrAmount == 0 || item?.isSumPeopleOrAmount == null)
      item.isSumPeopleOrAmount = (item?.orderType == 4 || item?.orderType == 3) ? 2 : 1

    //--------------- calculate days (and note) for multiplication-----------
    if (item?.isNight === 0 || item?.isNight == null) {
      MultiplyByDays = numDayActivity;
      addToCommentNumOfDaysNights = "סה''כ ימי הטיול:" + MultiplyByDays?.toString()
    }
    else if (item?.isNight === 1) {
      if (numNightActivity === 0) numNightActivity = 1;
      MultiplyByDays = numNightActivity;
      addToCommentNumOfDaysNights = " סה''כ מספר  לילות בטיול " + MultiplyByDays?.toString()
    }
    else if (item?.isNight == 2) {
      MultiplyByDays = 1;
      addToCommentNumOfDaysNights = " סה''כ ימי פעילות " + MultiplyByDays?.toString()
    }

    if (item?.orderType == 6) itemOrder.quantity = 1
    //--------------חישוב עלות ללקוח לפי: כמות או משתתפים-----------------
    //--------------כמות = 1 ,משתתפים = 2 -----------------
    if (item?.isSumPeopleOrAmount == 1) {
      ParticipantsOrAmount = "חישוב מכפלה לפי כמות:"
      MultiplyByAmountOrPeople = itemOrder.quantity
    }
    else if(item?.orderType == 4){
      ParticipantsOrAmount = "חישוב מכפלה לפי משתתפים:"
      //MultiplyByAmountOrPeople = itemOrder.quantity
      MultiplyByAmountOrPeople = itemOrder.peopleInTrip
    }
    else {  // calculate by participants
      ParticipantsOrAmount = "חישוב מכפלה לפי משתתפים:"
      //MultiplyByAmountOrPeople = itemOrder.peopleInTrip
      if(itemOrder?.peopleInTrip)
      MultiplyByAmountOrPeople = itemOrder.peopleInTrip;
      else{
        let index= this.generalFormService.details.findIndex(i=> i.key== 'peopleInTrip')
        MultiplyByAmountOrPeople = this.generalFormService.details[index].value;
      }
     
    }

    //------------------------------חישוב ערכי ברירת מחדל לחיובי ספק ולקוח---------------------------------------------------

    itemOrder.billingSupplier = item?.cost * MultiplyByAmountOrPeople * MultiplyByDays //ספק
    //if (item?.orderType === 1 && item?.credit !== 1) itemOrder.billingSupplier = itemOrder.billingSupplier * currentVat  // אם כולל מעמ - יש להוסיף את עלות המע"מ בחיוב לספק
    if(!isXemptedFromVat && item?.credit !== 1){
      //test
       if(item?.costVat)
       itemOrder.billingSupplier = item?.costVat * MultiplyByAmountOrPeople * MultiplyByDays  // אם כולל מעמ - יש להוסיף את עלות המע"מ בחיוב לספק
       else
       itemOrder.billingSupplier = itemOrder.billingSupplier * currentVat
      // end test
      //itemOrder.billingSupplier = itemOrder.billingSupplier * currentVat  // אם כולל מעמ - יש להוסיף את עלות המע"מ בחיוב לספק
    } 
    itemOrder.billingCustomer = item?.costCustomer * MultiplyByAmountOrPeople * MultiplyByDays   //לקוח  
    var addToCommentMultipleStr = "מכפלת החיוב" + MultiplyByAmountOrPeople?.toString() + "*" + item?.costCustomer + "*" + MultiplyByDays

    //------------------------------- בדוק האם הפריט הוא ללא חיוב לקוח----------------------------------------------------------------------

    if (item?.isCustomerBilling == 0) {
      itemOrder.billingCustomer = 0
      itemOrder.internalComment = "פריט ללא חיוב לקוח"
      return itemOrder
    }
    /**
  //    *  סבסוד של עלות ללקוח
  //    *  -----------------------------------------
  //    *  סבסוד (של 1 ל-25) יש רק בסוגי ההזמנה:
  //    *  אירוח/כלכלה/אבטחה
  //    *  ורק לפריטים שמחושבים לפי: מספר משתתפים
  //    *  ורק אם זה לא טיול של השתלמות מדריכים
  //    *  ורק אם מאפיין הטיול מסומן כמקבל את הסבסוד
  //    */

    //--------------------------------------אירוח-----------------------------------------------------------

    if (item?.orderType == 7) {
      // פריט שמוגדר לפי משתתפים - בטיול שאינו השתלמות מדריכים  
      // if (item?.isSumPeopleOrAmount == 2 && this.squadAssembleService.tripInfofromService.trip.attribute.subsidization1To25 == 1 && this.squadAssembleService.tripInfofromService.trip.activity.id !== 2) {
        if (item?.isSumPeopleOrAmount == 2 && this.generalFormService.tripInfo.trip.attribute.subsidization1To25 == 1 && this.generalFormService.tripInfo.trip.activity.id !== 2) {
        // סבסוד עלות ללקוח מופעל רק עבור פריטים שמוגדרים לפי משתתפים
        // חישוב מספר משתתפים לחיוב - לאחר סבסוד
        MultiplyByAfterSibsud = MultiplyByAmountOrPeople > 0 ? (MultiplyByAmountOrPeople - (MultiplyByAmountOrPeople / 25)) : 0
        totalNoCharge = MultiplyByAmountOrPeople > 0 ? MultiplyByAmountOrPeople / 25 : 0
        // חישוב חיוב לקוח לאחר סבסוד
        itemOrder.billingCustomer = item?.costCustomer * MultiplyByAfterSibsud * MultiplyByDays
        addToCommentMultipleStr = "מכפלת החיוב" + MultiplyByAfterSibsud?.toString() + "*" + item?.costCustomer + "*" + MultiplyByDays?.toString()
        itemOrder.internalComment = ParticipantsOrAmount + 'משתתפים' + itemOrder.peopleInTrip
        if (totalNoCharge > 0)
          itemOrder.internalComment += ", מהם: " + totalNoCharge?.toString() + "  לא לחיוב " + " סה''כ משתתפים לחישוב  " + itemOrder.peopleInTrip + "-" + totalNoCharge.toString() + "=" + MultiplyByAfterSibsud.toString()
        itemOrder.internalComment += addToCommentNumOfDaysNights + addToCommentMultipleStr

      }
      else  // פריט שמוגדר לפי כמות או טיול של השתלמות מדריכים
        itemOrder.internalComment = ParticipantsOrAmount + "סה''כ כמות לחישוב" + itemOrder.quantity?.toString() + addToCommentNumOfDaysNights + addToCommentMultipleStr
    }

    //---------------------------כלכלה------------------------------------------------
    else if (item?.orderType == 4) {
      // בהזמנות כלכלה שורה של פריט היא תמיד ליום אחד
      itemOrder.billingSupplier = item?.cost * +MultiplyByAmountOrPeople // חישוב חיוב ספק
      if(!isXemptedFromVat && item?.credit !== 1){
        //test
        if(item?.costVat)
        itemOrder.billingSupplier = item?.costVat * MultiplyByAmountOrPeople// אם כולל מעמ - יש להוסיף את עלות המע"מ בחיוב לספק
        else
        itemOrder.billingSupplier = itemOrder.billingSupplier * currentVat
        //end test
        //itemOrder.billingSupplier = itemOrder.billingSupplier * currentVat  // אם כולל מעמ - יש להוסיף את עלות המע"מ בחיוב לספק
      } 
      // if (item.costVat == 1) {
      // if (itemOrder.isVat == 1) {
      //   // itemOrder.billingSupplier = (currentVat / 100) + 1
      //   itemOrder.billingSupplier *= currentVat;
      // } // אם כולל מעמ - יש להוסיף את עלות המע"מ בחיוב לספק
           var MultiplyByPeopleMinusGuides = MultiplyByAmountOrPeople > this.generalFormService.tripInfo.trip.numGuides ?
           MultiplyByAmountOrPeople - this.generalFormService.tripInfo.trip.numGuides : MultiplyByAmountOrPeople   
            //הורדת מדריכים ונהגים
            let numGuides= this.generalFormService.tripInfo.trip.numGuides>0?this.generalFormService.tripInfo.trip.numGuides:0
            let numDrivers= this.generalFormService.tripInfo.trip.numDrivers>0?this.generalFormService.tripInfo.trip.numDrivers:0
            let numPeopleMinusNumGuidesAndDrivers: any
             numPeopleMinusNumGuidesAndDrivers = MultiplyByAmountOrPeople - (numGuides+ numDrivers);
            var MultiplyByPeopleMinusGuides= numPeopleMinusNumGuidesAndDrivers; 
            // var MultiplyByPeopleMinusGuides = MultiplyByAmountOrPeople > (this.generalFormService.tripInfo.trip.numGuides + this.generalFormService.tripInfo.trip.numDrivers) ?
            // MultiplyByAmountOrPeople - this.generalFormService.tripInfo.trip.numGuides - this.generalFormService.tripInfo.trip.numDrivers : MultiplyByAmountOrPeople

      if (item?.isSumPeopleOrAmount == 2 && this.generalFormService.tripInfo.trip.attribute.subsidization1To25 == 1 && this.generalFormService.tripInfo.trip.activity.id !== 2) {// פריט שמוגדר לפי משתתפים - בטיול שאינו השתלמות מדריכים
        // if (MultiplyByAmountOrPeople > this.squadAssembleService.tripInfofromService.trip.numGuides) {
        // var MultiplyByPeopleMinusGuides = MultiplyByAmountOrPeople > this.generalFormService.tripInfo.trip.numGuides ?
        //   MultiplyByAmountOrPeople - this.generalFormService.tripInfo.trip.numGuides : MultiplyByAmountOrPeople

        // }
        // חישוב מספר משתתפים לחיוב - לאחר סבסוד
        MultiplyByAfterSibsud = MultiplyByPeopleMinusGuides > 0 ? MultiplyByPeopleMinusGuides - Math.floor(MultiplyByPeopleMinusGuides / 25) : 0
        totalNoCharge = MultiplyByPeopleMinusGuides > 0 ? Math.floor(MultiplyByPeopleMinusGuides / 25) : 0
        itemOrder.billingCustomer = item?.costCustomer * MultiplyByAfterSibsud   // חישוב חיוב לקוח לאחר סבסוד
        addToCommentMultipleStr = "מכפלת החיוב" + MultiplyByAfterSibsud?.toString() + "*" + item?.costCustomer
        itemOrder.internalComment = ParticipantsOrAmount + "כמות משתתפים ללא מדריכים" + MultiplyByPeopleMinusGuides.toString()
        if (totalNoCharge > 0)
          itemOrder.internalComment += ", מהם: " + totalNoCharge?.toString() + "סה''כ ארוחות לחיוב " + "  ללא חיוב " + MultiplyByPeopleMinusGuides.toString() + "-" + totalNoCharge.toString() + "=" + MultiplyByAfterSibsud.toString()

        itemOrder.internalComment += addToCommentMultipleStr
      }
      else // פריט שמוגדר לפי כמות או טיול של השתלמות מדריכים
      {
        //itemOrder.billingCustomer = item?.costCustomer * MultiplyByAmountOrPeople 
        itemOrder.billingCustomer = item?.costCustomer * MultiplyByPeopleMinusGuides;    // חישוב חיוב לקוח  
        addToCommentMultipleStr = "מכפלת החיוב" + MultiplyByAmountOrPeople?.toString() + "*" + item?.costCustomer
        itemOrder.internalComment = ParticipantsOrAmount + "סה''כ ארוחות לחישוב" + itemOrder.quantity + addToCommentMultipleStr
        // סבסוד עלות ללקוח מופעל רק עבור פריטים שמוגדרים לפי משתתפים
        // בהזמנות כלכלה לפי משתתפים - יש להוריד בחיוב לקוח את המנות של המדריכים
      }
    }

    //   ------------------------אבטחה-----------------------------------------------------------
    else if (item?.orderType == 2) {
      if (item?.isSumPeopleOrAmount == 2 && this.generalFormService.tripInfo.trip.attribute.subsidization1To25 == 1 && this.generalFormService.tripInfo.trip.activity.id !== 2) { // פריט שמוגדר לפי משתתפים - בטיול שאינו השתלמות מדריכים
        // סבסוד עלות ללקוח מופעל רק עבור פריטים שמוגדרים לפי משתתפים
        // בהזמנות אבטחה לפי משתתפים - יש להוריד בחיוב לקוח את המדריכים
        if (MultiplyByAmountOrPeople > this.generalFormService.tripInfo.trip.numGuides) {
          MultiplyByPeopleMinusGuides = MultiplyByAmountOrPeople > this.generalFormService.tripInfo.trip.numGuides ?
            MultiplyByAmountOrPeople - this.generalFormService.tripInfo.trip.numGuides : MultiplyByAmountOrPeople
          // חישוב מספר משתתפים לחיוב - לאחר סבסוד
          MultiplyByAfterSibsud = MultiplyByPeopleMinusGuides > 0 ? (MultiplyByPeopleMinusGuides - Math.floor(MultiplyByPeopleMinusGuides / 25)) : 0
          totalNoCharge = MultiplyByAmountOrPeople > 0 ? Math.floor(MultiplyByAmountOrPeople / 25) : 0
          itemOrder.billingCustomer = item?.costCustomer * MultiplyByAfterSibsud * MultiplyByDays  // חישוב חיוב לקוח לאחר סבסוד
          addToCommentMultipleStr = "מכפלת החיוב" + MultiplyByAfterSibsud?.toString() + "*" + item?.costCustomer + "*" + MultiplyByDays?.toString()
          itemOrder.internalComment = ParticipantsOrAmount + "כמות משתתפים עם מדריכים" + MultiplyByPeopleMinusGuides?.toString()
          if (totalNoCharge > 0)
            itemOrder.internalComment += ", מהם: " + totalNoCharge?.toString() + "ללא חיוב  " + "סה''כ משתתפים לחיוב " + MultiplyByPeopleMinusGuides.toString() + "-" + totalNoCharge.toString() + "=" + MultiplyByAfterSibsud.toString()
          itemOrder.internalComment += addToCommentNumOfDaysNights + addToCommentMultipleStr
        }

        else // פריט שמוגדר לפי כמות או טיול של השתלמות מדריכים
          itemOrder.internalComment = ParticipantsOrAmount + "סה''כ כמות לחישוב" + itemOrder.quantity + addToCommentNumOfDaysNights + addToCommentMultipleStr

      }
    }

    //--------------------------היסעים--------------------------------------------------------
    else if (item?.orderType == 1) {
      // היסעים - צריך להיות תמיד לפי כמות
      // אם סוג פעילות: "עבודה תורמת" או "מחזון להגשמה" - החיוב ללקוח אמור להיות רק 50%
      // if (this.squadAssembleService?.tripInfofromService.trip.activity.id == 23 || this.squadAssembleService?.tripInfofromService.trip.activity.id == 38) {
      if (this.generalFormService?.tripInfo.trip.activity.id == 38) {
        itemOrder.billingCustomer = item?.costCustomer * 0.5
        addToCommentMultipleStr = "עם סבסוד" + "מכפלת החיוב " + itemOrder.quantity + "*" + item?.costCustomer + "*0.5" + "*" + MultiplyByDays.toString()
        itemOrder.internalComment = "סבסוד קקל לפעילות חינוכית" + this.generalFormService.tripInfo.trip.activity.name + ", " + "עלות הפריט: " + item?.costCustomer
        "סה''כ כמות לחישוב" + itemOrder.quantity + addToCommentNumOfDaysNights + addToCommentMultipleStr
      }
      else
        itemOrder.internalComment = "מחיר לפריט" + item?.costCustomer + "סה''כ כמות לחישוב" + itemOrder.quantity + addToCommentNumOfDaysNights + addToCommentMultipleStr

    }
    //----------------------הדרכה------------------------------------------------------------
    else if (item?.orderType == 6) {
      // //עבודה תורמת המדריכים בחינם ללקוח       
      // if (this.squadAssembleService.tripInfofromService.trip.activity.id = 23) {
      //   itemOrder.billingCustomer = 0
      //   itemOrder.internalComment = "בטיול מסוג עבודה תורמת אין חיוב ללקוח עבור הדרכה"
      // }      
      // else  //מחזון להגשמה המדריכים בחינם ללקוח  
      if (this.generalFormService.tripInfo.trip.activity.id == 38) {
        itemOrder.billingCustomer = 0
        itemOrder.internalComment = "בטיול מסוג מחזון להגשמה אין חיוב ללקוח עבור הדרכה"
      }
    }
    //-----------------------------------חבילות-----------------------------------------------
    // else if (item?.orderType == 88) itemOrder.internalComment += "חיוב לפי חבילה: " + item?.name

    //-------------------------------כל שאר סוגי ההזמנות--------------------------------------
    else {
      if (itemOrder.billingCustomer > 0) {
        if (item?.isSumPeopleOrAmount == 2) // פריט שמוגדר לפי משתתפים
          itemOrder.internalComment = ParticipantsOrAmount + " סה''כ משתתפים לחישוב" + itemOrder.peopleInTrip + addToCommentNumOfDaysNights + addToCommentMultipleStr
        else if (item?.isSumPeopleOrAmount == 1) // פריט שמוגדר לפי כמות
          itemOrder.internalComment = ParticipantsOrAmount + "סה''כ כמות לחישוב" + itemOrder.quantity + addToCommentNumOfDaysNights + addToCommentMultipleStr
      }
    }
    itemOrder.quantity = itemOrder.quantity.toString();
    // itiel
    let billingSupplierRound= (Math.round(itemOrder.billingSupplier * 100) / 100).toFixed(2);
    let billingCustomerRound= (Math.round(itemOrder.billingCustomer * 100) / 100).toFixed(2);
     itemOrder.billingSupplier= billingSupplierRound;
     itemOrder.billingCustomer= billingCustomerRound;
    // end itiel
    return itemOrder;
  }
  setDialogMessage(message) {
    const dialogRef = this._dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: { message: message, content: '', rightButton: 'ביטול', leftButton: 'אישור' }
    })
  }

  globalValidations(form) {
    if (this.generalFormService.originalItemList.length > 0) {
      var item = this.generalFormService.originalItemList.find(el => el.id.toString() === form.value.details['itemId']);
    }
    if (form.status !== 'VALID') {
      // const dialogRef = this._dialog.open(ConfirmDialogComponent, {
      //   width: '500px',
      //   data: { message: 'יש למלא את כל שדות החובה בטופס', content: '', rightButton: 'ביטול', leftButton: 'המשך' }
      // })
      var name = this.generalFormService.findInvalidControls(form);
      if (name !== null) this.setDialogMessage(' שדה ' + name + ' הינו חובה ');
      return false;
    }
    if(item?.participantsLimit != null){
    if (item?.participantsLimit < form.value.details['peopleInTrip'] ) {
      const dialogRef = this._dialog.open(ConfirmDialogComponent, {
        width: '500px',
        data: { message: 'פריט זה מוגבל במספר משתתפים: ' + item?.participantsLimit, content: '', rightButton: 'ביטול', leftButton: 'המשך' }
      })
      return false;
    }
  }
  if (item.credit == 1) {
    this.setDialogMessage('פריט מסוג זיכוי מצריך אישור חשב');
    return false;
  }
    // פריט מוגבל לכמות אחת בלבד
    if(item?.amountLimit!= null && item?.amountLimit!= 0 ){
      if (item?.amountLimit < form.value.details['quantity']) {
        const dialogRef = this._dialog.open(ConfirmDialogComponent, {
          width: '500px',
          // data: { message: 'פריט זה מוגבל לכמות 1 בלבד: ' + item?.participantsLimit }
          data: { message: 'פריט זה מוגבל ל: ' + item?.amountLimit +' בלבד' }
        })
        return false;
      }
    }
   
    if (form.value.details['startDate'] === form.value.details['endDate'] && form.value.details['startHour'] > form.value.details['endHour']) {
      this.setDialogMessage('שעת התחלה חייבת להיות לפני שעת הסיום');
      return false;
    }
    var arrStartDate = form.value.details['startDate'].split("/");
    var date1 = new Date(arrStartDate[2], arrStartDate[1], arrStartDate[0]);
    var arrEndDate = form.value.details['endDate'].split("/");
    var date2 = new Date(arrEndDate[2], arrEndDate[1], arrEndDate[0]);
    if (date1 > date2) {
      this.setDialogMessage('תאריך התחלה חייב להיות לפני תאריך הסיום');
      return false;
    }


    // בדיקה עם הפריט מסוג תוספות
    // ואם יש הרשאה -  למשווק אין
    // אין שדה כזה בDB
    //לUSER is_allowd_have_tosefet
    // חסר השדה הזה בYAML
    // if (item?.name.include("תוספת") == true ) {
    //   const dialogRef = this._dialog.open(ConfirmDialogComponent, {
    //     width: '500px',
    //     data: { message: "פריט מסוג תוספות לא תואם להרשאה זו" }
    //   })
    //   return false;
    // }

     
    return true;
  }

   



}

