import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormTemplate } from 'src/app/components/form/logic/form.service';
import { TableCellModel } from 'src/app/utilities/models/TableCell';
import { AdditionsService } from '../../services/additions.service';
import { TransportService } from '../../services/transport.service';
import { EconomyOrder, Order, OrderItemCommonDetails, OrderService, OrderType, Supplier, TransportOrder, UserService } from 'src/app/open-api';
import { SquadAssembleService } from '../../../squad-assemble/services/squad-assemble.service';
import { GeneralFormService } from '../../services/general-form.service';
import { ConfirmDialogComponent } from 'src/app/utilities/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { distinctUntilChanged } from 'rxjs/operators';
@Component({
  selector: 'app-economy-form',
  templateUrl: './economy-form.component.html',
  styleUrls: ['./economy-form.component.scss']
})
export class EconomyFormComponent implements OnInit {

  constructor(private transportService: TransportService, private _dialog: MatDialog, private generalFormService: GeneralFormService, private squadAssembleService: SquadAssembleService, private additionsService: AdditionsService, private orderService: OrderService) { }
  @Input() public item: any;
  @Input() public editMode: boolean;
  tripId : number;

  public form: FormGroup;
  public columns: TableCellModel[];

  public formTemplate: FormTemplate = {
    hasGroups: true,
    questionsGroups: [],
  };

  ngOnInit(): void {

    this.tripId=this.squadAssembleService.tripInfofromService.trip.id;
     this.generalFormService.setDatesValues();
    this.getSupplierList(4, this.tripId, 0);

    // if (this.editMode) {
    //   this.generalFormService.setFormValues(this.order);
    // }
    this.generalFormService.itemsList=[]
    let itemIndex= this.generalFormService.details.findIndex(i => i.key==='itemId');
    this.generalFormService.details[itemIndex].inputProps.options= this.generalFormService.itemsList;
    if (this.item != undefined && this.item != null) {
      if(this.item.globalParameters.supplierId!= undefined || this.item.length==0){
        this.generalFormService.getOrderItemBySupplierId(this.item.globalParameters.supplierId);
      }
      this.generalFormService.setFormValues(this.item);
    }
    else{
      let peopleInTripIndex= this.generalFormService.details.findIndex(i => i.key==='peopleInTrip');
      this.generalFormService.details[peopleInTripIndex].value= this.squadAssembleService.peopleInTrip;
      this.clearFields();
    }
    this.setformTemplate();
   
  }

  setformTemplate() {
    let index = this.generalFormService.questionGroups.findIndex(el => el.key === "details");
    let detailsArr = this.generalFormService.details;
    detailsArr = this.changeLabels(detailsArr);
    let economyQuestions = detailsArr.concat(this.generalFormService.economy);
    this.generalFormService.questionGroups[index].questions = economyQuestions;
    this.formTemplate.questionsGroups = this.generalFormService.questionGroups;

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
    tempArr[locationIndex].label =  'מיקום';
    return tempArr;
  }

  
   clearFields(){
    let statHourIndex =this.generalFormService.details.findIndex(i => i.key==='startHour');
    this.generalFormService.details[statHourIndex].value='';
    let endHourIndex = this.generalFormService.details.findIndex(i => i.key==='endHour');
    this.generalFormService.details[endHourIndex].value='';
  }
  getSupplierList(orderTypeId, tripId, orderId) {
    this.orderService.getSupplierList(orderTypeId, tripId, orderId).subscribe(
      response => {
        console.log(response);
        this.generalFormService.supplierList=[];
        response.forEach(element => {
          this.generalFormService.supplierList.push({ label: element.name, value: element.id.toString() });
        });
        let index= this.generalFormService.details.findIndex(i => i.key==='supplierId');
        this.generalFormService.details[index].inputProps.options= this.generalFormService.supplierList;
        //this.getSupplierByOrderType(orderTypeId);
      },
      error => console.log(error),       // error
      () => console.log('completed')     // complete
    )
  }

  getSupplierByOrderType(orderTypeId) {
    let centerFieldId = this.squadAssembleService.tripInfofromService.trip.centerField.id;
    this.orderService.getSupplierByOrderType(orderTypeId, centerFieldId, 4).subscribe(
      response => {
        console.log(response);
        if(this.form)
         this.form.controls["details"].get('supplier').setValue(response.id.toString());
      },
      error => console.log(error),       // error
      () => console.log('completed')     // complete
    )

  }

  public onSave(): void {
    if (this.form) {
      // if (!this.validationsEconomy()) { return; }
      this.editMode = true;
      let orderId;
      if(this.generalFormService.economyOrderList.length>0){
        orderId= this.generalFormService.economyOrderList[0].order.orderId
     }
      var t = {} as EconomyOrder;
      t.globalParameters = {} as OrderItemCommonDetails;
      t.order = {} as Order;
      t.order.orderId = orderId;
      t.order.supplier = {} as Supplier;
      t.order.orderType = {} as OrderType;
      Object.keys(this.form.value.details).map((key, index) => {
        if (key !== 'regularDishesNumber' && key !== 'vegetarianDishesNumber' && key !== 'veganDishesNumber' && key !== 'supplier') {
          if( key !='startDate' && key!='endDate'){
            t.globalParameters[key] = this.form.value.details[key]
          } else{
            if(key=='startDate'){
              t.globalParameters[key]= this.generalFormService.changeDateFormat(this.form.value.details[key],'UTC')
             }
             if(key=='endDate'){
              t.globalParameters[key]= this.generalFormService.changeDateFormat(this.form.value.details[key],'UTC')
             }
          }
        }
       
      });
      t.globalParameters['startHour']= this.setDateTimeFormat(t.globalParameters.startDate,t.globalParameters.startHour);
      t.globalParameters['endHour'] = this.setDateTimeFormat(t.globalParameters.endDate,t.globalParameters.endHour);
      t.globalParameters['comments'] = this.form.value.comments.comments;
      t.globalParameters.orderId=orderId;
      t.order.supplier.id = +this.form.value.details.supplierId;
      t.order.tripId = this.squadAssembleService.tripInfofromService.trip.id;
      t.order.orderType.name = 'כלכלה';
      t.order.orderType.id = 4;
      this.generalFormService.addOrder(t,'כלכלה');
      this.form.disable({ emitEvent: false });
    }
  }

   setDateTimeFormat(date,hour){
    let str= date.split("T");
    let hourFormat= str[0]+'T'+hour;
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

    return true;
  }


  public onEdit() {
    this.editMode = false;
    this.form.enable();
  }

  public onValueChange(event) {
    this.form = event;
    console.log('I am form event');
    //this.getSupplierByOrderType(1);

    this.form.controls["details"].get('supplierId').valueChanges.pipe(distinctUntilChanged())
      .subscribe(value => {
        console.log(value);
        this.generalFormService.getOrderItemBySupplierId(value);
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

    console.log(this.form)
   
  }
}
