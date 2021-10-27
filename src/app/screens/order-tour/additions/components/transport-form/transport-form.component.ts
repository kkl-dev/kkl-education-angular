import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormTemplate } from 'src/app/components/form/logic/form.service';
import { OrderItemCommonDetails, OrderService, TransportOrder } from 'src/app/open-api';
import { LocationModel } from 'src/app/screens/order-tour/additions/models/location.model';
import { TableCellModel } from 'src/app/utilities/models/TableCell';
//import { TransportModel } from '../../models/transport-model';
import { AdditionsService } from '../../services/additions.service';
import { TransportService } from '../../services/transport.service';
import { GeneralFormService } from '../../services/general-form.service';
import { ConfirmDialogComponent } from 'src/app/utilities/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-transport-form',
  templateUrl: './transport-form.component.html',
  styleUrls: ['./transport-form.component.scss'],
})
export class TransportFormComponent implements OnInit {
  // @Input() public location: LocationModel;
  // @Input() public transport: TransportModel;
  //@Input() public transport: TransportOrder;
  @Input() public order: any;
  @Input() public editMode: boolean;
  public form: FormGroup;
  public columns: TableCellModel[];

  public formTemplate: FormTemplate = {
    hasGroups: true,
    questionsGroups: [],
  };

  constructor(private generalFormService: GeneralFormService, private transportService: TransportService, private additionsService: AdditionsService,
    private orderService: OrderService, private _dialog: MatDialog) { }

  ngOnInit(): void {
    this.generalFormService.getSupplierList(1, 52275, 0);
    // if (this.editMode) {
    //   this.generalFormService.setFormValues(this.order);
    // }
    // this.generalFormService.setDatesValues();
    if (this.order != undefined && this.order != null) {
      this.generalFormService.setFormValues(this.order);
    }
    let index = this.generalFormService.questionGroups.findIndex(el => el.key === "details");
    // this.generalFormService.questionGroups[index].questions=this.generalFormService.details;
    // let transportQuestions = this.generalFormService.questionGroups[index].questions.concat(this.generalFormService.transport);
    // this.generalFormService.questionGroups[index].questions=transportQuestions;
    //option2
    let detailsArr = this.generalFormService.details;
    detailsArr = this.changeLabels(detailsArr);
    let transportQuestions = detailsArr.concat(this.generalFormService.transport);
    this.generalFormService.questionGroups[index].questions = transportQuestions;
    this.formTemplate.questionsGroups = this.generalFormService.questionGroups;
    console.log('group transport is: ', this.formTemplate.questionsGroups);

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

  public onSave(): void {
    if (this.form) {
      // .status==='VALID'
      // if (!this.validationsTransport()) { return; }
      this.editMode = true;
      this.form.disable();
      var t = {} as TransportOrder;
      t.globalParameters = {} as OrderItemCommonDetails;
      Object.keys(this.form.value.details).map((key, index) => {
        if (key !== 'pickUpAddress' && key !== 'pickUpLocation') {
          t.globalParameters[key] = this.form.value.details[key]
        }
        else {
          t[key] = this.form.value.details[key]
        }
      });
      t.globalParameters['comments'] = this.form.value.comments.comments;
      //change hard coded
      t.order.supplier.id = this.form.value.details['supplier'];
      t.order.tripId = this.additionsService.tempOrder[0].tripId;
      t.order.orderType.name = this.additionsService.tempOrder[0].orderTypeName;
      t.order.orderType.id = this.additionsService.tempOrder[0].orderTypeCode;
      this.additionsService.addOrderItems(t);
    }

    // if (this.additionsService.item.globalParameters.itemId){}
    // find if object already in a schedule
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
}
