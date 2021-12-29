import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormTemplate } from 'src/app/components/form/logic/form.service';
import { TableCellModel } from 'src/app/utilities/models/TableCell';
import { AdditionsService } from '../../services/additions.service';
import { GuidanceOrder, Order, OrderItemCommonDetails, OrderService, OrderType, Supplier, TransportOrder, UserService } from 'src/app/open-api';
import { SquadAssembleService } from '../../../squad-assemble/services/squad-assemble.service';
import { GeneralFormService } from '../../services/general-form.service';
import { ConfirmDialogComponent } from 'src/app/utilities/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-gudiance-form',
  templateUrl: './gudiance-form.component.html',
  styleUrls: ['./gudiance-form.component.scss']
})
export class GudianceFormComponent implements OnInit, OnDestroy {

  constructor(private _dialog: MatDialog, private generalFormService: GeneralFormService, private squadAssembleService: SquadAssembleService, private additionsService: AdditionsService, private orderService: OrderService,
    private userService: UserService) { }
  @Input() public item: any;
  @Input() public editMode: boolean;
  @Input() orderType: number;
  public form: FormGroup;
  public columns: TableCellModel[];
  tripId: number;
  supplierId: number;
  itemId: number;
  centerFieldId: number;
  originalItemList = [];
  itemsList = []
  supplierListSub: Subscription;
  ifInitiateFormflag: boolean = false;
  isEditable: boolean = false;
  ifShowtable: boolean = false;
  tableData: any;
  isItemOrderExist: boolean;
  isTempuraryItem: boolean;
  isSupplierXemptedFromVat: boolean;
  ifCalculateByQuantity: boolean;
  itemOrderRecordId: number;
  selectedItem: any;
  valueChangeIndex = 0;
  // close subscribe:
  supplierSub: Subscription;
  itemListSub: Subscription;
  languageSub: Subscription;
  addOrderSub: Subscription;
  editOrderSub: Subscription;
  supplierIdEventSub: Subscription;
  itemIdEventSub: Subscription;
  startDateEventSub: Subscription;
  endDateEventSub: Subscription;
  quantityEventSub: Subscription;
  peopleInTripEventSub: Subscription;
  public formTemplate: FormTemplate = {
    hasGroups: true,
    questionsGroups: [],
  };

  ngOnInit(): void {

    this.tripId = this.generalFormService.tripId;
    this.centerFieldId = this.generalFormService.tripInfo.trip.centerField.id;
    this.generalFormService.clearFormFields();
    this.generalFormService.itemsList = []
    this.setformTemplate();

    if (this.item != undefined && this.item != null) {
      if (this.item.globalParameters.supplierId != undefined && this.item.globalParameters.orderId) {
        this.isItemOrderExist = true;
        this.itemOrderRecordId = this.item.globalParameters.itemOrderRecordId;
        this.isTempuraryItem = false;
        this.editMode = true;
        this.supplierId = this.item.globalParameters.supplierId;
        this.itemId = this.item.globalParameters.itemId;
      }
      else
        this.isTempuraryItem = true;
    }

    else {
      let peopleInTripIndex = this.generalFormService.details.findIndex(i => i.key === 'peopleInTrip');
      this.generalFormService.details[peopleInTripIndex].value = (this.generalFormService.peopleInTrip).toString();
    }
    this.generalFormService.setDatesValues();
    if (this.generalFormService.tripInfo.trip.tripStatus.id != 10)
      this.getSupplierList(this.orderType, this.tripId, 0);
    else {
      if (!this.isItemOrderExist)
        this.getSupplierByOrderType();
      else {
        // need add field to order model
        // let supplierName= this.item.order?.supplier.name;
        //  this.generalFormService.supplierList.push({ label: supplierName, value: this.supplierId.toString() });
        // this.generalFormService.details[0].inputProps.options= this.generalFormService.supplierList
        // this.generalFormService.details[0].value = this.supplierId.toString();
        this.getSupplierByOrderType(); // it's tempurary
        //this.getOrderItemBySupplierId();
      }
    }
    this.getLanguages();

  }

  setformTemplate() {
    let index = this.generalFormService.questionGroups.findIndex(el => el.key === "details");
    this.generalFormService.questionGroups[index].questions = this.generalFormService.details;
    //let detailsArr = this.generalFormService.details;
    let detailsArr = this.generalFormService.questionGroups[index].questions;
    detailsArr = this.changeLabels(detailsArr);
    let guideNameIndex = this.generalFormService.guidance.findIndex(i => i.key == 'guideName')
    this.generalFormService.guidance[guideNameIndex].value = '';
    let languageGuidanceIndex = this.generalFormService.guidance.findIndex(i => i.key == 'languageGuidance')
    this.generalFormService.guidance[languageGuidanceIndex].value = '';
    let guideInstructionsIndex = this.generalFormService.guidance.findIndex(i => i.key == 'guideInstructions')
    this.generalFormService.guidance[guideInstructionsIndex].value = '';
    let guideQuestions = detailsArr.concat(this.generalFormService.guidance);
    this.generalFormService.questionGroups[index].questions = guideQuestions;
    //this.formTemplate.questionsGroups = this.generalFormService.questionGroups;

  }
  changeLabels(tempArr) {
    console.log('tempArr is :', tempArr);
    let startDateIndex = tempArr.findIndex(el => el.key === 'startDate');
    tempArr[startDateIndex].label = 'מתאריך';
    let endDateIndex = tempArr.findIndex(el => el.key === 'endDate');
    tempArr[endDateIndex].label = 'עד תאריך';
    let startHourIndex = tempArr.findIndex(el => el.key === 'startHour');
    tempArr[startHourIndex].label = 'שעת התייצבות';
    let endHourIndex = tempArr.findIndex(el => el.key === 'endHour');
    tempArr[endHourIndex].label = 'שעת פיזור';
    let locationIndex = tempArr.findIndex(el => el.key === 'location');
    tempArr[locationIndex].label = 'מקום התייצבות';
    return tempArr;
  }

  initiateForm() {
    this.ifInitiateFormflag = true;
    this.formTemplate.questionsGroups = this.generalFormService.questionGroups;
    console.log('this.formTemplate.questionsGroups:', this.formTemplate.questionsGroups)
  }

  displayTable() {
    let transArr = this.generalFormService.gudianceOrderList;
    let currentObj = transArr.find(i => (i.globalParameters.itemOrderRecordId) === (this.item.globalParameters.itemOrderRecordId) && (i.globalParameters.supplierId) === (this.item.globalParameters.supplierId));
    let arr = []
    arr.push(currentObj);
    this.tableData = arr;
    this.ifShowtable = true;

  }

  getSupplierList(orderTypeId, tripId, orderId) {

    this.supplierListSub = this.orderService.getSupplierList(orderTypeId, tripId, orderId).subscribe(

      response => {
        console.log(response);
        this.generalFormService.supplierList = [];
        this.generalFormService.originalSupplierList = response;
        response.forEach(element => {
          this.generalFormService.supplierList.push({ label: element.name, value: element.id.toString() });
        });
        let supplierIndex = this.generalFormService.details.findIndex(i => i.key === 'supplierId');
        this.generalFormService.details[supplierIndex].inputProps.options = this.generalFormService.supplierList;
        if (this.supplierId == undefined)
          this.getSupplierByOrderType();
        else {
          this.generalFormService.details[supplierIndex].value = this.supplierId.toString();
          this.getOrderItemBySupplierId()
        }

      },
      error => console.log(error),       // error
      () => console.log('completed')     // complete
    )
  }

  getSupplierByOrderType() {
    this.supplierSub = this.orderService.getSupplierByOrderType(this.orderType, this.centerFieldId).subscribe(
      response => {
        console.log(response);
        this.supplierId = response.id;
        if (response.isXemptedFromVat == 1)
          this.isSupplierXemptedFromVat = true;
        else
          this.isSupplierXemptedFromVat = false;
        let supplierIndex = this.generalFormService.details.findIndex(i => i.key === 'supplierId');
        if (this.generalFormService.details[supplierIndex].inputProps?.options?.length > 0)
          this.generalFormService.details[supplierIndex].value = this.supplierId.toString();
        else {
          this.generalFormService.supplierList.push({ label: response.name, value: response.id.toString() });
          this.generalFormService.details[supplierIndex].inputProps.options = this.generalFormService.supplierList;
          this.generalFormService.details[supplierIndex].value = this.supplierId.toString();
        }
        this.getOrderItemBySupplierId();

      },
      error => console.log(error),       // error
      () => console.log('completed')     // complete
    )

  }



  getOrderItemBySupplierId() {
    this.itemListSub = this.orderService.getOrdersItemBySupplierID(this.supplierId, this.centerFieldId, false).subscribe(
      response => {
        console.log(response);
        this.itemsList = [];
        this.originalItemList = response;
        this.generalFormService.originalItemList = response;
        response.forEach(element => {
          this.itemsList.push({ label: element.name, value: element.id.toString() });
        });
        let itemIndex = this.generalFormService.details.findIndex(i => i.key === 'itemId');
        this.generalFormService.details[itemIndex].inputProps.options = this.itemsList;
        if (this.form)
          return;
        if (this.itemId != undefined)
          this.generalFormService.details[itemIndex].value = this.itemId.toString();
        if (this.item != undefined && this.item != null) {
          this.item.globalParameters.supplierId = this.supplierId.toString();
          if (this.item.globalParameters.orderId)
            this.isItemOrderExist = true;
          this.generalFormService.setFormValues(this.item, this.isItemOrderExist);
        }
        this.initiateForm();
        if (this.item != undefined && this.item != null) {
          if (this.item.globalParameters.supplierId != undefined && this.item.globalParameters.itemId != undefined)
            this.displayTable();
        }
      },
      error => console.log(error),       // error
      () => console.log('completed')     // complete
    )
  }

  getLanguages() {
    this.languageSub = this.userService.getLanguages().subscribe(res => {
      console.log(res);
      res.forEach(element => {
        this.generalFormService.languageList.push({ label: element.name, value: element.id });
      })
      let languageIndex = this.generalFormService.details.findIndex(i => i.key === 'languageGuidance');
      this.generalFormService.details[languageIndex].inputProps.options = this.generalFormService.languageList;
    }, (err) => {

      console.log(err);
    })
  }


  public onSave(): void {
    if (this.form) {
      //if (!this.additionsService.globalValidations(this.form)) { return; }
      //if (!this.validationsGudiance()) { return; }
      let item = this.generalFormService.originalItemList.find(el => el.id.toString() === this.form.value.details['itemId']);
      // if((item.credit!=1 || item.orderItemDetails.classroomTypeId==null)){
      if (item?.amountLimit != null) {
        this.orderService.checkItemsExistInDateTime(this.tripId,
          this.centerFieldId, item).subscribe(res => {
            if (res.isOccupancyProblem == true) {
              this._dialog.open(ConfirmDialogComponent, {
                width: '500px',
                data: { message: res, content: '' }
              })
              return;
            }
            else {
              this.validationItem();
            }
          })
      }
      else {
        this.validationItem();
      }

    }
  }
  validationItem() {
    if (!this.additionsService.globalValidations(this.form)) { return; }
    if (!this.validationsGudiance()) { return; }
    this.mapFormFieldsToServer()
  }
  public mapFormFieldsToServer() {
    let orderId;
    if (this.generalFormService.gudianceOrderList.length > 0) {
      orderId = this.generalFormService.gudianceOrderList[0].order.orderId
    }
    let guide = {} as GuidanceOrder;
    guide.globalParameters = {} as OrderItemCommonDetails;
    guide.order = {} as Order;
    if (orderId != undefined && orderId)
      guide.order.orderId = orderId;
    guide.order.supplier = {} as Supplier;
    guide.order.orderType = {} as OrderType;
    Object.keys(this.form.getRawValue().details).map((key, index) => {
      if (key !== 'scatterLocation' && key !== 'guideName' && key !== 'languageGuidance' && key !== 'guideInstructions') {
        if (key != 'startDate' && key != 'endDate') {
          guide.globalParameters[key] = this.form.getRawValue().details[key]
        } else {
          if (key == 'startDate') {
            guide.globalParameters[key] = this.generalFormService.changeDateFormat(this.form.getRawValue().details[key], 'UTC')
          }
          if (key == 'endDate') {
            guide.globalParameters[key] = this.generalFormService.changeDateFormat(this.form.getRawValue().details[key], 'UTC')
          }
        }
      }
      else {
        guide.scatterLocation = this.form.getRawValue().details['scatterLocation'];
        guide.guideName = this.form.getRawValue().details['guideName'];
        guide.languageGuidance = this.form.getRawValue().details['languageGuidance'];
        guide.guideInstructions = this.form.getRawValue().details['guideInstructions'];
      }

    });
    guide.globalParameters['startHour'] = this.setDateTimeFormat(guide.globalParameters.startDate, guide.globalParameters.startHour);
    guide.globalParameters['endHour'] = this.setDateTimeFormat(guide.globalParameters.endDate, guide.globalParameters.endHour);
    guide.globalParameters['comments'] = this.form.getRawValue().comments.comments;
    guide.globalParameters.orderId = orderId;
    guide.order.supplier.id = +this.form.getRawValue().details.supplierId;
    guide.order.tripId = this.tripId;
    guide.order.orderType.name = 'הדרכה';
    guide.order.orderType.id = this.orderType;
    if (this.item != undefined) {
      if (this.item.globalParameters.tempOrderIdentity != undefined)
        guide.globalParameters.tempOrderIdentity = this.item.globalParameters.tempOrderIdentity;
    }

    if (!this.isEditable) {
      //this.generalFormService.addOrder(guide, guide.order.orderType.id);
      this.addOrder(guide);
    }
    else {
      guide.globalParameters.itemOrderRecordId = this.itemOrderRecordId;
      //this.generalFormService.editOrder(guide, guide.order.orderType.id);
      this.editOrder(guide)
    }

    this.form.disable({ emitEvent: false });
  }

  addOrder(item) {
    this.addOrderSub = this.orderService.addOrder(item).subscribe(res => {
      console.log(res);
      this.itemOrderRecordId = res[res.length - 1].globalParameters.itemOrderRecordId
      this.tableData = res;
      this.ifShowtable = true;
      this.editMode = true;
      this.generalFormService.setOrderList(res, this.orderType, 'adding', this.isTempuraryItem);
      this.setDialogMessage('ההזמנה נשמרה בהצלחה');
      this.generalFormService.enableButton.next(true);
    }, (err) => {
      console.log(err);
      this.editMode = false;
      this.form.enable({ emitEvent: false });
      this.setDialogMessage('אירעה שגיאה בשמירת ההזמנה, נא פנה למנהל המערכת');
    })
  }

  editOrder(item) {
    this.editOrderSub = this.orderService.editOrder(item).subscribe(res => {
      console.log(res);
      this.generalFormService.setOrderList(res, this.orderType, 'updating', false);
      this.editMode = true;
      this.setDialogMessage('ההזמנה עודכנה בהצלחה');
    }, (err) => {
      console.log(err);
      this.ifShowtable = false;
      this.editMode = false;
      this.form.enable({ emitEvent: false });
      this.setDialogMessage('אירעה שגיאה בעדכון ההזמנה, נא פנה למנהל המערכת');
    })
  }

  setDialogMessage(message) {
    const dialogRef = this._dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: { message: message, content: '', leftButton: 'אישור' }
    })
  }


  validationsGudiance() {
    if (this.generalFormService.originalItemList.length > 0) {
      var item = this.generalFormService.originalItemList.find(el => el.id.toString() === this.form.value.details['itemId']);
    }
    if (item.credit === 0) {
      if (this.form.value.details['startHour'] === null || this.form.value.details['startHour'] === "" || this.form.value.details['startHour'] === undefined) {
        this.setDialogMessage('בהזמנת הדרכה - חובה למלא שעת התייצבות');
        return false;
      }
      if (this.form.value.details['location'] === null || this.form.value.details['location'] === "" || this.form.value.details['location'] === undefined) {
        this.setDialogMessage('בהזמנת הדרכה - חובה למלא מקום התייצבות');
        return false;
      }
    }
    // אם הפריט הוא תוספת ריכוז חובה להכניס הערה
    if (item.id == 234) {
      if (this.form.value.comments['comments'] === null || this.form.value.comments['comments'] === "" || this.form.value.comments['comments'] === undefined) {
        this.setDialogMessage('חובה למלא הערה בפריט - תוספת ריכוז');
        return false;
      }
    }
    // הרד קודד - צריך עדכון DB
    // אם הפריט הוא ריכוז מחנה וגם הטיול חוץ מרכז שדה לא לאפשר לשבץ מדריך לפריט זה
    if ((item.id == 25 || item.id == 152 || item.id == 218 ||
      item.id == 219 || item.id == 229 || item.id == 235 || item.id == 271)
      && this.generalFormService.tripInfo.trip.insideCenterFieldId == 2) {
      this.setDialogMessage('לא ניתן לשבץ מדריך לטיול שהוא חוץ מרכז שדה בפריט ריכוז מחנה');
      return false;
    }
    if (this.generalFormService.isOneDayTrip && item.isNight === 1) {
      this.setDialogMessage('לא ניתן להוסיף פריט לינה לטיול חד יומי');
      return false;
    }
    // chani

    // צריך טיפול בהרשאות- בינתיים , מתייחסים להרשאה כהרשאה קבועה - משווק
    // צריך תנאי האם ההרשאה היא אכן משווק
    // אם הפריט זיכוי (וההרשאה משווק)
    // if (item.credit == 1) {
    //   this.setDialogMessage('פריט מסוג זיכוי מצריך אישור חשב');
    //   return false;
    // }
    // אם הפריט מצריך אישור של מנהל מחלקה וגם אם הוא מסוג זיכוי
    if (item.isNeedManagerApproval == 1) {
      this.setDialogMessage('פריט  מצריך אישור מנהל מחלקה');
      return false;
    }
    // לא לכל ההרשאות
    if (item.id == 220) {
      this.setDialogMessage('אין לך הרשאה לקלוט פריט זה');
      return false;
    }
    // typeSleepId
    // בדיקה שהפריט שישי שבת
    // או חג
    if (item.itemId == 219) {
      if (item.startDate.getDay() != 6 || item.endDate.getDay() != 7) {
        // בדיקה שזה לא יוצא חג- ואם כן שאלה האם להמשיך , צריך לברר מול חיה
        if (this.isHoliday()) {
          const dialogRef = this._dialog.open(ConfirmDialogComponent, {
            width: '500px',
            data: { message: ' ', content: '', }
          })
        }
        else {
          const dialogRef = this._dialog.open(ConfirmDialogComponent, {
            width: '500px',
            data: { message: '"פריט זה לא מתאים לתאריכי הטיול" ', content: '', leftButton: 'אישור' }
          })
          return false;
        }
      }
    }

    // אין להוסיף פריטים "תוספת לינה" ו"תוספת פעילות לילה" (419, 177) לאותו לילה בטיול
    // צרך בדיקה אם זה אכן מבצע את הבדיקה הזאת בצורה נכונה
    if (item.id === 177 || item.id === 419) {
      var arr = this.generalFormService.gudianceOrderList.filter(item => item.globalParameters.itemId === 177 || item.globalParameters.itemId === 419)
      //   if() {
      //   this.setDialogMessage('אין להזין את הפריטים: תוספת לינת לילה ותוספת פעילות לילה לאותו לילה בטיול')
      //   return false;
      // }
    }
    var listDays = this.getDaysArray(this.convertToDate(this.form.value.details['startDate']), this.convertToDate(this.form.value.details['endDate']));
    var isWeekend = listDays.forEach(day => { if (day.getDay() === 6 || day.getDay() === 0) return true; else return false; })
    // if(isWeekend&&item.id//sat or fri)
    // this.setDialogMessage('פריט  שבת חג');
    //       return false;
    return true;
  }
  getDaysArray(startDate, endDate) {
    var dateArray = new Array();
    var currentDate = startDate;
    while (currentDate <= endDate) {
      dateArray.push(new Date(currentDate));
      currentDate = currentDate.setDate(currentDate.getDate() + 1);
    }
    return dateArray;
  }
  convertToDate(dateString) {
    //  Convert a "dd/MM/yyyy" string into a Date object
    let d = dateString.split("/");
    let dat = new Date(d[2] + '/' + d[1] + '/' + d[0]);
    return dat;
  }




  // chani- from PB
  // צריך להיות כללי
  isHoliday() {
    // var hebrewDate = require("hebrew-date");
    // console.log(hebrewDate(2016, 10, 2));

    // רשימה של חגים בלוח השנה העברי
    // מחזיר האם
    return true;
  }

  setDateTimeFormat(date, hour) {
    let str = date.split("T");
    let hourFormat = str[0] + 'T' + hour;
    return hourFormat;
  }

  public onEdit() {
    this.editMode = false;
    this.isEditable = true;
    this.form.enable({ emitEvent: false });
    this.disableFormFields();
  }

  public onValueChange(event) {
    this.form = event;
    this.disableFormFields();

    if(this.isItemOrderExist && this.editMode==true)
    this.form.disable({ emitEvent: false });
    this.supplierIdEventSub= this.form.controls["details"].get('supplierId').valueChanges.pipe(distinctUntilChanged())
      .subscribe(value => {
        console.log('supplier changed:', value);
        this.supplierId = value;
        if (this.valueChangeIndex > 0)
          this.form.controls["details"].get('itemId').patchValue('', { emitEvent: false });
        let supplier = this.generalFormService.originalSupplierList.find(i => i.id === +value);
        if (supplier.isXemptedFromVat == 1)
          this.isSupplierXemptedFromVat = true;
        else
          this.isSupplierXemptedFromVat = false;
        if (this.valueChangeIndex > 0)
          this.getOrderItemBySupplierId();
        this.valueChangeIndex++
      });
    this.itemIdEventSub = this.form.controls["details"].get('itemId').valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
      this.valueChangeIndex++;
      //let item = this.originalItemList.find(el => el.id === parseInt(value))
      this.selectedItem = this.originalItemList.find(el => el.id === parseInt(value))
      if (this.selectedItem?.isSumPeopleOrAmount == 1 || this.selectedItem?.isSumPeopleOrAmount == 0 || this.selectedItem?.isSumPeopleOrAmount == null)
        this.ifCalculateByQuantity = true;
      else
        this.ifCalculateByQuantity = true;
      let itemCost;
      if (this.isSupplierXemptedFromVat == true) {
        itemCost = (Math.round(this.selectedItem.cost * 100) / 100).toFixed(2);
      }
      else
        itemCost = this.selectedItem.costVat;
      this.form.controls["details"].get('itemCost').setValue(itemCost, { emitEvent: false });
      this.calculate();
      if (!this.selectedItem.cost) {
        this.setSupplierBillingZero();
      }
      if (!this.selectedItem.costCustomer) {
        this.setCustomerBillingZero();
      }
    });

    this.quantityEventSub = this.form.controls["details"].get('quantity').valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
      if (this.ifCalculateByQuantity) {
        this.calculate();
        if (!this.selectedItem.cost) {
          this.setSupplierBillingZero();
        }
        if (!this.selectedItem.costCustomer) {
          this.setCustomerBillingZero();
        }
      }
      else
        return;
    });


    this.peopleInTripEventSub = this.form.controls["details"].get('peopleInTrip').valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
      if (!this.ifCalculateByQuantity) {
        this.calculate();
        if (!this.selectedItem.cost) {
          this.setSupplierBillingZero();
        }
        if (!this.selectedItem.costCustomer) {
          this.setCustomerBillingZero();
        }
      }
      else
        return;

    });

    this.startDateEventSub = this.form.controls["details"].get('startDate').valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
      this.calculate();
      if (!this.selectedItem.cost) {
        this.setSupplierBillingZero();
      }
      if (!this.selectedItem.costCustomer) {
        this.setCustomerBillingZero();
      }
    });
    this.endDateEventSub = this.form.controls["details"].get('endDate').valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
      this.calculate();
      if (!this.selectedItem.cost) {
        this.setSupplierBillingZero();
      }
      if (!this.selectedItem.costCustomer) {
        this.setCustomerBillingZero();
      }
    });
    console.log(this.form)

  }

  calculate() {
    let form = this.additionsService.calculateBillings(this.form.value.details, this.isSupplierXemptedFromVat);
    this.form.controls["details"].get('billingSupplier').patchValue(form.billingSupplier, { emitEvent: false });
    this.form.controls["details"].get('billingCustomer').patchValue(form.billingCustomer, { emitEvent: false });
  }

  setSupplierBillingZero() {
    this.form.controls["details"].get('itemCost').setValue(0, { emitEvent: false });
    this.form.controls["details"].get('billingSupplier').patchValue(0, { emitEvent: false });
  }

  setCustomerBillingZero() {
    this.form.controls["details"].get('billingCustomer').patchValue(0, { emitEvent: false });
  }

  // new am-pm
 setDefaultTime(question) {
  console.log('question of startHour is : ',question);
  if(!question.value)
  return "00:00";
  else{
    return question.value;  
  }
}
setDefaultTime1(question) {
  console.log('question of endHour is : ',question);
  if(!question.value)
  return "00:00";
  else{
    return question.value;
  } 
}

public startTimeChanged(event: string) {
  let timeFormat = this.setTimeFormat(event);
  this.form.controls["details"].get('startHour').patchValue(timeFormat, { emitEvent: false });
}

public endTimeChanged(event: string) {
  let timeFormat = this.setTimeFormat(event);
  this.form.controls["details"].get('endHour').patchValue(timeFormat, { emitEvent: false });
}
setTimeFormat(event) {
  let timeArr = event.split(':');
  let hour = timeArr[0];
  let timeFormat;
  if (+hour < 10) {
    hour = 0 + hour;
    timeFormat = hour + ':' + timeArr[1];
  }
  else
    timeFormat = event;
  return timeFormat;
}
// end new am-pm

  disableFormFields() {
    this.form.controls["details"].get('billingSupplier').disable({ emitEvent: false });
    this.form.controls["details"].get('billingCustomer').disable({ emitEvent: false });
    this.form.controls["details"].get('itemCost').disable({ emitEvent: false });
    this.form.controls["details"].get('guideName').disable({ emitEvent: false });
    this.form.controls["details"].get('quantity').disable({ emitEvent: false });
    if (this.generalFormService.tripInfo.trip.tripStatus.id == 10)
      this.form.controls["details"].get('supplierId').disable({ emitEvent: false });
  }


  ngOnDestroy() {
    if (this.supplierListSub) { this.supplierListSub.unsubscribe(); }
    if (this.supplierSub) { this.supplierSub.unsubscribe(); }
    if (this.itemListSub) { this.itemListSub.unsubscribe(); }
    if (this.addOrderSub) { this.addOrderSub.unsubscribe(); }
    if (this.editOrderSub) { this.editOrderSub.unsubscribe() }
    if (this.supplierIdEventSub) { this.supplierIdEventSub.unsubscribe() }
    if (this.itemIdEventSub) { this.itemIdEventSub.unsubscribe() }
    if (this.startDateEventSub) { this.startDateEventSub.unsubscribe() }
    if (this.endDateEventSub) { this.endDateEventSub.unsubscribe() }
    if (this.quantityEventSub) { this.quantityEventSub.unsubscribe() }
    if (this.peopleInTripEventSub) { this.peopleInTripEventSub.unsubscribe() }
  }
}
