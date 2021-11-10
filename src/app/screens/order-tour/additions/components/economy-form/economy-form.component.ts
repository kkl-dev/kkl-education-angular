import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormTemplate } from 'src/app/components/form/logic/form.service';
import { TableCellModel } from 'src/app/utilities/models/TableCell';
import { AdditionsService } from '../../services/additions.service';
import { EconomyOrder, Order, OrderItemCommonDetails, OrderService, OrderType, Supplier, TransportOrder, UserService } from 'src/app/open-api';
import { SquadAssembleService } from '../../../squad-assemble/services/squad-assemble.service';
import { GeneralFormService } from '../../services/general-form.service';
import { ConfirmDialogComponent } from 'src/app/utilities/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-economy-form',
  templateUrl: './economy-form.component.html',
  styleUrls: ['./economy-form.component.scss']
})
export class EconomyFormComponent implements OnInit, OnDestroy {

  constructor(private _dialog: MatDialog, private generalFormService: GeneralFormService, private squadAssembleService: SquadAssembleService, private additionsService: AdditionsService, private orderService: OrderService) { }
  @Input() public item: any;
  @Input() public editMode: boolean;
  @Input() orderType: number;
  tripId: number;
  supplierId: number;
  itemId: number;
  centerFieldId: number;

  itemsList=[];
  flag: boolean =false;
  isEditable : boolean= false;
  originalItemList=[];

  supplierListSub: Subscription;
  supplierSub: Subscription;
  ifShowtable: boolean=false;
  tableDataSub: Subscription;
  tableData: any;
  isItemOrderExist: boolean;
  public form: FormGroup;
  public columns: TableCellModel[];

  public formTemplate: FormTemplate = {
    hasGroups: true,
    questionsGroups: [],
  };

  ngOnInit(): void {

  
    this.tripId = this.squadAssembleService.tripInfofromService.trip.id;
    this.centerFieldId = this.squadAssembleService.tripInfofromService.trip.centerField.id;
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
      }
    }
    else {
      let peopleInTripIndex = this.generalFormService.details.findIndex(i => i.key === 'peopleInTrip');
      this.generalFormService.details[peopleInTripIndex].value = this.squadAssembleService.peopleInTrip;
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
    this.generalFormService.questionGroups[index].questions = this.generalFormService.details;
    //let detailsArr = this.generalFormService.details;
    let detailsArr = this.generalFormService.questionGroups[index].questions;
    detailsArr = this.changeLabels(detailsArr);
    let economyQuestions = detailsArr.concat(this.generalFormService.economy);
    this.generalFormService.questionGroups[index].questions = economyQuestions;
    //this.formTemplate.questionsGroups = this.generalFormService.questionGroups;

  }
  changeLabels(tempArr) {
    console.log('tempArr is :', tempArr);

    let startDateIndex = tempArr.findIndex(el => el.key === 'startDate');
    tempArr[startDateIndex].label = 'מתאריך';
    let endDateIndex = tempArr.findIndex(el => el.key === 'endDate');
    tempArr[endDateIndex].label = 'עד תאריך';
    let startHourIndex = tempArr.findIndex(el => el.key === 'startHour');
    tempArr[startHourIndex].label = 'שעת הגשה';
    let endHourIndex = tempArr.findIndex(el => el.key === 'endHour');
    tempArr[endHourIndex].label = 'שעת סיום';
    let locationIndex = tempArr.findIndex(el => el.key === 'location');
    tempArr[locationIndex].label = 'מיקום';
    return tempArr;
  }




  

  getSupplierList(orderTypeId, tripId, orderId) {
    this.supplierListSub = this.orderService.getSupplierList(orderTypeId, tripId, orderId).subscribe(
      response => {
        console.log(response);
        this.generalFormService.supplierList = [];
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
        this.supplierId = response.id;
        let supplierIndex = this.generalFormService.details.findIndex(i => i.key === 'supplierId');
        this.generalFormService.details[supplierIndex].value = this.supplierId.toString();
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
        this.itemsList = [];
        this.originalItemList = response;
        this.generalFormService.originalItemList = response;
        response.forEach(element => {
          this.itemsList.push({ label: element.name, value: element.id.toString() });
        });
        let itemIndex = this.generalFormService.details.findIndex(i => i.key === 'itemId');
        this.generalFormService.details[itemIndex].inputProps.options = this.itemsList;
        if (this.itemId != undefined)
          this.generalFormService.details[itemIndex].value = this.itemId.toString();
        if (this.item != undefined && this.item != null) {
          this.item.globalParameters.supplierId = this.supplierId.toString();
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

  initiateForm() {
    this.flag = true;
    this.formTemplate.questionsGroups = this.generalFormService.questionGroups;
    console.log('this.formTemplate.questionsGroups:', this.formTemplate.questionsGroups)
  }
  displayTable(){
    let transArr= this.generalFormService.economyOrderList;
    let currentObj= transArr.find(i=> (i.globalParameters.itemOrderRecordId)=== (this.item.globalParameters.itemOrderRecordId) && (i.globalParameters.supplierId)=== (this.item.globalParameters.supplierId) );
    let arr=[]
    arr.push(currentObj);
    this.tableData=arr;
    this.ifShowtable=true;

 }

 
  public onSave(): void {
    if (this.form) {

     //if (!this.additionsService.globalValidations(this.form)) { return; }
      //if (!this.validationsEconomy()) { return; }
      this.editMode = true;
      let orderId;
      if (this.generalFormService.economyOrderList.length > 0) {
        orderId = this.generalFormService.economyOrderList[0].order.orderId
      }
      let eco = {} as EconomyOrder;
      eco.globalParameters = {} as OrderItemCommonDetails;
      eco.order = {} as Order;
      eco.order.orderId = orderId;
      eco.order.supplier = {} as Supplier;
      eco.order.orderType = {} as OrderType;
      Object.keys(this.form.getRawValue().details).map((key, index) => {
        if (key !== 'regularDishesNumber' && key !== 'vegetarianDishesNumber' && key !== 'veganDishesNumber') {
          if (key != 'startDate' && key != 'endDate') {
            eco.globalParameters[key] = this.form.getRawValue().details[key]
          } else {
            if (key == 'startDate') {
              eco.globalParameters[key] = this.generalFormService.changeDateFormat(this.form.getRawValue().details[key], 'UTC')
            }
            if (key == 'endDate') {
              eco.globalParameters[key] = this.generalFormService.changeDateFormat(this.form.getRawValue().details[key], 'UTC')
            }
          }
        } else {
          eco.regularDishesNumber= this.form.getRawValue().details[key];
          eco.veganDishesNumber= this.form.getRawValue().details[key];
          eco.vegetarianDishesNumber= this.form.getRawValue().details[key];
        }

      });
      eco.globalParameters['startHour'] = this.setDateTimeFormat(eco.globalParameters.startDate, eco.globalParameters.startHour);
      eco.globalParameters['endHour'] = this.setDateTimeFormat(eco.globalParameters.endDate, eco.globalParameters.endHour);
      eco.globalParameters['comments'] = this.form.getRawValue().comments.comments;
      eco.globalParameters.orderId = orderId;
      eco.order.supplier.id = +this.form.getRawValue().details.supplierId;
      eco.order.tripId = this.squadAssembleService.tripInfofromService.trip.id;
      eco.order.orderType.name = 'כלכלה';
      eco.order.orderType.id = 4;
      if(this.item!= undefined){
        if (this.item.globalParameters.tempOrderIdentity != undefined)
        eco.globalParameters.tempOrderIdentity = this.item.globalParameters.tempOrderIdentity;
      }
    
      if(!this.isEditable)
      this.generalFormService.addOrder(eco, eco.order.orderType.id);
      else{
        eco.globalParameters.itemOrderRecordId= this.item.globalParameters.itemOrderRecordId;
        this.generalFormService.editOrder(eco, eco.order.orderType.id);
      }
      
      this.form.disable({ emitEvent: false });
    }
  }

  setDateTimeFormat(date, hour) {
    let str = date.split("T");
    let hourFormat = str[0] + 'T' + hour;
    return hourFormat;
  }

  validationsEconomy() {
    if (this.form.value.details['startHour'] === null || this.form.value.details['startHour'] === "" || this.form.value.details['startHour'] === undefined) {
      const dialogRef = this._dialog.open(ConfirmDialogComponent, {
        width: '500px',
        data: { message: 'בהזמנת כלכלה - חובה למלא שעת התייצבות', content: '', rightButton: 'ביטול', leftButton: 'המשך' }
      })
      return false;
    }
    if (this.form.value.details['endHour'] === null || this.form.value.details['endHour'] === "" || this.form.value.details['endHour'] === undefined) {
      const dialogRef = this._dialog.open(ConfirmDialogComponent, {
        width: '500px',
        data: { message: 'בהזמנת כלכלה - חובה למלא שעת סיום', content: '', rightButton: 'ביטול', leftButton: 'המשך' }
      })
      return false;
    }
    if (this.form.value.details['peopleInTrip'] === null || this.form.value.details['peopleInTrip'] === "" || this.form.value.details['peopleInTrip'] === undefined) {
      const dialogRef = this._dialog.open(ConfirmDialogComponent, {
        width: '500px',
        data: { message: 'בהזמנת כלכלה - חובה למלא מספר משתתפים', content: '', rightButton: 'ביטול', leftButton: 'המשך' }
      })
      return false;
    }
    if (this.form.value.details['peopleInTrip'] !== +this.form.value.details['quantity']) {
      const dialogRef = this._dialog.open(ConfirmDialogComponent, {
        width: '500px',
        data: { message: 'בהזמנת כלכלה - מספר המשתתפים חייב להיות זהה לכמות', content: '', rightButton: 'ביטול', leftButton: 'המשך' }
      })
      return false;
    }
    let str = this.form.value.details['startDate'].split("/");
    let startDate1 = str[2] + '-' + str[1] + '-' + str[0];
    let startDate = new Date(startDate1);
    let str2 = this.form.value.details['startDate'].split("/");
    let startDate2 = str2[2] + '-' + str2[1] + '-' + str2[0];
    let endDate = new Date(startDate2);
    var DaysArray = this.getDaysArray(startDate, endDate);
    if (this.generalFormService.originalItemList.length > 0) {
      var item = this.generalFormService.originalItemList.find(el => el.id.toString() === this.form.value.details['itemId']);
    }
    var flag = false;
    DaysArray.forEach(day => { if (day.getDay() === 6) { flag = true; } });
    if (flag && !item.name.includes("שבת") && !item.name.includes("סעודה שלישית")) {
      const dialogRef = this._dialog.open(ConfirmDialogComponent, {
        width: '500px',
        data: { message: 'הטיול חל ביום שבת - יש לבדוק שהזנת הפריטים תואמים', content: '', rightButton: 'ביטול', leftButton: 'המשך' }
      })
      return false;
    }
    if (flag === false && item.name.includes("שבת") && item.name.includes("סעודה שלישית")) {
      const dialogRef = this._dialog.open(ConfirmDialogComponent, {
        width: '500px',
        data: { message: 'הטיול אינו חל ביום שבת - נבחרה מנה המתאימה ליום שבת! יש לבדוק שהזנת הפריטים תואמים', content: '', rightButton: 'ביטול', leftButton: 'המשך' }
      })
      return false;
    }
    flag = false;
    DaysArray.forEach(day => { if (day.getDay() === 5) { flag = true; } });
    if (flag === false && !item.name.includes("שישי")) {
      const dialogRef = this._dialog.open(ConfirmDialogComponent, {
        width: '500px',
        data: { message: 'הטיול אינו חל ביום שישי - נבחרה מנה המתאימה ליום שישי! יש לבדוק שהזנת הפריטים תואמים', content: '', rightButton: 'ביטול', leftButton: 'המשך' }
      })
      return false;
    }
    if ((this.form.value.details['startDate'] !== this.form.value.details['endDate']) && item.credit === 0) {
      const dialogRef = this._dialog.open(ConfirmDialogComponent, {
        width: '500px',
        data: { message: 'בהזמנה מסוג כלכלה - תאריך ההתחלה והסיום צריכים להיות זהים', content: '', rightButton: 'ביטול', leftButton: 'המשך' }
      })
      return false;
    }
    flag = false;
    if (item.credit === 0 && !item.name.includes("תוספת")) {
      this.generalFormService.economyOrderList.forEach(element => {
        if (element.globalParameters.startDate.localeCompare(this.form.value.details['startDate']) === 0 && element.globalParameters.itemId === parseInt(this.form.value.details['itemId'])) { flag = true; }
      });
      if (flag) {
        const dialogRef = this._dialog.open(ConfirmDialogComponent, {
          width: '500px',
          data: { message: 'בהזמנת כלכלה - לא ניתן להזמין מספר פריטים זהים באותו תאריך', content: '', rightButton: 'ביטול', leftButton: 'המשך' }
        })
        return false;
      }
    }
    // if (this.squadAssembleService.tripInfofromService.trip.insideCenterFieldId === 1) {
    //   //בדיקה אם חדר האוכל פנוי בתאריכים אלו
    //   // אם תפוס - הודעת שגיאה ולבדוק אם צריך למחוק את כל הערכים בשדות 
    //   const dialogRef = this._dialog.open(ConfirmDialogComponent, {
    //     width: '500px',
    //     data: { message: 'רק מנהל מרכז השדה יכול לאשר הזמנה זו,' + this.form.value.details['startDate'] + ' חדר האוכל תפוס בתאריכים', content: '', rightButton: 'ביטול', leftButton: 'המשך' }
    //   })
    //   return false;
    // }
    return true;
  }

  getDaysArray = function (start, end) {
    for (var arr = [], dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
      arr.push(new Date(dt));
    }
    return arr;
  };
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
        this.getOrderItemBySupplierId();

      });
    this.form.controls["details"].get('itemId').valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
      console.log(value)
      let item = this.originalItemList.find(el => el.id === parseInt(value))
      let itemCost = Math.floor(item.cost);
      this.form.controls["details"].get('itemCost').setValue(itemCost, { emitEvent: false });
      console.log(this.form.value.details);
      let form = this.additionsService.calculateBillings(this.form.value.details);
      this.form.controls["details"].get('billingSupplier').patchValue(form.billingSupplier, { emitEvent: false });
      this.form.controls["details"].get('billingCustomer').patchValue(form.billingCustomer, { emitEvent: false });

    });

    this.form.controls["details"].get('quantity').valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
      console.log(value)
      let form = this.additionsService.calculateBillings(this.form.value.details);
      this.form.controls["details"].get('billingSupplier').patchValue(form.billingSupplier, { emitEvent: false });
      this.form.controls["details"].get('billingCustomer').patchValue(form.billingCustomer, { emitEvent: false });

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
    if(this.tableDataSub) {this.tableDataSub.unsubscribe();}
  }
}
