import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormTemplate } from 'src/app/components/form/logic/form.service';
import { Order, OrderItemCommonDetails, OrderService, OrderType, Supplier, TransportOrder } from 'src/app/open-api';
import { LocationModel } from 'src/app/screens/order-tour/additions/models/location.model';
import { TableCellModel } from 'src/app/utilities/models/TableCell';
//import { TransportModel } from '../../models/transport-model';
import { AdditionsService } from '../../services/additions.service';
import { TransportService } from '../../services/transport.service';
import { GeneralFormService } from '../../services/general-form.service';
import { ConfirmDialogComponent } from 'src/app/utilities/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SquadAssembleService } from '../../../squad-assemble/services/squad-assemble.service';
import { distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-transport-form',
  templateUrl: './transport-form.component.html',
  styleUrls: ['./transport-form.component.scss'],
})
export class TransportFormComponent implements OnInit, OnDestroy {

  @Input() public item: any;
  @Input() public editMode: boolean;
  @Input() orderType: number;
  public form: FormGroup;
  public columns: TableCellModel[];
  tripId: number;
  originalItemList = [];
  itemsList = []
  supplierId: number;
  itemId: number;
  centerFieldId: number;
  ifInitiateFormflag: boolean = false;
  isEditable: boolean = false;
  ifShowtable: boolean = false;
  tableData: any;
  isItemOrderExist: boolean;
  isTempuraryItem: boolean
  isSupplierXemptedFromVat: boolean;
  ifCalculateByQuantity: boolean;
  valueChangeIndex = 0;
  itemOrderRecordId: number;
  selectedItem: any;
  // close subsribe:
  supplierListSub: Subscription;
  settlementSub: Subscription;
  supplierSub: Subscription;
  addOrderSub: Subscription;
  editOrderSub: Subscription;
  itemListSub: Subscription;
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

  constructor(private generalFormService: GeneralFormService, private transportService: TransportService, private additionsService: AdditionsService,
    private orderService: OrderService, private _dialog: MatDialog, private squadAssembleService: SquadAssembleService) { }

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
      else {
        this.isTempuraryItem = true;
      }
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
        //  let supplierName= this.item.order?.supplier.name;
        //  this.generalFormService.supplierList.push({ label: supplierName, value: this.supplierId.toString() });
        // this.generalFormService.details[0].inputProps.options= this.generalFormService.supplierList
        // this.generalFormService.details[0].value = this.supplierId.toString();
        this.getSupplierByOrderType(); // it's tempurary
        //this.getOrderItemBySupplierId(); 
      }
    }


  }

  setformTemplate() {
    let index = this.generalFormService.questionGroups.findIndex(el => el.key === "details");
    this.generalFormService.questionGroups[index].questions = this.generalFormService.details;
    let detailsArr = this.generalFormService.questionGroups[index].questions;
    detailsArr = this.changeLabels(detailsArr);
    //test 
    let scatterLocationIndex = this.generalFormService.transport.findIndex(i => i.key == 'scatterLocation')
    this.generalFormService.transport[scatterLocationIndex].value = '';
    let exitPointIndex = this.generalFormService.transport.findIndex(i => i.key == 'exitPoint')
    this.generalFormService.transport[exitPointIndex].value = '';
    //end test
    let transportQuestions = detailsArr.concat(this.generalFormService.transport);
    this.generalFormService.questionGroups[index].questions = transportQuestions;

  }

  changeLabels(tempArr) {
    console.log('tempArr is :', tempArr);
    let startDateIndex = tempArr.findIndex(el => el.key === 'startDate');
    tempArr[startDateIndex].label = 'תאריך התייצבות';
    let endDateIndex = tempArr.findIndex(el => el.key === 'endDate');
    tempArr[endDateIndex].label = 'תאריך פיזור';
    let startHourIndex = tempArr.findIndex(el => el.key === 'startHour');
    tempArr[startHourIndex].label = 'שעת התייצבות';
    let endHourIndex = tempArr.findIndex(el => el.key === 'endHour');
    tempArr[endHourIndex].label = 'שעת פיזור';
    let locationIndex = tempArr.findIndex(el => el.key === 'location');
    tempArr[locationIndex].label = 'מקום התייצבות';
    return tempArr;
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
          this.generalFormService.details[supplierIndex].inputProps.options = this.generalFormService.supplierList
          this.generalFormService.details[supplierIndex].value = this.supplierId.toString();
        }
        this.getOrderItemBySupplierId();
      },
      error => console.log(error),       // error
      () => console.log('completed')     // complete
    )

  }


  getOrderItemBySupplierId() {
    this.itemListSub = this.orderService.getOrdersItemBySupplierID(this.supplierId, this.centerFieldId, this.generalFormService.isOneDayTrip).subscribe(
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
        if (this.item != undefined && this.item != null) {
          this.item.globalParameters.supplierId = this.supplierId.toString();
          if (this.isItemOrderExist) {
            this.generalFormService.details[itemIndex].value = this.itemId.toString();
            if (this.generalFormService.settlementList.length > 0 && this.item.exitPoint != undefined) {
              let exitLocationIndex = this.generalFormService.questionGroups[0].questions.findIndex(i => i.key === 'exitPoint');
              this.generalFormService.questionGroups[0].questions[exitLocationIndex].value = this.item.exitPoint.toString();
              this.setForm();
              return;
            }
          }
        }
        this.getSettelments();

      },
      error => console.log(error),       // error
      () => console.log('completed')     // complete
    )
  }

  getSettelments() {
    this.settlementSub = this.orderService.getSettlements().subscribe(res => {
      console.log(res);
      res.forEach(element => {
        this.generalFormService.settlementList.push({ label: element.name, value: element.id.toString() })
      })
      let exitLocationIndex = this.generalFormService.questionGroups[0].questions.findIndex(i => i.key === 'exitPoint');
      this.generalFormService.questionGroups[0].questions[exitLocationIndex].inputProps.options = this.generalFormService.settlementList;
      if (this.isItemOrderExist)
        this.generalFormService.questionGroups[0].questions[exitLocationIndex].value = this.item.exitPoint.toString();
      this.setForm();

    }, (err) => {
      console.log(err);
    })
  }

  setForm() {
    if (this.item != undefined && this.item != null) {
      this.generalFormService.setFormValues(this.item, this.isItemOrderExist);
    }
    this.initiateForm();
    if (this.item != undefined && this.item != null) {
      if (this.item.globalParameters.supplierId != undefined && this.item.globalParameters.itemId != undefined)
        this.displayTable();
    }
  }

  initiateForm() {
    this.ifInitiateFormflag = true;
    this.formTemplate.questionsGroups = this.generalFormService.questionGroups;
    console.log('this.formTemplate.questionsGroups:', this.formTemplate.questionsGroups)
  }

  displayTable() {
    let transArr = this.generalFormService.transportOrderList;
    let currentObj = transArr.find(i => (i.globalParameters.itemOrderRecordId) === (this.item.globalParameters.itemOrderRecordId) && (i.globalParameters.supplierId) === (this.item.globalParameters.supplierId));
    let arr = []
    arr.push(currentObj);
    this.tableData = arr;
    this.ifShowtable = true;

  }

  public onSave(): void {
    if (this.form) {
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
    if (!this.validationsTransport()) { return; }
    this.mapFormFieldsToServer()
  }

  public mapFormFieldsToServer() {
    //this.editMode = true;
    let orderId;
    if (this.generalFormService.transportOrderList.length > 0) {
      orderId = this.generalFormService.transportOrderList[0].order.orderId
    }
    let t = {} as TransportOrder;
    t.globalParameters = {} as OrderItemCommonDetails;
    t.order = {} as Order;
    if (orderId != undefined && orderId)
      t.order.orderId = orderId;
    t.order.supplier = {} as Supplier;
    t.order.orderType = {} as OrderType;
    //Object.keys(this.form.value.details).map((key, index) => {
    Object.keys(this.form.getRawValue().details).map((key, index) => {

      if (key !== 'exitPoint' && key !== 'scatterLocation') {

        if (key != 'startDate' && key != 'endDate') {
          //t.globalParameters[key] = this.form.value.details[key];
          t.globalParameters[key] = this.form.getRawValue().details[key];
        }
        else {
          if (key == 'startDate') {
            //t.globalParameters[key] = this.generalFormService.changeDateFormat(this.form.value.details[key], 'UTC')
            t.globalParameters[key] = this.generalFormService.changeDateFormat(this.form.getRawValue().details[key], 'UTC')
          }
          if (key == 'endDate') {
            t.globalParameters[key] = this.generalFormService.changeDateFormat(this.form.getRawValue().details[key], 'UTC')
          }
        }

      }
      else {
        t.exitPoint = this.form.getRawValue().details['exitPoint'];
        t.scatterLocation = this.form.getRawValue().details['scatterLocation'];
      }
    });

    t.globalParameters['startHour'] = this.setDateTimeFormat(t.globalParameters.startDate, t.globalParameters.startHour);
    t.globalParameters['endHour'] = this.setDateTimeFormat(t.globalParameters.endDate, t.globalParameters.endHour);
    t.globalParameters['comments'] = this.form.getRawValue().comments.comments;
    t.globalParameters.orderId = orderId;
    t.order.supplier.id = +this.form.getRawValue().details.supplierId;
    t.order.tripId = this.tripId;
    t.order.orderType.name = 'היסעים';
    t.order.orderType.id = this.orderType;
    if (this.item != undefined) {
      if (this.item.globalParameters.tempOrderIdentity != undefined)
        t.globalParameters.tempOrderIdentity = this.item.globalParameters.tempOrderIdentity;
    }

    if (!this.isEditable) {
      this.addOrder(t);
    }
    else {
      t.globalParameters.itemOrderRecordId = this.itemOrderRecordId;
      this.editOrder(t)
    }
    this.form.disable({ emitEvent: false });
  }

  addOrder(item) {
    this.addOrderSub = this.orderService.addOrder(item).subscribe(res => {
      console.log(res);
      //this.itemOrderRecordId = res[0].globalParameters.itemOrderRecordId;
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

  setDateTimeFormat(date, hour) {
    let str = date.split("T");
    let hourFormat = str[0] + 'T' + hour;
    return hourFormat;
  }



  validationsTransport() {
    if (this.generalFormService.originalItemList.length > 0) {
      var item = this.generalFormService.originalItemList.find(el => el.id.toString() === this.form.value.details['itemId']);
    }
    if (item.credit === 0) {
      if (!item.name.includes("נסיעות")) {
        if (this.form.value.details['startHour'] === null || this.form.value.details['startHour'] === "" || this.form.value.details['startHour'] === undefined) {
          this.setDialogMessage('בהזמנת היסעים - חובה למלא שעת התייצבות');
          return false;
        }
        if (this.form.value.details['location'] === null || this.form.value.details['location'] === "" || this.form.value.details['location'] === undefined) {
          this.setDialogMessage('בהזמנת היסעים - חובה למלא מקום התייצבות');
          return false;
        }
      }
      if (this.form.value.details['exitPoint'] === null || this.form.value.details['exitPoint'] === "" || this.form.value.details['exitPoint'] === undefined) {
        this.setDialogMessage('בהזמנת היסעים - חובה לציין נקודת יציאה לחישוב');
        return false;
      }
      if (this.form.value.details['scatterLocation'] === null || this.form.value.details['scatterLocation'] === "" || this.form.value.details['scatterLocation'] === undefined) {
        this.setDialogMessage('בהזמנת היסעים - חובה לציין מקום פיזור');
        return false;
      }
      if (this.form.value.details['peopleInTrip'] === null || this.form.value.details['peopleInTrip'] === "" || this.form.value.details['peopleInTrip'] === undefined) {
        this.setDialogMessage('בהזמנת היסעים - חובה למלא מספר משתתפים');
        return false;
      }

      if ((item.numSeat * this.form.value.details['quantity']) < this.form.value.details['peopleInTrip'] && item.numSeat != null) {
        this.setDialogMessage('מספר המשתתפים גדול מסך המקומות באוטובוס - יש להוסיף אוטובוס נוסף');
        return false;
      }
      // var people = parseInt(this.form.value.details['peopleInTrip'])
      // if (item.numSeat != null) {
      //   console.log(people % item.numSeat)
      //   console.log(Math.floor(people / item.numSeat))
      //   if (((people % item.numSeat) > 0) && (Math.floor(people / item.numSeat) > 0)) {
      //     if (Math.floor(people / item.numSeat) < parseInt(this.form.value.details['quantity'])) {
      //       this.setDialogMessage('מספר המשתתפים קטן מסך מספר המקומות בכל האוטובוסים יחד - שים לב שלא הוזמן אוטובוס מיותר');
      //       return false;
      //     }
      //   }
      // }
    }
    return true;
  }


  public onEdit() {
    this.editMode = false;
    this.isEditable = true;
    this.form.enable({ emitEvent: false });
    this.disableFormFields();
  }

  public onValueChange(event) {
    this.form = event;
    console.log('I am form Event');
    this.disableFormFields();
    this.supplierIdEventSub = this.form.controls["details"].get('supplierId').valueChanges.pipe(distinctUntilChanged())
      .subscribe(value => {
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
    this.itemIdEventSub = this.form.controls["details"].get('itemId').valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
      this.valueChangeIndex++;
      this.selectedItem = this.originalItemList.find(el => el.id === parseInt(value))
      if (this.selectedItem?.isSumPeopleOrAmount == 1 || this.selectedItem?.isSumPeopleOrAmount == 0 || this.selectedItem?.isSumPeopleOrAmount == null)
        this.ifCalculateByQuantity = true;
      else
        this.ifCalculateByQuantity = false;
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
        console.log(value)
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

  disableFormFields() {
    this.form.controls["details"].get('billingSupplier').disable({ emitEvent: false });
    this.form.controls["details"].get('billingCustomer').disable({ emitEvent: false });
    this.form.controls["details"].get('itemCost').disable({ emitEvent: false });
    if (this.generalFormService.tripInfo.trip.tripStatus.id == 10)
      this.form.controls["details"].get('supplierId').disable({ emitEvent: false });
  }


  ngOnDestroy() {
    if (this.supplierListSub) { this.supplierListSub.unsubscribe(); }
    if (this.supplierSub) { this.supplierSub.unsubscribe(); }
    if (this.itemListSub) { this.itemListSub.unsubscribe(); }
    if (this.settlementSub) { this.settlementSub.unsubscribe(); }
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
