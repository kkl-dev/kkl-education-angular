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
  itemsList =[]
  supplierListSub: Subscription;
  supplierSub: Subscription;
  itemListSub:  Subscription;
  flag: boolean =false;
  isEditable : boolean= false;
  public form: FormGroup;
  public columns: TableCellModel[];
  ifShowtable: boolean=false;
  tableDataSub: Subscription;
  tableData: any;
  isItemOrderExist: boolean;
  isSupplierXemptedFromVat: boolean
  isSaveOrderSucceededSub: Subscription;
  public formTemplate: FormTemplate = {
    hasGroups: true,
    questionsGroups: [],
  };

  ngOnInit(): void {
  
    this.tripId = this.squadAssembleService.tripInfofromService.trip.id;
    this.centerFieldId= this.squadAssembleService.tripInfofromService.trip.centerField.id;
    this.generalFormService.clearFormFields();
    this.generalFormService.itemsList = []
    //let itemIndex = this.generalFormService.details.findIndex(i => i.key === 'itemId');
    //this.generalFormService.details[itemIndex].inputProps.options = this.generalFormService.itemsList;


    this.setformTemplate();

    if (this.item != undefined && this.item != null ) {
      if(this.item.globalParameters.supplierId!= undefined){
        this.editMode=true;
        this.supplierId= this.item.globalParameters.supplierId;
        this.itemId= this.item.globalParameters.itemId;
        //this.generalFormService.getOrderItemBySupplierId(this.supplierId);

      }
     // this.generalFormService.setFormValues(this.item);
    }

    else{
      let peopleInTripIndex= this.generalFormService.details.findIndex(i => i.key==='peopleInTrip');
      this.generalFormService.details[peopleInTripIndex].value= this.squadAssembleService.peopleInTrip;
      //this.setformTemplate();
    }

    this.getSupplierList(this.orderType, this.tripId, 0);
   
    this.generalFormService.setDatesValues();
    this.tableDataSub=this.generalFormService.tableData.subscribe(res=>{
      console.log('res from table data intransort is :',res);
      this.tableData=res;
      this.ifShowtable=true;
    })

    this.isSaveOrderSucceededSub = this.generalFormService.isSaveOrderSucceeded.subscribe(res=>{
      if(res)
      this.editMode = false;
      else
      this.editMode = true;
   })

  }

  setformTemplate() {
    let index = this.generalFormService.questionGroups.findIndex(el => el.key === "details");
    let detailsArr = this.generalFormService.details;
    detailsArr = this.changeLabels(detailsArr);
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
    this.flag=true;
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
    // let centerFieldId 
    // if(this.squadAssembleService.tripInfofromService ! = undefined){
    //    centerFieldId = this.squadAssembleService.tripInfofromService.trip.centerField.id;
    // }  
    // else{
    //   let retrievedObject = localStorage.getItem('tripInfofromService');
    //   let retrievedObj = JSON.parse(retrievedObject);
    //   centerFieldId= retrievedObj.trip.centerField.id;
    // }
    
    this.supplierSub= this.orderService.getSupplierByOrderType(this.orderType,this.centerFieldId).subscribe(
      response => {
        console.log(response);
        this.supplierId= response.id;
        if(response.isXemptedFromVat==1)
        this.isSupplierXemptedFromVat=true;
        else
        this.isSupplierXemptedFromVat=false;
        let supplierIndex = this.generalFormService.details.findIndex(i => i.key === 'supplierId');
        this.generalFormService.details[supplierIndex].value= this.supplierId.toString();
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
      //if (!this.additionsService.globalValidations(this.form)) { return; }
      //if (!this.validationsMusicActivation()) { return; }
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
          music.totalHours= this.form.getRawValue().details[key];
        }

      });
      music.globalParameters['startHour'] = this.setDateTimeFormat(music.globalParameters.startDate, music.globalParameters.startHour);
      music.globalParameters['endHour'] = this.setDateTimeFormat(music.globalParameters.endDate, music.globalParameters.endHour);
      music.globalParameters['comments'] = this.form.getRawValue().comments.comments;
      music.globalParameters.orderId = orderId;
      music.order.supplier.id = +this.form.getRawValue().details.supplierId;
      music.order.tripId = this.squadAssembleService.tripInfofromService.trip.id;
      music.order.orderType.name = 'מפעיל מוסיקלי';
      music.order.orderType.id = 7;
      if(this.item!= undefined){
        if (this.item.globalParameters.tempOrderIdentity != undefined)
        music.globalParameters.tempOrderIdentity = this.item.globalParameters.tempOrderIdentity;
      }
     
      //this.generalFormService.addOrder(music, music.order.orderType.id);
      if(!this.isEditable)
      this.generalFormService.addOrder(music, music.order.orderType.id);
      else{
        music.globalParameters.itemOrderRecordId= this.item.globalParameters.itemOrderRecordId;
        this.generalFormService.editOrder(music, music.order.orderType.id);
      }
      
      this.form.disable({ emitEvent: false });
    }
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
  }

  public onValueChange(event) {
    this.form = event;
    console.log('I am form Event');
    this.form.controls["details"].get('billingSupplier').disable({ emitEvent: false });
    this.form.controls["details"].get('billingCustomer').disable({ emitEvent: false });
    this.form.controls["details"].get('itemCost').disable({ emitEvent: false });
    this.form.controls["details"].get('supplierId').valueChanges.pipe(distinctUntilChanged())
      .subscribe(value => {
        console.log('supplier changed:',value);
        this.supplierId=value;
        this.form.controls["details"].get('itemId').patchValue('', { emitEvent: false });
        let supplier= this.generalFormService.originalSupplierList.find(i=> i.id=== +value);
        if(supplier.isXemptedFromVat==1)
        this.isSupplierXemptedFromVat=true;
        else
        this.isSupplierXemptedFromVat=false;
        this.getOrderItemBySupplierId();
      });
    this.form.controls["details"].get('itemId').valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
      console.log(value)
      let item = this.originalItemList.find(el => el.id === parseInt(value))
      let itemCost;
      if(!item.cost){
        this.form.controls["details"].get('itemCost').setValue(0, { emitEvent: false });
        this.form.controls["details"].get('billingSupplier').patchValue(0, { emitEvent: false });
        this.form.controls["details"].get('billingCustomer').patchValue(0, { emitEvent: false });
        return;
      }
      if(this.isSupplierXemptedFromVat=true)
        itemCost = Math.floor(item.cost);
       else
       itemCost = Math.floor(item.costVat);
      this.form.controls["details"].get('itemCost').setValue(itemCost,{emitEvent: false });
      console.log(this.form.value.details);
      let form = this.additionsService.calculateBillings(this.form.value.details,this.isSupplierXemptedFromVat);
      this.form.controls["details"].get('billingSupplier').patchValue(form.billingSupplier,{emitEvent: false});
      this.form.controls["details"].get('billingCustomer').patchValue(form.billingCustomer,{emitEvent: false});

    });

    this.form.controls["details"].get('quantity').valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
      console.log(value)
      let form = this.additionsService.calculateBillings(this.form.value.details,this.isSupplierXemptedFromVat);
      this.form.controls["details"].get('billingSupplier').patchValue(form.billingSupplier,{emitEvent: false});
      this.form.controls["details"].get('billingCustomer').patchValue(form.billingCustomer,{emitEvent: false});

    });
    this.form.controls["details"].get('startDate').valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
      console.log(value)
      let form = this.additionsService.calculateBillings(this.form.value.details,this.isSupplierXemptedFromVat);
      this.form.controls["details"].get('billingSupplier').patchValue(form.billingSupplier, { emitEvent: false });
      this.form.controls["details"].get('billingCustomer').patchValue(form.billingCustomer, { emitEvent: false });

    });
    this.form.controls["details"].get('endDate').valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
      console.log(value)
      let form = this.additionsService.calculateBillings(this.form.value.details,this.isSupplierXemptedFromVat);
      this.form.controls["details"].get('billingSupplier').patchValue(form.billingSupplier, { emitEvent: false });
      this.form.controls["details"].get('billingCustomer').patchValue(form.billingCustomer, { emitEvent: false });

    });
    console.log(this.form)
  }

  ngOnDestroy() {
    if (this.supplierListSub) { this.supplierListSub.unsubscribe(); }
    if (this.supplierSub) { this.supplierSub.unsubscribe(); }
    if (this.itemListSub) { this.itemListSub.unsubscribe(); }
    if(this.tableDataSub) {this.tableDataSub.unsubscribe();}
    if(this.isSaveOrderSucceededSub){this.isSaveOrderSucceededSub.unsubscribe()}
  }

}
