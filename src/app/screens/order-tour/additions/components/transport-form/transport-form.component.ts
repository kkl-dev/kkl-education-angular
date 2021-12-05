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
import { keyframes } from '@angular/animations';
import { Subscription } from 'rxjs';
import { details, summery, supplier, transportColumns } from 'src/mock_data/additions';

@Component({
  selector: 'app-transport-form',
  templateUrl: './transport-form.component.html',
  styleUrls: ['./transport-form.component.scss'],
})
export class TransportFormComponent implements OnInit, OnDestroy {

  // @Input() public transport: TransportModel;
  //@Input() public transport: TransportOrder;
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
  supplierListSub: Subscription;
  settlementSub: Subscription;
  supplierSub: Subscription;
  addOrderSub: Subscription;
  editOrderSub: Subscription;

  itemListSub: Subscription;
  ifInitiateFormflag: boolean = false;
  isEditable: boolean = false;
  ifShowtable: boolean = false;
  //tableDataSub: Subscription;
  tableData: any;
  isItemOrderExist: boolean;
  //isSaveOrderSucceededSub: Subscription;
  isSupplierXemptedFromVat: boolean;
  //ifCalculateBySumPeople : boolean;
  ifCalculateByQuantity: boolean;
  //isXemptedFromVat: boolean;
  //transQuestions:any [];
  valueChangeIndex = 0;
  itemOrderRecordId: number;
  public formTemplate: FormTemplate = {
    hasGroups: true,
    questionsGroups: [],
  };



  constructor(private generalFormService: GeneralFormService, private transportService: TransportService, private additionsService: AdditionsService,
    private orderService: OrderService, private _dialog: MatDialog, private squadAssembleService: SquadAssembleService) { }

  ngOnInit(): void {

    // if(this.squadAssembleService.tripInfofromService ! = undefined)
    // this.tripId = this.squadAssembleService.tripInfofromService.trip.id;
    // else{
    //   let retrievedObject = localStorage.getItem('tripInfofromService');
    //   let retrievedObj = JSON.parse(retrievedObject);
    //    this.tripId= retrievedObj.trip.id;
    // }
    //this.tripId = this.squadAssembleService.tripInfofromService.trip.id;
    this.tripId = this.generalFormService.tripId;
    //this.centerFieldId = this.squadAssembleService.tripInfofromService.trip.centerField.id;
    this.centerFieldId = this.generalFormService.tripInfo.trip.centerField.id;
    this.generalFormService.clearFormFields();
    this.generalFormService.itemsList = []
    //let itemIndex = this.generalFormService.details.findIndex(i => i.key === 'itemId');
    //this.generalFormService.details[itemIndex].inputProps.options = this.generalFormService.itemsList;

    this.setformTemplate();


    if (this.item != undefined && this.item != null) {
      if (this.item.globalParameters.supplierId != undefined && this.item.globalParameters.orderId) {
        this.isItemOrderExist = true;
        this.editMode = true;
        this.supplierId = this.item.globalParameters.supplierId;
        this.itemId = this.item.globalParameters.itemId;
      }
    }
    else {
      let peopleInTripIndex = this.generalFormService.details.findIndex(i => i.key === 'peopleInTrip');
      //this.generalFormService.details[peopleInTripIndex].value = this.squadAssembleService.peopleInTrip;
      this.generalFormService.details[peopleInTripIndex].value = (this.generalFormService.peopleInTrip).toString();
      //this.setformTemplate();
    }
    this.generalFormService.setDatesValues();
    this.getSupplierList(this.orderType, this.tripId, 0);

  }

  setformTemplate() {
    let index = this.generalFormService.questionGroups.findIndex(el => el.key === "details");
    this.generalFormService.questionGroups[index].questions = this.generalFormService.details;
    //let detailsArr = this.generalFormService.details;
    let detailsArr = this.generalFormService.questionGroups[index].questions;
    detailsArr = this.changeLabels(detailsArr);
    let transportQuestions = detailsArr.concat(this.generalFormService.transport);
    this.generalFormService.questionGroups[index].questions = transportQuestions;
    //this.transQuestions= transportQuestions;
    // this.formTemplate.questionsGroups = this.generalFormService.questionGroups;
    //console.log('group transport is: ', this.formTemplate.questionsGroups);

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
        this.generalFormService.details[supplierIndex].value = this.supplierId.toString();
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
        // if (this.itemId != undefined)

        if (this.item != undefined && this.item != null) {
          this.item.globalParameters.supplierId = this.supplierId.toString();
          if (this.isItemOrderExist) {
            this.generalFormService.details[itemIndex].value = this.itemId.toString();
            if (this.generalFormService.settlementList.length > 0 && this.item.exitPoint != undefined) {
              let exitLocationIndex = this.generalFormService.questionGroups[0].questions.findIndex(i => i.key === 'exitPoint');
              this.generalFormService.questionGroups[0].questions[exitLocationIndex].value = this.item.exitPoint;
              this.setForm();
              return;
            }
          }
          // this.generalFormService.setFormValues(this.item,this.isItemOrderExist);
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
            if (res.message != "false") {
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
      //this.generalFormService.addOrder(t, t.order.orderType.id);
      this.addOrder(t);
    }
    else {
      t.globalParameters.itemOrderRecordId = this.itemOrderRecordId;
      //this.generalFormService.editOrder(t, t.order.orderType.id);
      this.editOrder(t)
    }

    this.form.disable({ emitEvent: false });
    //this.editMode = true;
  }

  addOrder(item) {
    this.addOrderSub = this.orderService.addOrder(item).subscribe(res => {
      console.log(res);
      //this.tableData.next(res);
      this.itemOrderRecordId = res[0].globalParameters.itemOrderRecordId;
      this.tableData = res;
      this.ifShowtable = true;
      this.editMode = true;
      this.generalFormService.setOrderList(res, this.orderType, 'adding');
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
      this.generalFormService.setOrderList(res, this.orderType, 'updating');
      this.editMode = true;
      this.setDialogMessage('ההזמנה עודכנה בהצלחה');
    }, (err) => {
      console.log(err);
      this.ifShowtable = false;
      //this.isSaveOrderSucceeded.next(false);
      this.editMode = false;
      this.form.enable({ emitEvent: false });
      this.setDialogMessage('אירעה שגיאה בעדכון ההזמנה, נא פנה למנהל המערכת');
    })

  }

  setDialogMessage(message) {
    const dialogRef = this._dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: { message: message, content: '', rightButton: 'ביטול', leftButton: 'המשך' }
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
          const dialogRef = this._dialog.open(ConfirmDialogComponent, {
            width: '500px',
            data: { message: 'בהזמנת היסעים - חובה למלא שעת התייצבות', content: '', rightButton: 'ביטול', leftButton: 'המשך' }
          })
          return false;
        }
        if (this.form.value.details['location'] === null || this.form.value.details['location'] === "" || this.form.value.details['location'] === undefined) {
          const dialogRef = this._dialog.open(ConfirmDialogComponent, {
            width: '500px',
            data: { message: 'בהזמנת היסעים - חובה למלא מקום התייצבות', content: '', rightButton: 'ביטול', leftButton: 'המשך' }
          })
          return false;
        }
      }
      if (this.form.value.details['exitPoint'] === null || this.form.value.details['exitPoint'] === "" || this.form.value.details['exitPoint'] === undefined) {
        const dialogRef = this._dialog.open(ConfirmDialogComponent, {
          width: '500px',
          data: { message: 'בהזמנת היסעים - חובה לציין נקודת יציאה לחישוב', content: '', rightButton: 'ביטול', leftButton: 'המשך' }
        })
        return false;
      }
      if (this.form.value.details['scatterLocation'] === null || this.form.value.details['scatterLocation'] === "" || this.form.value.details['scatterLocation'] === undefined) {
        const dialogRef = this._dialog.open(ConfirmDialogComponent, {
          width: '500px',
          data: { message: 'בהזמנת היסעים - חובה לציין מקום פיזור', content: '', rightButton: 'ביטול', leftButton: 'המשך' }
        })
        return false;
      }
      if (this.form.value.details['peopleInTrip'] === null || this.form.value.details['peopleInTrip'] === "" || this.form.value.details['peopleInTrip'] === undefined) {
        const dialogRef = this._dialog.open(ConfirmDialogComponent, {
          width: '500px',
          data: { message: 'בהזמנת היסעים - חובה למלא מספר משתתפים', content: '', rightButton: 'ביטול', leftButton: 'המשך' }
        })
        return false;
      }

      if (item.participantsLimit < this.form.value.details['peopleInTrip'] && item.participantsLimit != null) {
        const dialogRef = this._dialog.open(ConfirmDialogComponent, {
          width: '500px',
          data: { message: 'מספר המשתתפים גדול מסך המקומות באוטובוס - יש להוסיף אוטובוס נוסף', content: '', rightButton: 'ביטול', leftButton: 'המשך' }
        })
        return false;
      }
      var people = parseInt(this.form.value.details['peopleInTrip'])
      if (item.participantsLimit != null) {
        console.log(people % item.participantsLimit)
        console.log(Math.floor(people / item.participantsLimit))
        if (((people % item.participantsLimit) > 0) && (Math.floor(people / item.participantsLimit) > 0)) {
          if (Math.floor(people / item.participantsLimit) < parseInt(this.form.value.details['quantity'])) {
            const dialogRef = this._dialog.open(ConfirmDialogComponent, {
              width: '500px',
              data: { message: 'מספר המשתתפים קטן מסך מספר המקומות בכל האוטובוסים יחד - שים לב שלא הוזמן אוטובוס מיותר', content: '', rightButton: 'ביטול', leftButton: 'המשך' }
            })
            return false;
          }
        }
      }
    }
    return true;
  }

  public onEdit() {
    console.log('I am edit');
    this.editMode = false;
    this.isEditable = true;
    this.form.enable({ emitEvent: false });
  }

  public onValueChange(event) {
    this.form = event;
    console.log('I am form Event');
    //this.form.controls["details"].get('peopleInTrip').disable({ emitEvent: false });
    this.form.controls["details"].get('billingSupplier').disable({ emitEvent: false });
    this.form.controls["details"].get('billingCustomer').disable({ emitEvent: false });
    this.form.controls["details"].get('itemCost').disable({ emitEvent: false });
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
        this.valueChangeIndex = this.valueChangeIndex + 1;

      });
    this.form.controls["details"].get('itemId').valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
      this.valueChangeIndex = this.valueChangeIndex + 1;
      console.log(value)
      let item = this.originalItemList.find(el => el.id === parseInt(value))
      if (item?.isSumPeopleOrAmount == 1 || item?.isSumPeopleOrAmount == 0 || item?.isSumPeopleOrAmount == null)
        this.ifCalculateByQuantity = true;
      else
        this.ifCalculateByQuantity = false;
      let itemCost;
      if (!item.cost) {
        this.form.controls["details"].get('itemCost').setValue(0, { emitEvent: false });
        this.form.controls["details"].get('billingSupplier').patchValue(0, { emitEvent: false });
        this.form.controls["details"].get('billingCustomer').patchValue(0, { emitEvent: false });
        return;
      }
      if (this.isSupplierXemptedFromVat == true) {
        itemCost = Math.floor(item.cost);
        itemCost = (Math.round(item.cost * 100) / 100).toFixed(2);
        //let billingSupplierRound= (Math.round(itemOrder.billingSupplier * 100) / 100).toFixed(2);
      }
      else
        itemCost = Math.floor(item.costVat);
      this.form.controls["details"].get('itemCost').setValue(itemCost, { emitEvent: false });
      console.log(this.form.value.details);
      let form = this.additionsService.calculateBillings(this.form.value.details, this.isSupplierXemptedFromVat);
      this.form.controls["details"].get('billingSupplier').patchValue(form.billingSupplier, { emitEvent: false });
      this.form.controls["details"].get('billingCustomer').patchValue(form.billingCustomer, { emitEvent: false });

    });

    this.form.controls["details"].get('quantity').valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
      if (this.ifCalculateByQuantity) {
        console.log(value)
        let form = this.additionsService.calculateBillings(this.form.value.details, this.isSupplierXemptedFromVat);
        this.form.controls["details"].get('billingSupplier').patchValue(form.billingSupplier, { emitEvent: false });
        this.form.controls["details"].get('billingCustomer').patchValue(form.billingCustomer, { emitEvent: false });
      }
      else
        return;
    });

    this.form.controls["details"].get('peopleInTrip').valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
      if (!this.ifCalculateByQuantity) {
        console.log(value)
        let form = this.additionsService.calculateBillings(this.form.value.details, this.isSupplierXemptedFromVat);
        this.form.controls["details"].get('billingSupplier').patchValue(form.billingSupplier, { emitEvent: false });
        this.form.controls["details"].get('billingCustomer').patchValue(form.billingCustomer, { emitEvent: false });
      }
      else
        return;
    });


    this.form.controls["details"].get('startDate').valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
      console.log(value)
      let form = this.additionsService.calculateBillings(this.form.value.details, this.isSupplierXemptedFromVat);
      this.form.controls["details"].get('billingSupplier').patchValue(form.billingSupplier, { emitEvent: false });
      this.form.controls["details"].get('billingCustomer').patchValue(form.billingCustomer, { emitEvent: false });

    });
    this.form.controls["details"].get('endDate').valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
      console.log(value)
      let form = this.additionsService.calculateBillings(this.form.value.details, this.isSupplierXemptedFromVat);
      this.form.controls["details"].get('billingSupplier').patchValue(form.billingSupplier, { emitEvent: false });
      this.form.controls["details"].get('billingCustomer').patchValue(form.billingCustomer, { emitEvent: false });

    });


    console.log(this.form)
  }

  ngOnDestroy() {
    if (this.supplierListSub) { this.supplierListSub.unsubscribe(); }
    if (this.supplierSub) { this.supplierSub.unsubscribe(); }
    if (this.itemListSub) { this.itemListSub.unsubscribe(); }
    if (this.settlementSub) { this.settlementSub.unsubscribe(); }
    if (this.addOrderSub) { this.addOrderSub.unsubscribe(); }
    if (this.editOrderSub) { this.editOrderSub.unsubscribe() }
  }


}
