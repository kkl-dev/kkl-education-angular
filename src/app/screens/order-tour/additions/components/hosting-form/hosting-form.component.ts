import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormTemplate } from 'src/app/components/form/logic/form.service';
import { TableCellModel } from 'src/app/utilities/models/TableCell';
import { AdditionsService } from '../../services/additions.service';
import { HostingOrder, OccupancyValidation, Order, OrderItemCommonDetails, OrderService, OrderType, Supplier, TransportOrder, UserService } from 'src/app/open-api';
import { SquadAssembleService } from '../../../squad-assemble/services/squad-assemble.service';
import { GeneralFormService } from '../../services/general-form.service';
import { ConfirmDialogComponent } from 'src/app/utilities/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { TripService } from 'src/app/services/trip.service';

@Component({
  selector: 'app-hosting-form',
  templateUrl: './hosting-form.component.html',
  styleUrls: ['./hosting-form.component.scss']
})
export class HostingFormComponent implements OnInit, OnDestroy {

  constructor(private _dialog: MatDialog, private generalFormService: GeneralFormService, private squadAssembleService: SquadAssembleService, private additionsService: AdditionsService, private orderService: OrderService,
    private tripService: TripService) { }
  @Input() public item: any;
  @Input() public editMode: boolean;
  @Input() orderType: number;
  tripId: number;
  originalItemList = [];
  itemsList = []
  supplierId: number;
  itemId: number;
  centerFieldId: number;
  ifInitiateFormflag: boolean = false;
  isEditable: boolean = false;
  public form: FormGroup;
  public columns: TableCellModel[];
  ifShowtable: boolean = false;
  tableData: any;
  isItemOrderExist: boolean;
  isTempuraryItem: boolean; 
  isSupplierXemptedFromVat: boolean;
  occupancyValidation: OccupancyValidation;
  valueChangeIndex = 0;
  ifCalculateByQuantity: boolean;
  itemOrderRecordId: number;
  selectedItem :any;
  orderId: number;
  hostingItem: any;
  // close subsribe:
  supplierListSub: Subscription;
  supplierSub: Subscription;
  itemListSub: Subscription;
  addOrderSub: Subscription;
  editOrderSub: Subscription;
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
        this.itemOrderRecordId=this.item.globalParameters.itemOrderRecordId;
        this.isTempuraryItem=false;
        this.editMode = true;
        this.supplierId = this.item.globalParameters.supplierId;
        this.itemId = this.item.globalParameters.itemId;
      }
      else
      this.isTempuraryItem=true;
    }
    else {
      let peopleInTripIndex = this.generalFormService.details.findIndex(i => i.key === 'peopleInTrip');
      this.generalFormService.details[peopleInTripIndex].value = (this.generalFormService.peopleInTrip).toString();
    }
    this.generalFormService.setDatesValues();
    if(this.generalFormService.tripInfo.trip.tripStatus.id != 10)
    this.getSupplierList(this.orderType, this.tripId, 0);
    else{
      if( !this.isItemOrderExist)
      this.getSupplierByOrderType();
      else{
          // need add field to order model
          // let supplierName= this.item.order?.supplier.name;
          //  this.generalFormService.supplierList.push({ label: supplierName, value: this.supplierId.toString() });
          // this.generalFormService.details[0].inputProps.options= this.generalFormService.supplierList
          // this.generalFormService.details[0].value = this.supplierId.toString();
          this.getSupplierByOrderType(); // it's tempurary
          //this.getOrderItemBySupplierId();
      }
    }
   //this.getSupplierByOrderType();
  }

  setformTemplate() {
    let index = this.generalFormService.questionGroups.findIndex(el => el.key === "details");
    let detailsArr = this.generalFormService.details;
    detailsArr = this.changeLabels(detailsArr);
    this.generalFormService.questionGroups[index].questions = detailsArr;
    this.formTemplate.questionsGroups = this.generalFormService.questionGroups;

  }
  changeLabels(tempArr) {
    console.log('tempArr is :', tempArr);

    let startDateIndex = tempArr.findIndex(el => el.key === 'startDate');
    tempArr[startDateIndex].label = 'מתאריך';
    let endDateIndex = tempArr.findIndex(el => el.key === 'endDate');
    tempArr[endDateIndex].label = 'עד תאריך';
    let startHourIndex = tempArr.findIndex(el => el.key === 'startHour');
    tempArr[startHourIndex].label = 'שעת הגעה';
    let endHourIndex = tempArr.findIndex(el => el.key === 'endHour');
    tempArr[endHourIndex].label = 'שעת יציאה';
    let locationIndex = tempArr.findIndex(el => el.key === 'location');
    tempArr[locationIndex].label = 'כתובת';
    return tempArr;
  }

  initiateForm() {
    this.ifInitiateFormflag = true;
    this.formTemplate.questionsGroups = this.generalFormService.questionGroups;
    console.log('this.formTemplate.questionsGroups:', this.formTemplate.questionsGroups)
  }

  displayTable() {
    let transArr = this.generalFormService.hostingOrderList;
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
        if (this.generalFormService.details[supplierIndex].inputProps?.options?.length>0)
        this.generalFormService.details[supplierIndex].value = this.supplierId.toString();
        else{
          this.generalFormService.supplierList.push({ label: response.name, value: response.id.toString() });
          this.generalFormService.details[supplierIndex].inputProps.options= this.generalFormService.supplierList;
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
        if (this.form) {
          return
        }

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

  public onSave(): void {
       if (this.generalFormService.originalItemList.length > 0) {
      this.hostingItem = this.generalFormService.originalItemList.find(el => el.id.toString() === this.form.value.details['itemId']);
    }
    if (this.form) {
      if (!this.additionsService.globalValidations(this.form)) { return; }
      if (!this.validationsHosting()) { return; }
      var centerFieldObj = JSON.parse(localStorage.getItem('centerFieldObj'));
      var typeSleep = centerFieldObj.accommodationList.filter(x => x.id == this.hostingItem.typeSleepId)[0];
      this.occupancyValidation = {} as OccupancyValidation;
      this.occupancyValidation.centerFieldId = this.centerFieldId;
      this.occupancyValidation.tripId = this.tripId;
      this.occupancyValidation.startDate = this.generalFormService.changeDateFormat(this.form.getRawValue().details['startDate'], 'UTC')
      this.occupancyValidation.endDate = this.generalFormService.changeDateFormat(this.form.getRawValue().details['endDate'], 'UTC')
      this.occupancyValidation.quantityItem = +this.form.value.details['quantity'];
      this.occupancyValidation.startHour = this.setDateTimeFormat(this.occupancyValidation.startDate, this.form.getRawValue().details['startHour']);
      this.occupancyValidation.endHour = this.setDateTimeFormat(this.occupancyValidation.endDate, this.form.getRawValue().details['endHour']);
      if (this.isEditable) {

        if (this.isItemOrderExist) {
          this.occupancyValidation.orderId = this.item.globalParameters.orderId;
          this.occupancyValidation.itemOrderRecordId = this.item.globalParameters.itemOrderRecordId;
        }
        else {
          this.occupancyValidation.orderId = this.orderId;
          this.occupancyValidation.itemOrderRecordId = this.itemOrderRecordId;
        }

      }
      if (this.hostingItem.classroomTypeId !== null) {//כיתה
        this.occupancyValidation.classCode = this.hostingItem.classroomTypeId;
        this.orderService.checkClassOccupancy(this.occupancyValidation).subscribe(res => {
          if (res.isOccupancyProblem) {
            this.setDialogMessage(res.message + 'checkClassOccupancy'); return;
          }
          else {
            if (this.hostingItem.numHoursNeeded !== null) {
              var hours = (new Date(this.occupancyValidation.endHour).getTime() - new Date(this.occupancyValidation.startHour).getTime()) / 3600000;
              if (hours > this.hostingItem.numHoursNeeded) {
                this.setDialogMessage('פריט זה אינו זמין למספר השעות שנבחרו'); return;
              }
            }
            this.mapFormFieldsToServer()
          }
        })
      }
      else if (this.hostingItem.typeSleepId !== null) {//לילי
        this.occupancyValidation.typeSleepId = this.hostingItem.typeSleepId;
        this.orderService.checkHostingOccupancy(this.occupancyValidation).subscribe(res => {
          if (res.isOccupancyProblem) {
            this.setDialogMessage(res.message + 'checkHostingOccupancy'); return;
          }
          else {
            this.orderService.checkHoursOccupancyPerItemInOrder(this.occupancyValidation).subscribe(res => {
              if (res.isOccupancyProblem) {
                //this.setDialogMessage(res.message + 'checkHoursOccupancyPerItemInOrder'); return;
                this.setDialogMessage(res.message ); return;
              }
              else { this.mapFormFieldsToServer() }
            })
          }
        })
      }
      else{
        this.mapFormFieldsToServer();
      }
    }
  }
 
  mapFormFieldsToServer() {
    let orderId;
    if (this.generalFormService.hostingOrderList.length > 0) {
      orderId = this.generalFormService.hostingOrderList[0].order.orderId
    }
    let hosting = {} as HostingOrder;
    hosting.globalParameters = {} as OrderItemCommonDetails;
    hosting.order = {} as Order;
    if (orderId != undefined && orderId)
      hosting.order.orderId = orderId;
    hosting.order.supplier = {} as Supplier;
    hosting.order.orderType = {} as OrderType;
    Object.keys(this.form.getRawValue().details).map((key, index) => {

      if (key != 'startDate' && key != 'endDate') {
        hosting.globalParameters[key] = this.form.getRawValue().details[key]
      } else {
        if (key == 'startDate') {
          hosting.globalParameters[key] = this.generalFormService.changeDateFormat(this.form.getRawValue().details[key], 'UTC')
        }
        if (key == 'endDate') {
          hosting.globalParameters[key] = this.generalFormService.changeDateFormat(this.form.getRawValue().details[key], 'UTC')
        }
      }
    });
    hosting.globalParameters['startHour'] = this.setDateTimeFormat(hosting.globalParameters.startDate, hosting.globalParameters.startHour);
    hosting.globalParameters['endHour'] = this.setDateTimeFormat(hosting.globalParameters.endDate, hosting.globalParameters.endHour);
    hosting.globalParameters['comments'] = this.form.getRawValue().comments.comments;
    hosting.globalParameters.orderId = orderId;
    hosting.order.supplier.id = +this.form.getRawValue().details.supplierId;
    hosting.order.tripId = this.tripId;
    hosting.order.orderType.name = 'פעילות/אירוח';
    hosting.order.orderType.id = this.orderType;
    if (this.item != undefined) {
      if (this.item.globalParameters.tempOrderIdentity != undefined)
        hosting.globalParameters.tempOrderIdentity = this.item.globalParameters.tempOrderIdentity;
    }
    if (!this.isEditable) {
      //this.generalFormService.addOrder(hosting, hosting.order.orderType.id);
      this.addOrder(hosting);
    }
    else {
      hosting.globalParameters.itemOrderRecordId = this.itemOrderRecordId;
      //this.generalFormService.editOrder(hosting, hosting.order.orderType.id);
      this.editOrder(hosting)
    }
    this.form.disable({ emitEvent: false });
  }
  addOrder(item) {
    this.addOrderSub = this.orderService.addOrder(item).subscribe(res => {
      console.log(res);
      //this.orderId= res[0].globalParameters.orderId;
      this.itemOrderRecordId= res[res.length-1].globalParameters.itemOrderRecordId;
      this.itemOrderRecordId = res[0].globalParameters.itemOrderRecordId;
      this.tableData = res;
      this.ifShowtable = true;
      this.generalFormService.enableButton.next(true);
      this.editMode = true;
      this.generalFormService.setOrderList(res, this.orderType, 'adding',this.isTempuraryItem);
      this.setDialogMessage('ההזמנה נשמרה בהצלחה');
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
      this.generalFormService.setOrderList(res, this.orderType, 'updating',false);
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
      data: { message: message, content: '', rightButton: 'ביטול', leftButton: 'אישור' }
    })
  }
  validationsHosting() {

    if (this.form.value.details['startHour'] === null || this.form.value.details['startHour'] === "" || this.form.value.details['startHour'] === undefined) {
      const dialogRef = this._dialog.open(ConfirmDialogComponent, {
        width: '500px',
        data: { message: 'בהזמנת ארוח - חובה למלא שעת התייצבות', content: '', rightButton: 'ביטול', leftButton: 'אישור' }
      })
      return false;
    }

    if (this.form.value.details['endHour'] === null || this.form.value.details['endHour'] === "" || this.form.value.details['endHour'] === undefined) {
      const dialogRef = this._dialog.open(ConfirmDialogComponent, {
        width: '500px',
        data: { message: 'בהזמנת ארוח - חובה למלא שעת סיום', content: '', rightButton: 'ביטול', leftButton: 'אישור' }
      })
      return false;
    }

    // אם הפריט מסוג כיתה- לא יכול להיות בטווח של כמה ימים
    if (this.form.value.details['startDate'] !== this.form.value.details['endDate'] && this.hostingItem.classroomTypeId !== null) {
      const dialogRef = this._dialog.open(ConfirmDialogComponent, {
        width: '500px',
        data: { message: 'אין להזין טווח תאריכים של יותר מיום אחד עבור פריט כיתות', content: '', leftButton: 'אישור' }
      })
      return false;
    }

    // חובה להזין לפחות לילה אחד בפריט שלא מסוג כיתה או בישול
    // if (this.form.value.details["itemId"] !== 250 && this.hostingItem.classroomTypeId === null && this.form.value.details['startDate'] === this.form.value.details['endDate']) {
      if (this.form.value.details["itemId"] !== 250 && this.hostingItem.typeSleepId != null && this.hostingItem.typeSleepId != 0 && this.hostingItem.classroomTypeId === null && this.form.value.details['startDate'] === this.form.value.details['endDate']) {
      const dialogRef = this._dialog.open(ConfirmDialogComponent, {
        width: '500px',
        data: { message: 'בהזמנת אירוח- חובה לציין בטווח התאריכים לילה אחד לפחות. מלבד אם הפריט הוא כיתה או פריט "בישול עצמי בשטח הגיחה" (פריט 250)', content: '', leftButton: 'אישור' }
      })
      return false;
    }
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
    this.form.controls["details"].get('supplierId').valueChanges.pipe(distinctUntilChanged())
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
          this.valueChangeIndex++;
      });
    this.form.controls["details"].get('itemId').valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
      this.valueChangeIndex++;
      this.selectedItem=this.originalItemList.find(el => el.id === parseInt(value));
      if (this.selectedItem?.isSumPeopleOrAmount == 1 || this.selectedItem?.isSumPeopleOrAmount == 0 || this.selectedItem?.isSumPeopleOrAmount == null)
        this.ifCalculateByQuantity = true;
      else
        this.ifCalculateByQuantity = false;
      let itemCost;
      if (this.isSupplierXemptedFromVat == true){
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
    this.form.controls["details"].get('quantity').valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
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
    this.form.controls["details"].get('peopleInTrip').valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
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
    this.form.controls["details"].get('startDate').valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
      this.calculate();
      if (!this.selectedItem.cost) {
        this.setSupplierBillingZero();
      }
      if (!this.selectedItem.costCustomer) {
        this.setCustomerBillingZero();
      }
    });
    this.form.controls["details"].get('endDate').valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
      this.calculate();
      if (!this.selectedItem.cost) {
        this.setSupplierBillingZero();
      }
      if (!this.selectedItem.costCustomer) {
        this.setCustomerBillingZero();
      }
    });

  }

  calculate(){
    let form = this.additionsService.calculateBillings(this.form.value.details, this.isSupplierXemptedFromVat);
    this.form.controls["details"].get('billingSupplier').patchValue(form.billingSupplier, { emitEvent: false });
    this.form.controls["details"].get('billingCustomer').patchValue(form.billingCustomer, { emitEvent: false });
  }

  setSupplierBillingZero(){
    this.form.controls["details"].get('itemCost').setValue(0, { emitEvent: false });
    this.form.controls["details"].get('billingSupplier').patchValue(0, { emitEvent: false });
  }

  setCustomerBillingZero(){
    this.form.controls["details"].get('billingCustomer').patchValue(0, { emitEvent: false });
  }

 disableFormFields(){
  this.form.controls["details"].get('billingSupplier').disable({ emitEvent: false });
  this.form.controls["details"].get('billingCustomer').disable({ emitEvent: false });
  this.form.controls["details"].get('itemCost').disable({ emitEvent: false });
  if(this.generalFormService.tripInfo.trip.tripStatus.id == 10)
  this.form.controls["details"].get('supplierId').disable({ emitEvent: false });
 }

  ngOnDestroy() {
    if (this.supplierListSub) { this.supplierListSub.unsubscribe(); }
    if (this.supplierSub) { this.supplierSub.unsubscribe(); }
    if (this.itemListSub) { this.itemListSub.unsubscribe(); }
    if (this.addOrderSub) { this.addOrderSub.unsubscribe(); }
    if (this.editOrderSub) { this.editOrderSub.unsubscribe() }

  }

}
