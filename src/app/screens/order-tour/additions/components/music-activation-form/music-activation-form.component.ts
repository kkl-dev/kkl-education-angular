import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormTemplate } from 'src/app/components/form/logic/form.service';
import { TableCellModel } from 'src/app/utilities/models/TableCell';
import { AdditionsService } from '../../services/additions.service';
import { MusicActivationOrder, Order, OrderItemCommonDetails, OrderService, OrderType, Supplier, TransportOrder, UserService } from 'src/app/open-api';
import { SquadAssembleService } from '../../../squad-assemble/services/squad-assemble.service';
import { GeneralFormService } from '../../services/general-form.service';
import { ConfirmDialogComponent } from 'src/app/utilities/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-music-activation-form',
  templateUrl: './music-activation-form.component.html',
  styleUrls: ['./music-activation-form.component.scss']
})
export class MusicActivationFormComponent implements OnInit, OnDestroy {

  constructor(private _dialog: MatDialog, private generalFormService: GeneralFormService, private squadAssembleService: SquadAssembleService, private additionsService: AdditionsService, private orderService: OrderService) { }
  @Input() public item: any;
  @Input() public editMode: boolean;

  @Input() orderType: number;
  tripId: number;
  supplierId: number;
  itemId: number;
  centerFieldId: number;
  originalItemList = [];
  itemsList =[];
  ifInitiateFormflag: boolean =false;
  isEditable : boolean= false;
  public form: FormGroup;
  public columns: TableCellModel[];
  ifShowtable: boolean=false;
  tableData: any;
  isItemOrderExist: boolean;
  isTempuraryItem: boolean; 
  isSupplierXemptedFromVat: boolean
  itemOrderRecordId: number;
  selectedItem :any;
  ifCalculateByQuantity : boolean;
  valueChangeIndex= 0;
  // close subscribe:
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
        this.isTempuraryItem=false;
        this.editMode=true;
        this.supplierId= this.item.globalParameters.supplierId;
        this.itemId= this.item.globalParameters.itemId;
      }
      else
      this.isTempuraryItem=true;
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
    let totalHoursIndex= this.generalFormService.musicActivation.findIndex(i=>i.key=='totalHours')
    this.generalFormService.musicActivation[totalHoursIndex].value='';
    let musicQuestions = detailsArr.concat(this.generalFormService.musicActivation);
    this.generalFormService.questionGroups[index].questions = musicQuestions;
    this.formTemplate.questionsGroups = this.generalFormService.questionGroups;

  }
  changeLabels(tempArr) {
    console.log('tempArr is :', tempArr);

    let startDateIndex = tempArr.findIndex(el => el.key === 'startDate');
    tempArr[startDateIndex].label = 'מתאריך';
    let endDateIndex = tempArr.findIndex(el => el.key === 'endDate');
    tempArr[endDateIndex].label = 'עד תאריך';
    let startHourIndex = tempArr.findIndex(el => el.key === 'startHour');
    tempArr[startHourIndex].label = 'שעת התחלה';
    let endHourIndex = tempArr.findIndex(el => el.key === 'endHour');
    tempArr[endHourIndex].label = 'שעת סיום';
    let locationIndex = tempArr.findIndex(el => el.key === 'location');
    tempArr[locationIndex].label = 'כתובת';
    return tempArr;
  }

  initiateForm(){
    this.ifInitiateFormflag=true;
    this.formTemplate.questionsGroups= this.generalFormService.questionGroups;
     console.log('this.formTemplate.questionsGroups:',this.formTemplate.questionsGroups)
  }

  displayTable(){
    let transArr= this.generalFormService.musicOrderList;
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
            this.generalFormService.setFormValues(this.item, this.isItemOrderExist);
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
    if (!this.validationsMusicActivation()) { return; }
    this.mapFormFieldsToServer()
  }

  public mapFormFieldsToServer(){ 
    let orderId;
    if (this.generalFormService.musicOrderList.length > 0) {
      orderId = this.generalFormService.musicOrderList[0].order.orderId
    }
    let music = {} as MusicActivationOrder;
    music.globalParameters = {} as OrderItemCommonDetails;
    music.order = {} as Order;
    if (orderId != undefined && orderId)
    music.order.orderId = orderId;
    music.order.supplier = {} as Supplier;
    music.order.orderType = {} as OrderType;
    Object.keys(this.form.getRawValue().details).map((key, index) => {

      if (key !== 'totalHours') {

        if (key != 'startDate' && key != 'endDate') {
          music.globalParameters[key] = this.form.getRawValue().details[key]
        } else {
          if (key == 'startDate') {
            music.globalParameters[key] = this.generalFormService.changeDateFormat(this.form.getRawValue().details[key], 'UTC')
          }
          if (key == 'endDate') {
            music.globalParameters[key] = this.generalFormService.changeDateFormat(this.form.getRawValue().details[key], 'UTC')
          }
        }
      }
      else {
        music.totalHours= this.form.getRawValue().details['totalHours'];
      }

    });
    music.globalParameters['startHour'] = this.setDateTimeFormat(music.globalParameters.startDate, music.globalParameters.startHour);
    music.globalParameters['endHour'] = this.setDateTimeFormat(music.globalParameters.endDate, music.globalParameters.endHour);
    music.globalParameters['comments'] = this.form.getRawValue().comments.comments;
    music.globalParameters.orderId = orderId;
    music.order.supplier.id = +this.form.getRawValue().details.supplierId;
    music.order.tripId = this.tripId
    music.order.orderType.name = 'מפעיל מוסיקלי';
    music.order.orderType.id = this.orderType;
    if(this.item!= undefined){
      if (this.item.globalParameters.tempOrderIdentity != undefined)
      music.globalParameters.tempOrderIdentity = this.item.globalParameters.tempOrderIdentity;
    }
   
    if(!this.isEditable){
      //this.generalFormService.addOrder(music, music.order.orderType.id);
      this.addOrder(music);
    }
    else{
      music.globalParameters.itemOrderRecordId= this.itemOrderRecordId;
      //this.generalFormService.editOrder(music, music.order.orderType.id);
      this.editOrder(music)
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
      //this.isSaveOrderSucceeded.next(true);
      this.editMode = true;
      this.setDialogMessage('ההזמנה עודכנה בהצלחה');
    }, (err) => {
      console.log(err);
      this.ifShowtable=false;
       //this.isSaveOrderSucceeded.next(false);
       this.editMode = false;
       this.form.enable({ emitEvent: false });
       this.setDialogMessage('אירעה שגיאה בעדכון ההזמנה, נא פנה למנהל המערכת');
     })
  
   }

   setDialogMessage(message){
    const dialogRef = this._dialog.open(ConfirmDialogComponent, {
      width: '500px',
       data: { message: message, content: '', rightButton: 'ביטול', leftButton: 'אישור' }
     })

  }

  validationsMusicActivation() { return true; }
  setDateTimeFormat(date, hour) {
    let str = date.split("T");
    let hourFormat = str[0] + 'T' + hour;
    return hourFormat;
  }

  public onEdit() {
    console.log('I am edit');
    this.editMode = false;
    this.isEditable=true;
    this.form.enable({ emitEvent: false });
    this.disableFormFields();
  }

  public onValueChange(event) {
    this.form = event;
    this.disableFormFields();
   
   this.supplierIdEventSub = this.form.controls["details"].get('supplierId').valueChanges.pipe(distinctUntilChanged())
      .subscribe(value => {
        console.log('supplier changed:',value);
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
   this.itemIdEventSub= this.form.controls["details"].get('itemId').valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
      this.valueChangeIndex++;
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
       itemCost = this.selectedItem.costVat;
      this.form.controls["details"].get('itemCost').setValue(itemCost,{emitEvent: false });
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
  }

  calculate(){
    let form = this.additionsService.calculateBillings(this.form.value.details,this.isSupplierXemptedFromVat);
    this.form.controls["details"].get('billingSupplier').patchValue(form.billingSupplier,{emitEvent: false});
    this.form.controls["details"].get('billingCustomer').patchValue(form.billingCustomer,{emitEvent: false});
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
