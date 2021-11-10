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
  supplierListSub: Subscription;
  supplierSub: Subscription;
  itemListSub:  Subscription;
  centerFieldId: number;
  flag: boolean =false;
  isEditable : boolean= false;
  public form: FormGroup;
  public columns: TableCellModel[];
  ifShowtable: boolean=false;
  tableDataSub: Subscription;
  tableData: any;
  isItemOrderExist: boolean;
  public formTemplate: FormTemplate = {
    hasGroups: true,
    questionsGroups: [],
  };
  ngOnInit(): void {

    this.tripId = this.squadAssembleService.tripInfofromService.trip.id;
    this.centerFieldId= this.squadAssembleService.tripInfofromService.trip.centerField.id;
    this.generalFormService.clearFormFields();
    this.generalFormService.itemsList = []
    let itemIndex = this.generalFormService.details.findIndex(i => i.key === 'itemId');
    this.generalFormService.details[itemIndex].inputProps.options = this.generalFormService.itemsList;


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
    //this.getSettelments();
    // if (this.editMode) {
    //   this.generalFormService.setFormValues(this.order);
    // }

   
    this.generalFormService.setDatesValues();
  
    this.tableDataSub=this.generalFormService.tableData.subscribe(res=>{
      console.log('res from table data intransort is :',res);
      this.tableData=res;
      this.ifShowtable=true;
    })

  }
  setformTemplate() {
    let index = this.generalFormService.questionGroups.findIndex(el => el.key === "details");
    let detailsArr = this.generalFormService.details;
    detailsArr = this.changeLabels(detailsArr);
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
    this.flag=true;
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
        let supplierIndex = this.generalFormService.details.findIndex(i => i.key === 'supplierId');
        this.generalFormService.details[supplierIndex].value= this.supplierId.toString();
         this.getOrderItemBySupplierId();

      },
      error => console.log(error),       // error
      () => console.log('completed')     // complete
    )

  }

  
  getOrderItemBySupplierId() {
    this.orderService.getOrdersItemBySupplierID(this.supplierId, this.centerFieldId, false).subscribe(
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
      //if (!this.additionsService.globalValidations(this.form)) { return; }
      //if (!this.validationsSecuring()) { return; }
      this.editMode = true;
      let orderId;
      if (this.generalFormService.economyOrderList.length > 0) {
        orderId = this.generalFormService.economyOrderList[0].order.orderId
      }
      let securing = {} as SecuringOrder;
      securing.globalParameters = {} as OrderItemCommonDetails;
      securing.order = {} as Order;
      securing.order.orderId = orderId;
      securing.order.supplier = {} as Supplier;
      securing.order.orderType = {} as OrderType;
      Object.keys(this.form.value.details).map((key, index) => {

        if (key !== 'scatterLocation') {

          if (key != 'startDate' && key != 'endDate') {
            securing.globalParameters[key] = this.form.value.details[key]
          } else {
            if (key == 'startDate') {
              securing.globalParameters[key] = this.generalFormService.changeDateFormat(this.form.value.details[key], 'UTC')
            }
            if (key == 'endDate') {
              securing.globalParameters[key] = this.generalFormService.changeDateFormat(this.form.value.details[key], 'UTC')
            }
          }
        }
        else {

        }

      });
      securing.globalParameters['startHour'] = this.setDateTimeFormat(securing.globalParameters.startDate, securing.globalParameters.startHour);
      securing.globalParameters['endHour'] = this.setDateTimeFormat(securing.globalParameters.endDate, securing.globalParameters.endHour);
      securing.globalParameters['comments'] = this.form.value.comments.comments;
      securing.globalParameters.orderId = orderId;
      securing.order.supplier.id = +this.form.value.details.supplierId;
      securing.order.tripId = this.squadAssembleService.tripInfofromService.trip.id;
      securing.order.orderType.name = '';
      securing.order.orderType.id = 7;
      if(this.item!= undefined){
        if (this.item.globalParameters.tempOrderIdentity != undefined)
        securing.globalParameters.tempOrderIdentity = this.item.globalParameters.tempOrderIdentity;
      }
      
      if(!this.isEditable)
      this.generalFormService.addOrder(securing, securing.order.orderType.id);
      else
      this.generalFormService.editOrder(securing, securing.order.orderType.id);
      this.form.disable({ emitEvent: false });
    }
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
    this.form.enable();
  }

  public onValueChange(event) {
    this.form = event;
    // this.form.controls["details"].get('billingSupplier').disable({ emitEvent: false });
    // this.form.controls["details"].get('billingCustomer').disable({ emitEvent: false });
    // this.form.controls["details"].get('itemCost').disable({ emitEvent: false });
    this.form.controls["details"].get('supplierId').valueChanges.pipe(distinctUntilChanged())
      .subscribe(value => {
        console.log(value);
        this.supplierId=value;
        this.getOrderItemBySupplierId();
      });
    this.form.controls["details"].get('itemId').valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
      console.log(value)
      let item = this.generalFormService.originalItemList.find(el => el.id === parseInt(value))
      let itemCost = Math.floor(item.cost);
      this.form.controls["details"].get('itemCost').patchValue(itemCost);
      console.log(this.form.value.details);
      let form = this.additionsService.calculateBillings(this.form.value.details);
      this.form.controls["details"].get('billingSupplier').patchValue(form.billingSupplier);
      this.form.controls["details"].get('billingCustomer').patchValue(form.billingCustomer);

    });
    this.form.controls["details"].get('quantity').valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
      console.log(value)
      let form = this.additionsService.calculateBillings(this.form.value.details);
      this.form.controls["details"].get('billingSupplier').patchValue(form.billingSupplier);
      this.form.controls["details"].get('billingCustomer').patchValue(form.billingCustomer);
    });

    this.form.controls["details"].get('startDate').valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
      console.log(value)
      let form = this.additionsService.calculateBillings(this.form.value.details);
      this.form.controls["details"].get('billingSupplier').patchValue(form.billingSupplier, { emitEvent: false });
      this.form.controls["details"].get('billingCustomer').patchValue(form.billingCustomer, { emitEvent: false });

    });
    this.form.controls["details"].get('endDate').valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
      console.log(value)
      let form = this.additionsService.calculateBillings(this.form.value.details);
      this.form.controls["details"].get('billingSupplier').patchValue(form.billingSupplier, { emitEvent: false });
      this.form.controls["details"].get('billingCustomer').patchValue(form.billingCustomer, { emitEvent: false });

    });

    console.log(this.form)
  }

  ngOnDestroy() {
    if (this.supplierListSub) { this.supplierListSub.unsubscribe(); }
    if (this.supplierSub) { this.supplierSub.unsubscribe(); }
  }


}
