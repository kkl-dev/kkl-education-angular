import { Component, Input, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-transport-form',
  templateUrl: './transport-form.component.html',
  styleUrls: ['./transport-form.component.scss'],
})
export class TransportFormComponent implements OnInit {
  
  // @Input() public transport: TransportModel;
  //@Input() public transport: TransportOrder;
  @Input() public order: any;
  @Input() public editMode: boolean;
  public form: FormGroup;
  public columns: TableCellModel[];
  tripId : number;
  originalItemList = [];
  public formTemplate: FormTemplate = {
    hasGroups: true,
    questionsGroups: [],
  };

  constructor(private generalFormService: GeneralFormService, private transportService: TransportService, private additionsService: AdditionsService,
    private orderService: OrderService, private _dialog: MatDialog, private squadAssembleService: SquadAssembleService) { }

  ngOnInit(): void {
    this.tripId=this.squadAssembleService.tripInfofromService.trip.id;
    this.getSupplierList(1,this.tripId,0);
    //this.generalFormService.getSupplierList(1,this.tripId,0);
    // if (this.editMode) {
    //   this.generalFormService.setFormValues(this.order);
    // }

    //this.generalFormService.setDatesValues();
    if (this.order!= undefined && this.order!= null) {
       this.generalFormService.setFormValues(this.order);

    }
    this.setformTemplate();
    
    // let index = this.generalFormService.questionGroups.findIndex(el => el.key === "details");
    // // this.generalFormService.questionGroups[index].questions=this.generalFormService.details;
    // // let transportQuestions = this.generalFormService.questionGroups[index].questions.concat(this.generalFormService.transport);
    // // this.generalFormService.questionGroups[index].questions=transportQuestions;
    // //option2
    // let detailsArr= this.generalFormService.details;
    // detailsArr= this.changeLabels(detailsArr);
    // let transportQuestions = detailsArr.concat(this.generalFormService.transport);
    //  this.generalFormService.questionGroups[index].questions = transportQuestions;
    // this.formTemplate.questionsGroups=this.generalFormService.questionGroups;
    // console.log('group transport is: ',this.formTemplate.questionsGroups);
    
  }

  setformTemplate(){
    let index = this.generalFormService.questionGroups.findIndex(el => el.key === "details");
    let detailsArr= this.generalFormService.details;
    detailsArr= this.changeLabels(detailsArr);
    let transportQuestions = detailsArr.concat(this.generalFormService.transport);
     this.generalFormService.questionGroups[index].questions = transportQuestions;
    this.formTemplate.questionsGroups=this.generalFormService.questionGroups;
    console.log('group transport is: ',this.formTemplate.questionsGroups);
    
  }

  changeLabels(tempArr) {
    console.log('tempArr is :', tempArr);
    let startDateIndex = tempArr.findIndex(el => el.key === 'startDate');
    tempArr[startDateIndex].label = 'תאריך איסוף';
    let endDateIndex = tempArr.findIndex(el => el.key === 'endDate');
    tempArr[endDateIndex].label = 'תאריך פיזור';
    let startHourIndex = tempArr.findIndex(el => el.key === 'startHour');
    tempArr[startHourIndex].label = 'שעת איסוף';
    let endHourIndex = tempArr.findIndex(el => el.key === 'endHour');
    tempArr[endHourIndex].label = 'שעת פיזור';
    return tempArr;
  }

   getSupplierList(orderTypeId,tripId,orderId){
    this.orderService.getSupplierList(orderTypeId, tripId, orderId).subscribe(
      response => {
        console.log(response)
        response.forEach(element => {
          this.generalFormService.supplierList.push({ label: element.name, value: element.id.toString() });
        });
         this.getSupplierByOrderType(orderTypeId);
      },
      error => console.log(error),       // error
      () => console.log('completed')     // complete
    )
   }

   getSupplierByOrderType(orderTypeId) {
    this.orderService.getSupplierByOrderType(orderTypeId,1, 4).subscribe(
      response => {
        console.log(response);
        // if(this.form)
        //  this.form.controls["details"].get('supplier').setValue(response.id.toString());
      },
      error => console.log(error),       // error
      () => console.log('completed')     // complete
    )
   
  }

  

  public onSave(): void {
  
    if (this.form) {
      // .status==='VALID'
      // if (!this.validationsTransport()) { return; }
      this.editMode = true;
      this.form.disable();
      let orderId;
      if(this.generalFormService.transportOrderList.length>0){
         orderId= this.generalFormService.transportOrderList[0].order.orderId
      }
      var t = {} as TransportOrder;
      t.globalParameters = {} as OrderItemCommonDetails;
      t.order = {} as Order;
      if (orderId!= undefined)
      t.order.orderId= orderId;
      t.order.supplier = {} as Supplier;
      t.order.orderType = {} as OrderType;
      Object.keys(this.form.value.details).map((key, index) => {
        if (key !== 'pickUpAddress'  && key !== 'supplier' && key !== 'scatterAddress') {
          if( key !='startDate' && key!='endDate'){
            t.globalParameters[key] = this.form.value.details[key];
          }        
          else{
             if(key=='startDate'){
              t.globalParameters[key]= this.generalFormService.changeDateFormat(this.form.value.details[key],'UTC')
             }
             if(key=='endDate'){
              t.globalParameters[key]= this.generalFormService.changeDateFormat(this.form.value.details[key],'UTC')
             }
          }
       
        }
        else if (key !== "supplier") {
          t[key] = this.form.value.details[key]
        }
      });
      t.globalParameters['endHour'] = '2021-11-21T14:00:00';
      t.globalParameters['startHour'] = '2021-11-21T15:00:00';
      t.globalParameters['comments'] = this.form.value.comments.comments;
      t.globalParameters.orderId= orderId;
      t.order.supplier.id = +this.form.value.details.supplier;
      t.order.tripId = this.squadAssembleService.tripInfofromService.trip.id;
      t.order.orderType.name = 'היסעים';
      t.order.orderType.id = 1;
      this.generalFormService.addOrder(t,'היסעים');
    }
  }
  // validationsTransport() {
  //   if (this.generalFormService.originalItemList.length > 0) {
  //     var item = this.generalFormService.originalItemList.find(el => el.id.toString() === this.form.value.details['itemId']);
  //   }
  //   if (item.credit === 0) {
      // if (!item.name.includes("נסיעות")) {
      //   if (this.form.value.details['startHour'] === null || this.form.value.details['startHour'] === "" || this.form.value.details['startHour'] === undefined) {
      //     const dialogRef = this._dialog.open(ConfirmDialogComponent, {
      //       width: '500px',
      //       data: { message: 'בהזמנת היסעים - חובה למלא שעת התייצבות', content: '', rightButton: 'ביטול', leftButton: 'המשך' }
      //     })
      //     return false;
      //   }
      //   if (this.form.value.details['pickUpLocation'] === null || this.form.value.details['pickUpLocation'] === "" || this.form.value.details['pickUpLocation'] === undefined) {
      //     const dialogRef = this._dialog.open(ConfirmDialogComponent, {
      //       width: '500px',
      //       data: { message: 'בהזמנת היסעים - חובה למלא מקום התייצבות', content: '', rightButton: 'ביטול', leftButton: 'המשך' }
      //     })
      //     return false;
      //   }
      // }
      // if (this.form.value.details['peopleInTrip'] === null || this.form.value.details['peopleInTrip'] === "" || this.form.value.details['peopleInTrip'] === undefined) {
      //   const dialogRef = this._dialog.open(ConfirmDialogComponent, {
      //     width: '500px',
      //     data: { message: 'בהזמנת היסעים - חובה למלא מספר משתתפים', content: '', rightButton: 'ביטול', leftButton: 'המשך' }
      //   })
      //   return false;
      // }
      // if (item.participantsLimit < this.form.value.details['peopleInTrip']) {
      //   const dialogRef = this._dialog.open(ConfirmDialogComponent, {
      //     width: '500px',
      //     data: { message: 'מספר המשתתפים גדול מסך המקומות באוטובוס - יש להוסיף אוטובוס נוסף', content: '', rightButton: 'ביטול', leftButton: 'המשך' }
      //   })
      //   return false;
      // }
      // var people = parseInt(this.form.value.details['peopleInTrip'])
      // console.log(people % item.participantsLimit)
      // console.log(Math.floor(people / item.participantsLimit))
      // if (((people % item.participantsLimit) > 0) && (Math.floor(people / item.participantsLimit) > 0)) {
      //   if (Math.floor(people / item.participantsLimit) < parseInt(this.form.value.details['quantity'])) {
      //     const dialogRef = this._dialog.open(ConfirmDialogComponent, {
      //       width: '500px',
      //       data: { message: 'מספר המשתתפים קטן מסך מספר המקומות בכל האוטובוסים יחד - שים לב שלא הוזמן אוטובוס מיותר', content: '', rightButton: 'ביטול', leftButton: 'המשך' }
      //     })
      //     return false;
      //   }
      // }
      // }
  //   }
  //   return true;
  // }
  public onEdit() {
    this.editMode = false;
    this.form.enable();
  }

  public onValueChange(event) {
    this.form = event;
    console.log('I am form event');
    this.form.controls["details"].get('peopleInTrip').setValue(this.squadAssembleService.peopleInTrip);
    //this.getSupplierByOrderType(1);
    this.form.controls["details"].get('supplier').valueChanges.subscribe(value => {
      console.log(value);
      this.getOrderItemBySupplierId(value);
   });
    this.form.controls["details"].get('itemId').valueChanges.subscribe(value => {
       console.log(value);
       let item = this.originalItemList.find(el => el.id === parseInt(value))
       var x = Math.floor(item.cost);
       this.form.controls["details"].get('itemCost').patchValue(x);
    });
   
    console.log(this.form)
    this.form.controls["details"].get('supplier').valueChanges.subscribe(value => {
      console.log(value)
    });
    this.form.controls["details"].get('itemId').valueChanges.subscribe(value => {
      console.log(value)
      this.form.value.details.itemId = value;
      this.additionsService.calculateBillings(this.form.value.details)

    });


  }
  
 
  
  getOrderItemBySupplierId(supplierId) {
    this.orderService.getOrdersItemBySupplierID(supplierId, 1, false).subscribe(
      response => {
        console.log(response);
        this.originalItemList = response;
        response.forEach(element => {
          this.generalFormService.itemsList.push({ label: element.name, value: element.id.toString() });
        });
      },
      error => console.log(error),       // error
      () => console.log('completed')     // complete
    )
  }

  
}
