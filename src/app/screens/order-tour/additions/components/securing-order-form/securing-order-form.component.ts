import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormTemplate } from 'src/app/components/form/logic/form.service';
import { TableCellModel } from 'src/app/utilities/models/TableCell';
import { AdditionsService } from '../../services/additions.service';
import { SecuringOrder, Order, OrderItemCommonDetails, OrderService, OrderType, Supplier, TransportOrder, UserService } from 'src/app/open-api';
import { SquadAssembleService } from '../../../squad-assemble/services/squad-assemble.service';
import { GeneralFormService } from '../../services/general-form.service';
import { ConfirmDialogComponent } from 'src/app/utilities/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-securing-order-form',
  templateUrl: './securing-order-form.component.html',
  styleUrls: ['./securing-order-form.component.scss']
})
export class SecuringOrderFormComponent implements OnInit, OnDestroy {

  constructor(private _dialog: MatDialog, private generalFormService: GeneralFormService, private squadAssembleService: SquadAssembleService, private additionsService: AdditionsService, private orderService: OrderService) { }
  @Input() public item: any;
  @Input() public editMode: boolean;

  @Input() orderType: number;
  tripId: number;
  supplierId: number;
  itemId: number;
  originalItemList = [];
  itemsList =[]
  centerFieldId: number;
  ifInitiateFormflag: boolean =false;
  isEditable : boolean= false;
  public form: FormGroup;
  public columns: TableCellModel[];
  ifShowtable: boolean=false;
  tableData: any;
  isItemOrderExist: boolean;
  isTempuraryItem: boolean; 
  isSupplierXemptedFromVat: boolean;
  ifCalculateByQuantity : boolean;
  valueChangeIndex= 0;
  itemOrderRecordId: number;
  selectedItem :any;
  // close subsribe:
  supplierListSub: Subscription;
  supplierSub: Subscription;
  itemListSub:  Subscription;
  addOrderSub: Subscription;
  editOrderSub: Subscription;
  supplierIdEventSub:Subscription;
  itemIdEventSub: Subscription;
  startDateEventSub:Subscription;
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

    if (this.item != undefined && this.item != null ) {
      if(this.item.globalParameters.supplierId!= undefined && this.item.globalParameters.orderId){
        this.isItemOrderExist = true;
        this.itemOrderRecordId=this.item.globalParameters.itemOrderRecordId;
        this.isTempuraryItem =false;
        this.editMode=true;
        this.supplierId= this.item.globalParameters.supplierId;
        this.itemId= this.item.globalParameters.itemId;
      }
      else
      this.isTempuraryItem =true;
    }

    else{
      let peopleInTripIndex= this.generalFormService.details.findIndex(i => i.key==='peopleInTrip');
      this.generalFormService.details[peopleInTripIndex].value= (this.generalFormService.peopleInTrip).toString();
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
   

  }
  setformTemplate() {
    let index = this.generalFormService.questionGroups.findIndex(el => el.key === "details");
    let detailsArr = this.generalFormService.details;
    detailsArr = this.changeLabels(detailsArr);
    let scatterLocationIndex= this.generalFormService.securing.findIndex(i=>i.key=='scatterLocation')
    this.generalFormService.securing[scatterLocationIndex].value='';
    let securingQuestions = detailsArr.concat(this.generalFormService.securing);
    this.generalFormService.questionGroups[index].questions = securingQuestions;
    //this.formTemplate.questionsGroups = this.generalFormService.questionGroups;

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

  initiateForm(){
    this.ifInitiateFormflag=true;
    this.formTemplate.questionsGroups= this.generalFormService.questionGroups;
     console.log('this.formTemplate.questionsGroups:',this.formTemplate.questionsGroups)
  }

  displayTable(){
    let transArr= this.generalFormService.securingOrderList;
    let currentObj= transArr.find(i=> (i.globalParameters.itemOrderRecordId)=== (this.item.globalParameters.itemOrderRecordId) && (i.globalParameters.supplierId)=== (this.item.globalParameters.supplierId) );
    let arr=[]
    arr.push(currentObj);
    this.tableData=arr;
    this.ifShowtable=true;

 }

  getSupplierList(orderTypeId, tripId, orderId) {

    this.supplierListSub=this.orderService.getSupplierList(orderTypeId, tripId, orderId).subscribe(

      response => {
        console.log(response);
        this.generalFormService.supplierList = [];
        this.generalFormService.originalSupplierList=response;
        response.forEach(element => {
          this.generalFormService.supplierList.push({ label: element.name, value: element.id.toString() });
        });
         let supplierIndex = this.generalFormService.details.findIndex(i => i.key === 'supplierId');
         this.generalFormService.details[supplierIndex].inputProps.options = this.generalFormService.supplierList;
         if(this.supplierId== undefined)
           this.getSupplierByOrderType();
           else{
            this.generalFormService.details[supplierIndex].value= this.supplierId.toString();
            this.getOrderItemBySupplierId()
           }
           
      },
      error => console.log(error),       // error
      () => console.log('completed')     // complete
    )
  }


  getSupplierByOrderType() {
    this.supplierSub= this.orderService.getSupplierByOrderType(this.orderType,this.centerFieldId).subscribe(
      response => {
        console.log(response);
        this.supplierId= response.id;
        if(response.isXemptedFromVat==1)
        this.isSupplierXemptedFromVat=true;
        else
        this.isSupplierXemptedFromVat=false;
        let supplierIndex = this.generalFormService.details.findIndex(i => i.key === 'supplierId');
        if (this.generalFormService.details[supplierIndex].inputProps?.options?.length>0)
        this.generalFormService.details[supplierIndex].value = this.supplierId.toString();
        else{
          this.generalFormService.supplierList.push({ label: response.name, value: response.id.toString() });
          this.generalFormService.details[supplierIndex].inputProps.options= this.generalFormService.supplierList;
          this.generalFormService.details[supplierIndex].value = this.supplierId.toString();
        }
        //this.generalFormService.details[supplierIndex].value= this.supplierId.toString();
         this.getOrderItemBySupplierId();

      },
      error => console.log(error),       // error
      () => console.log('completed')     // complete
    )

  }

  
  getOrderItemBySupplierId() {
    this.itemListSub= this.orderService.getOrdersItemBySupplierID(this.supplierId, this.centerFieldId, false).subscribe(
      response => {
        console.log(response);
        this.itemsList=[];
        this.originalItemList = response;
        this.generalFormService.originalItemList=response;
        response.forEach(element => {
          this.itemsList.push({ label: element.name, value: element.id.toString() });
        });
        let itemIndex= this.generalFormService.details.findIndex(i => i.key==='itemId');
        this.generalFormService.details[itemIndex].inputProps.options= this.itemsList;
        if(this.form)
        return;
        if(this.itemId!= undefined)
        this.generalFormService.details[itemIndex].value= this.itemId.toString();
        if (this.item != undefined && this.item != null ) {
            this.item.globalParameters.supplierId=this.supplierId.toString();
            if(this.item.globalParameters.orderId)
            this.isItemOrderExist=true;
            this.generalFormService.setFormValues(this.item,this.isItemOrderExist);
        }
        this.initiateForm();
        if (this.item != undefined && this.item != null) {
          if (this.item.globalParameters.supplierId != undefined && this.item.globalParameters.itemId!= undefined)
           this.displayTable();
        }
      },
      error => console.log(error),       // error
      () => console.log('completed')     // complete
    )
  }

  public onSave(): void {
    if (this.form) {
      let item = this.generalFormService.originalItemList.find(el => el.id.toString() === this.form.value.details['itemId']);
      // if((item.credit!=1 || item.orderItemDetails.classroomTypeId==null)){
        if(item?.amountLimit!= null){
        this.orderService.checkItemsExistInDateTime(this.tripId,
          this.centerFieldId, item).subscribe(res=>{
             if(res.isOccupancyProblem == true){
              this._dialog.open(ConfirmDialogComponent, {
                width: '500px',
                data: { message: res, content: ''}
              })
              return;
             }
             else{
              this.validationItem();
             }
          })
      }
      else{
        this.validationItem();
      }
    }
  }

  validationItem(){
    if (!this.additionsService.globalValidations(this.form)) { return; }
    if (!this.validationsSecuring()) { return; }
    this.mapFormFieldsToServer()
  }

  public mapFormFieldsToServer(){
    let orderId;
    if (this.generalFormService.securingOrderList.length > 0) {
      orderId = this.generalFormService.securingOrderList[0].order.orderId
    }
    let securing = {} as SecuringOrder;
    securing.globalParameters = {} as OrderItemCommonDetails;
    securing.order = {} as Order;
    if (orderId != undefined && orderId)
    securing.order.orderId = orderId;
    securing.order.supplier = {} as Supplier;
    securing.order.orderType = {} as OrderType;
    Object.keys(this.form.getRawValue().details).map((key, index) => {

      if (key !== 'scatterLocation') {

        if (key != 'startDate' && key != 'endDate') {
          securing.globalParameters[key] = this.form.getRawValue().details[key]
        } else {
          if (key == 'startDate') {
            securing.globalParameters[key] = this.generalFormService.changeDateFormat(this.form.getRawValue().details[key], 'UTC')
          }
          if (key == 'endDate') {
            securing.globalParameters[key] = this.generalFormService.changeDateFormat(this.form.getRawValue().details[key], 'UTC')
          }
        }
      }
      else {
        securing.scatterLocation= this.form.getRawValue().details['scatterLocation'];
      }

    });
    securing.globalParameters['startHour'] = this.setDateTimeFormat(securing.globalParameters.startDate, securing.globalParameters.startHour);
    securing.globalParameters['endHour'] = this.setDateTimeFormat(securing.globalParameters.endDate, securing.globalParameters.endHour);
    securing.globalParameters['comments'] = this.form.getRawValue().comments.comments;
    securing.globalParameters.orderId = orderId;
    securing.order.supplier.id = +this.form.getRawValue().details.supplierId;
    securing.order.tripId = this.tripId;
    securing.order.orderType.name = '';
    securing.order.orderType.id = this.orderType;
    if(this.item!= undefined){
      if (this.item.globalParameters.tempOrderIdentity != undefined)
      securing.globalParameters.tempOrderIdentity = this.item.globalParameters.tempOrderIdentity;
    }
    
    if(!this.isEditable){
      //this.generalFormService.addOrder(securing, securing.order.orderType.id);
      this.addOrder(securing);
    }    
    else{
      securing.globalParameters.itemOrderRecordId= this.itemOrderRecordId;
      //this.generalFormService.editOrder(securing, securing.order.orderType.id);
      this.editOrder(securing)
    }
    
    this.form.disable({ emitEvent: false });

  }

  addOrder(item){
    this.addOrderSub= this.orderService.addOrder( item).subscribe(res => {
      console.log(res); 
      this.itemOrderRecordId= res[res.length-1].globalParameters.itemOrderRecordId
      this.tableData=res;
      this.ifShowtable=true;
      this.editMode = true;
      this.generalFormService.setOrderList(res,this.orderType,'adding',this.isTempuraryItem);
      this.setDialogMessage('ההזמנה נשמרה בהצלחה');
      this.generalFormService.enableButton.next(true);
    }, (err) => {
      console.log(err);
      this.editMode = false;
      this.form.enable({ emitEvent: false });
      this.setDialogMessage('אירעה שגיאה בשמירת ההזמנה, נא פנה למנהל המערכת');
    })
  }

   editOrder(item){
   this.editOrderSub= this.orderService.editOrder(item).subscribe(res => {
      console.log(res);  
      this.generalFormService.setOrderList(res, this.orderType,'updating',false);
      this.editMode = true;
      this.setDialogMessage('ההזמנה עודכנה בהצלחה');
    }, (err) => {
      console.log(err);
      this.ifShowtable=false;
       this.editMode = false;
       this.form.enable({ emitEvent: false });
       this.setDialogMessage('אירעה שגיאה בעדכון ההזמנה, נא פנה למנהל המערכת');
     })
  
   }

       setDialogMessage(message){
        const dialogRef = this._dialog.open(ConfirmDialogComponent, {
          width: '500px',
           data: { message: message, content: '', rightButton: 'ביטול', leftButton: 'המשך' }
         })

      }

  validationsSecuring() {
    if (this.generalFormService.originalItemList.length > 0) {
      var item = this.generalFormService.originalItemList.find(el => el.id.toString() === this.form.value.details['itemId']);
    }
    if (item.credit === 0) {
      if (this.form.value.details['startHour'] === null || this.form.value.details['startHour'] === "" || this.form.value.details['startHour'] === undefined) {
        const dialogRef = this._dialog.open(ConfirmDialogComponent, {
          width: '500px',
          data: { message: 'בהזמנת אבטחה - חובה למלא שעת התייצבות', content: '', rightButton: 'ביטול', leftButton: 'המשך' }
        })
        return false;
      }
      if (this.form.value.details['location'] === null || this.form.value.details['location'] === "" || this.form.value.details['location'] === undefined) {
        const dialogRef = this._dialog.open(ConfirmDialogComponent, {
          width: '500px',
          data: { message: 'בהזמנת אבטחה - חובה למלא מקום התייצבות', content: '', rightButton: 'ביטול', leftButton: 'המשך' }
        })
        return false;
      }
    } return true;
  }
  setDateTimeFormat(date, hour) {
    let str = date.split("T");
    let hourFormat = str[0] + 'T' + hour;
    return hourFormat;
  }

  public onEdit() {
    this.editMode = false;
    this.isEditable = true;
    this.form.enable();
    this.disableFormFields();
  }

  public onValueChange(event) {
    this.form = event;
    this.disableFormFields();
   this.supplierIdEventSub = this.form.controls["details"].get('supplierId').valueChanges.pipe(distinctUntilChanged())
      .subscribe(value => {
        console.log(value);
        this.supplierId=value;
        if( this.valueChangeIndex>0)
        this.form.controls["details"].get('itemId').patchValue('', { emitEvent: false });
        let supplier= this.generalFormService.originalSupplierList.find(i=> i.id=== +value);
        if(supplier.isXemptedFromVat==1)
        this.isSupplierXemptedFromVat=true;
        else
        this.isSupplierXemptedFromVat=false;
        if( this.valueChangeIndex>0)
        this.getOrderItemBySupplierId();
        this.valueChangeIndex++;
      });
   this.itemIdEventSub = this.form.controls["details"].get('itemId').valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
      this.valueChangeIndex++;
      //let item = this.generalFormService.originalItemList.find(el => el.id === parseInt(value))
      this.selectedItem=this.originalItemList.find(el => el.id === parseInt(value))
      if (this.selectedItem?.isSumPeopleOrAmount == 1 || this.selectedItem?.isSumPeopleOrAmount == 0 || this.selectedItem?.isSumPeopleOrAmount == null)
      this.ifCalculateByQuantity= true;
      else
      this.ifCalculateByQuantity= false;
      let itemCost;
      if(this.isSupplierXemptedFromVat==true){
        itemCost = (Math.round(this.selectedItem.cost * 100) / 100).toFixed(2);
      }    
       else
       itemCost =this.selectedItem.costVat;
      this.form.controls["details"].get('itemCost').patchValue(itemCost,{ emitEvent: false });
      this.calculate();
      if (!this.selectedItem.cost) {
        this.setSupplierBillingZero();
      }
      if (!this.selectedItem.costCustomer) {
        this.setCustomerBillingZero();
      }
    });
    
   this.quantityEventSub = this.form.controls["details"].get('quantity').valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
      if(this.ifCalculateByQuantity){
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
        if(!this.ifCalculateByQuantity){
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
    
   this.startDateEventSub =  this.form.controls["details"].get('startDate').valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
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

  calculate(){
      let form = this.additionsService.calculateBillings(this.form.value.details,this.isSupplierXemptedFromVat);
      this.form.controls["details"].get('billingSupplier').patchValue(form.billingSupplier);
      this.form.controls["details"].get('billingCustomer').patchValue(form.billingCustomer);
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
    if(this.addOrderSub) {this.addOrderSub.unsubscribe();}
    if(this.editOrderSub){this.editOrderSub.unsubscribe()}
    if( this.supplierIdEventSub) {this.supplierIdEventSub.unsubscribe()}
    if(this.itemIdEventSub){this.itemIdEventSub.unsubscribe()}
    if(this.startDateEventSub) {this.startDateEventSub.unsubscribe()}
    if(this.endDateEventSub) {this.endDateEventSub.unsubscribe()}
    if(this.quantityEventSub){this.quantityEventSub.unsubscribe()}
    if(this.peopleInTripEventSub) {this.peopleInTripEventSub.unsubscribe()}
  }


}
