
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormTemplate } from 'src/app/components/form/logic/form.service';
import { TableCellModel } from 'src/app/utilities/models/TableCell';
import { AdditionsService } from '../../services/additions.service';
import { SiteOrder, Order, OrderItemCommonDetails, OrderService, OrderType, Supplier, TransportOrder, UserService } from 'src/app/open-api';
import { SquadAssembleService } from '../../../squad-assemble/services/squad-assemble.service';
import { GeneralFormService } from '../../services/general-form.service';
import { ConfirmDialogComponent } from 'src/app/utilities/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-site-order-form',
  templateUrl: './site-order-form.component.html',
  styleUrls: ['./site-order-form.component.scss']
})
export class SiteOrderFormComponent implements OnInit, OnDestroy {

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
  ifInitiateFormflag: boolean ;
   isEditable : boolean= false;
  public form: FormGroup;
  public columns: TableCellModel[];
  ifShowtable: boolean=false;
  tableData: any;
  isItemOrderExist : boolean;
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
  sitesSub: Subscription;
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
        //    this.generalFormService.supplierList.push({ label: supplierName, value: this.supplierId.toString() });
        //   this.generalFormService.details[0].inputProps.options= this.generalFormService.supplierList
        //   this.generalFormService.details[0].value = this.supplierId.toString();
          this.getSupplierByOrderType(); // it's tempurary
          //this.getOrderItemBySupplierId();
      }
    }
    this.getSites();
    
  }
  setformTemplate() {
    let index = this.generalFormService.questionGroups.findIndex(el => el.key === "details");
    this.generalFormService.questionGroups[index].questions = this.generalFormService.details;
    let detailsArr = this.generalFormService.questionGroups[index].questions;
    detailsArr = this.changeLabels(detailsArr);
    let siteCodeIndex= this.generalFormService.site.findIndex(i=>i.key=='siteCode')
    this.generalFormService.site[siteCodeIndex].value='';
    let siteURLIndex= this.generalFormService.site.findIndex(i=>i.key=='siteURL')
    this.generalFormService.site[siteURLIndex].value='';
    let totalHoursIndex= this.generalFormService.site.findIndex(i=>i.key=='totalHours')
    this.generalFormService.site[totalHoursIndex].value='';
    let siteQuestions = detailsArr.concat(this.generalFormService.site);
    this.generalFormService.questionGroups[index].questions = siteQuestions;
   
  }
  changeLabels(tempArr) {
    console.log('tempArr is :', tempArr);

    let startDateIndex = tempArr.findIndex(el => el.key === 'startDate');
    tempArr[startDateIndex].label = 'מתאריך';
    let endDateIndex = tempArr.findIndex(el => el.key === 'endDate');
    tempArr[endDateIndex].label = 'עד תאריך';
    let startHourIndex = tempArr.findIndex(el => el.key === 'startHour');
    tempArr[startHourIndex].label = 'משעה';
    let endHourIndex = tempArr.findIndex(el => el.key === 'endHour');
    tempArr[endHourIndex].label = 'עד שעה';
    let locationIndex = tempArr.findIndex(el => el.key === 'location');
    tempArr[locationIndex].label = 'כתובת האתר';
    return tempArr;
  }

  initiateForm(){
    this.ifInitiateFormflag=true;
    this.formTemplate.questionsGroups= this.generalFormService.questionGroups;
     console.log('this.formTemplate.questionsGroups:',this.formTemplate.questionsGroups)
  }

  displayTable(){
    let transArr= this.generalFormService.siteOrderList;
    let currentObj= transArr.find(i=> (i.globalParameters.itemOrderRecordId)=== (this.item.globalParameters.itemOrderRecordId) && (i.globalParameters.supplierId)=== (this.item.globalParameters.supplierId) );
    let arr=[]
    arr.push(currentObj);
    this.tableData=arr;
    this.ifShowtable=true;

 }

 
  getSupplierList(orderTypeId, tripId, orderId) {
    this.supplierListSub = this.orderService.getSupplierList(orderTypeId, tripId, orderId).subscribe(
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
    this.itemListSub=this.orderService.getOrdersItemBySupplierID(this.supplierId, this.centerFieldId, false).subscribe(
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

  getSites(){
    let tripStart= this.generalFormService.tripInfo.trip.tripStart;
    let tripStart1= tripStart.split("T");
    let subTripStart= tripStart1[0];
    subTripStart= subTripStart.split("-");
    let year= parseInt(subTripStart[0]);
    let centerFieldObj = JSON.parse(localStorage.getItem('centerFieldObj'));
    let chevelCode= centerFieldObj.chevelCode

    this.sitesSub= this.orderService.getSites(year,chevelCode).subscribe(res=>{
      console.log(res);
      res.forEach(elem=>{
        this.generalFormService.siteList.push({label: elem.name ,value : elem.id.toString()})
      })
      let siteIndex= this.generalFormService.details.findIndex(i => i.key==='siteCode');
      this.generalFormService.details[siteIndex].inputProps.options= this.generalFormService.siteList;
    },(err)=>{
      console.log(err);
    })
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
      // if (!this.additionsService.globalValidations(this.form)) { return; }
      // if (!this.validationsSite()) { return; }
  
    }
  }

  validationItem(){
    if (!this.additionsService.globalValidations(this.form)) { return; }
    if (!this.validationsSite()) { return; }
    this.mapFormFieldsToServer()
  }
  validationsSite() {
    if (this.form.getRawValue().details['peopleInTrip'] === null || this.form.getRawValue().details['peopleInTrip'] === undefined || this.form.getRawValue().details['peopleInTrip'] === "") {
      const dialogRef = this._dialog.open(ConfirmDialogComponent, {
        width: '500px',
        data: { message: 'חובה לציין את מספר המשתתפים באתר', content: '', rightButton: 'ביטול', leftButton: 'המשך' }
      })
      return false;
    }
    return true;
  }

  public mapFormFieldsToServer(){ 
    let orderId;
    if (this.generalFormService.siteOrderList.length > 0) {
      orderId = this.generalFormService.siteOrderList[0].order.orderId
    }
    var site = {} as SiteOrder;
    site.globalParameters = {} as OrderItemCommonDetails;
    site.order = {} as Order;
    if (orderId != undefined && orderId)
    site.order.orderId = orderId;
    site.order.supplier = {} as Supplier;
    site.order.orderType = {} as OrderType;
    //this.form.value.details
    Object.keys(this.form.getRawValue().details).map((key, index) => {
      if (key !== 'siteCode' && key !== 'siteURL' && key !== 'totalHours' ) {
        if (key != 'startDate' && key != 'endDate') {
          site.globalParameters[key] = this.form.getRawValue().details[key]
        } else {
          if (key == 'startDate') {
            site.globalParameters[key] = this.generalFormService.changeDateFormat(this.form.getRawValue().details[key], 'UTC')
          }
          if (key == 'endDate') {
            site.globalParameters[key] = this.generalFormService.changeDateFormat(this.form.getRawValue().details[key], 'UTC')
          }
        }
      }
      else {
            site.siteCode= this.form.getRawValue().details['siteCode'];
            site.siteURL= this.form.getRawValue().details['siteURL'];
            site.totalHours= this.form.getRawValue().details['totalHours'];
      }

    });
    site.globalParameters['startHour'] = this.setDateTimeFormat(site.globalParameters.startDate, site.globalParameters.startHour);
    site.globalParameters['endHour'] = this.setDateTimeFormat(site.globalParameters.endDate, site.globalParameters.endHour);
    site.globalParameters['comments'] = this.form.getRawValue().comments.comments;
    site.globalParameters.orderId = orderId;
    site.order.supplier.id = +this.form.getRawValue().details.supplierId;
    site.order.tripId = this.tripId;
    site.order.orderType.name = 'אתרים';
    site.order.orderType.id = this.orderType;
    // if(this.item.globalParameters.tempOrderIdentity!= undefined)
    //  site.globalParameters.tempOrderIdentity=this.item.globalParameters.tempOrderIdentity;
    if(!this.isEditable){
      //this.generalFormService.addOrder(site, site.order.orderType.id);
      this.addOrder(site);
    }
    else{
      site.globalParameters.itemOrderRecordId= this.itemOrderRecordId;
      //this.generalFormService.editOrder(site, site.order.orderType.id);
      this.editOrder(site);
    }
   
    this.form.disable({ emitEvent: false });
  }

  
  setDateTimeFormat(date, hour) {
    let str = date.split("T");
    let hourFormat = str[0] + 'T' + hour;
    return hourFormat;
  }

  addOrder(item){
    this.addOrderSub=  this.orderService.addOrder( item).subscribe(res => {
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
           data: { message: message, content: '', rightButton: 'ביטול', leftButton: 'המשך' }
         })

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
      if (this.selectedItem?.isSumPeopleOrAmount == 1 ) // by default is by num of participants unless the isSumPeopleOrAmount is 1
      this.ifCalculateByQuantity= true;
     else
     this.ifCalculateByQuantity= false;
      let itemCost;
      if(this.isSupplierXemptedFromVat==true){
        itemCost = (Math.round(this.selectedItem.cost * 100) / 100).toFixed(2);
      }
       else
       itemCost = this.selectedItem.costVat;
      this.form.controls["details"].get('itemCost').patchValue(itemCost, { emitEvent: false });
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
