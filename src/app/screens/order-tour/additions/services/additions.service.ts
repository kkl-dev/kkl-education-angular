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
  public tempOrderReduce = new BehaviorSubject<any>(null)

  public emitItem(item: any[]) {
    this.itemSubject.next(item)
  }
  constructor(
    private stepperService: StepperService, private generalFormService: GeneralFormService, private tripService: TripService, private orderService: OrderService, public transportService: TransportService, private squadAssembleService: SquadAssembleService) { }

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
  public sendtempOrderReduce(temp) {
    this.tempOrderReduce.next(temp);
  }



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
  calculateBillings(itemOrder: any) {
    var currentVat = 1.17;
    itemOrder.quantity = +itemOrder.quantity;
    itemOrder.startDate = "27/11/2021";
    let str = itemOrder.startDate.split("/");
    let startDate1 = str[2] + '-' + str[1] + '-' + str[0];
    let startDate = new Date(startDate1);
    itemOrder.endDate = "27/11/2021";
    let str2 = itemOrder.endDate.split("/");
    let endDate1 = str2[2] + '-' + str2[1] + '-' + str2[0];
    let endDate = new Date(endDate1);
    var MultiplyByDays
    var MultiplyByAmountOrPeople
    var MultiplyByAfterSibsud;
    var addToCommentNumOfDaysNights
    var totalNoCharge;
    var ParticipantsOrAmount
    var numDayActivity = this.getDaysArray(startDate, endDate).length;
    var numNightActivity = (numDayActivity - 1 == 0 ? numDayActivity - 1 : 1)
    itemOrder.internalComment = " "
    var item = this.generalFormService.originalItemList.find(el => el.id.toString() === itemOrder.itemId);
    //-----------------------חישוב מחיר-----------------------------------------------------------------
    //------------------------הפריט מוגדר כזיכוי או תוספת נסיעות-------------------------------
    if (item?.credit == 1) itemOrder.comment = 'הפריט מוגדר כזיכוי'
    if (item?.type == 266 || item?.credit == 1) return itemOrder;

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
    else {  // calculate by participants
      ParticipantsOrAmount = "חישוב מכפלה לפי משתתפים:"
      MultiplyByAmountOrPeople = itemOrder.peopleInTrip
    }

    //------------------------------חישוב ערכי ברירת מחדל לחיובי ספק ולקוח---------------------------------------------------

    itemOrder.billingSupplier = item?.cost * MultiplyByAmountOrPeople * MultiplyByDays //ספק
    if (item?.orderType == 1 && item?.credit != 1) itemOrder.billingSupplier = itemOrder.billingSupplier * ((JSON.parse(localStorage.getItem('currentVat')).currentVat / 100) + 1)  // אם כולל מעמ - יש להוסיף את עלות המע"מ בחיוב לספק
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
      if (item?.isSumPeopleOrAmount == 2 && this.squadAssembleService.tripInfofromService.trip.attribute.subsidization1To25 == 1) {
        // סבסוד עלות ללקוח מופעל רק עבור פריטים שמוגדרים לפי משתתפים
        // חישוב מספר משתתפים לחיוב - לאחר סבסוד
        MultiplyByAfterSibsud = MultiplyByAmountOrPeople > 0 ? 0 : MultiplyByAmountOrPeople - (MultiplyByAmountOrPeople / 25)
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
      itemOrder.billingSupplier = item?.cost * MultiplyByAmountOrPeople // חישוב חיוב ספק
      // if (item.costVat == 1) {
      if (itemOrder.isVat == 1) {
        itemOrder.billingSupplier = ((JSON.parse(localStorage.getItem('currentVat')).currentVat / 100) + 1)
      } // אם כולל מעמ - יש להוסיף את עלות המע"מ בחיוב לספק
      if (item?.isSumPeopleOrAmount == 2 && this.squadAssembleService.tripInfofromService.trip.attribute.subsidization1To25 == 1) {// פריט שמוגדר לפי משתתפים - בטיול שאינו השתלמות מדריכים
        if (MultiplyByAmountOrPeople > this.squadAssembleService.tripInfofromService.trip.numGuides) {
          var MultiplyByPeopleMinusGuides = MultiplyByAmountOrPeople > this.squadAssembleService.tripInfofromService.trip.numGuides ?
            MultiplyByAmountOrPeople - this.squadAssembleService.tripInfofromService.trip.numGuides : MultiplyByAmountOrPeople
          // חישוב מספר משתתפים לחיוב - לאחר סבסוד
          MultiplyByAfterSibsud = MultiplyByAmountOrPeople > 0 ? MultiplyByAmountOrPeople - (MultiplyByAmountOrPeople / 25) : 0
          totalNoCharge = MultiplyByAmountOrPeople > 0 ? MultiplyByAmountOrPeople / 25 : 0
          itemOrder.billingCustomer = item?.costCustomer * MultiplyByAfterSibsud   // חישוב חיוב לקוח לאחר סבסוד
          addToCommentMultipleStr = "מכפלת החיוב" + MultiplyByAfterSibsud?.toString() + "*" + item?.costCustomer
          itemOrder.internalComment = ParticipantsOrAmount + "כמות משתתפים עם מדריכים" + MultiplyByPeopleMinusGuides.toString()
          if (totalNoCharge > 0)
            itemOrder.internalComment += ", מהם: " + totalNoCharge?.toString() + "ללא חיוב" + "סה''כ ארוחות לחישוב " + MultiplyByPeopleMinusGuides.toString() + "-" + totalNoCharge.toString() + "=" + MultiplyByAfterSibsud.toString()

          itemOrder.internalComment += addToCommentMultipleStr
        }
      }
      else // פריט שמוגדר לפי כמות או טיול של השתלמות מדריכים
      {
        itemOrder.billingCustomer = item?.costCustomer * MultiplyByAmountOrPeople    // חישוב חיוב לקוח  
        addToCommentMultipleStr = "מכפלת החיוב" + MultiplyByAmountOrPeople?.toString() + "*" + item?.costCustomer
        itemOrder.internalComment = ParticipantsOrAmount + "סה''כ ארוחות לחישוב" + itemOrder.quantity + addToCommentMultipleStr
        // סבסוד עלות ללקוח מופעל רק עבור פריטים שמוגדרים לפי משתתפים
        // בהזמנות כלכלה לפי משתתפים - יש להוריד בחיוב לקוח את המנות של המדריכים
      }
    }

    //   ------------------------אבטחה-----------------------------------------------------------
    else if (item?.orderType == 2) {
      if (item?.isSumPeopleOrAmount == 2 && this.squadAssembleService.tripInfofromService.trip.attribute.subsidization1To25 == 1) { // פריט שמוגדר לפי משתתפים - בטיול שאינו השתלמות מדריכים
        // סבסוד עלות ללקוח מופעל רק עבור פריטים שמוגדרים לפי משתתפים
        // בהזמנות אבטחה לפי משתתפים - יש להוריד בחיוב לקוח את המדריכים
        if (MultiplyByAmountOrPeople > this.squadAssembleService.tripInfofromService.trip.numGuides) {
          MultiplyByPeopleMinusGuides = MultiplyByAmountOrPeople > this.squadAssembleService.tripInfofromService.trip.numGuides ?
            MultiplyByAmountOrPeople - this.squadAssembleService.tripInfofromService.trip.numGuides : MultiplyByAmountOrPeople
          // חישוב מספר משתתפים לחיוב - לאחר סבסוד
          MultiplyByAfterSibsud = MultiplyByAmountOrPeople > 0 ? 0 : MultiplyByAmountOrPeople - (MultiplyByAmountOrPeople / 25)
          totalNoCharge = MultiplyByAmountOrPeople > 0 ? MultiplyByAmountOrPeople / 25 : 0
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
      if (this.squadAssembleService.tripInfofromService.trip.activity.id == 23 || this.squadAssembleService.tripInfofromService.trip.activity.id == 38) {
        itemOrder.billingCustomer = item?.costCustomer * 0.5
        addToCommentMultipleStr = "עם סבסוד" + "מכפלת החיוב " + itemOrder.quantity + "*" + item?.costCustomer + "*0.5" + "*" + MultiplyByDays.toString()
        itemOrder.internalComment = "סבסוד קקל לפעילות חינוכית" + this.squadAssembleService.tripInfofromService.trip.activity.name + ", " + "עלות הפריט: " + item?.costCustomer
        "סה''כ כמות לחישוב" + itemOrder.quantity + addToCommentNumOfDaysNights + addToCommentMultipleStr
      }
      else
        itemOrder.internalComment = "מחיר לפריט" + item?.costCustomer + "סה''כ כמות לחישוב" + itemOrder.quantity + addToCommentNumOfDaysNights + addToCommentMultipleStr

    }
    //----------------------הדרכה------------------------------------------------------------
    else if (item?.orderType == 6) {
      //עבודה תורמת המדריכים בחינם ללקוח       
      if (this.squadAssembleService.tripInfofromService.trip.activity.id = 23) {
        itemOrder.billingCustomer = 0
        itemOrder.internalComment = "בטיול מסוג עבודה תורמת אין חיוב ללקוח עבור הדרכה"
      }  //מחזון להגשמה המדריכים בחינם ללקוח       
      else if (this.squadAssembleService.tripInfofromService.trip.activity.id == 38) {
        itemOrder.billingCustomer = 0
        itemOrder.internalComment = "בטיול מסוג מחזון להגשמה אין חיוב ללקוח עבור הדרכה"
      }
    }
    //-----------------------------------חבילות-----------------------------------------------
    else if (item?.orderType == 88)
      itemOrder.internalComment += "חיוב לפי חבילה: " + item?.name

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

    return itemOrder
  }

}

