import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormTemplate } from 'src/app/components/form/logic/form.service';
import { TableCellModel } from 'src/app/utilities/models/TableCell';
import { AdditionsService } from '../../services/additions.service';
import { GuidanceOrder, Order, OrderItemCommonDetails, OrderService, OrderType, Supplier, TransportOrder, UserService } from 'src/app/open-api';
import { SquadAssembleService } from '../../../squad-assemble/services/squad-assemble.service';
import { GeneralFormService } from '../../services/general-form.service';
import { ConfirmDialogComponent } from 'src/app/utilities/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-gudiance-form',
  templateUrl: './gudiance-form.component.html',
  styleUrls: ['./gudiance-form.component.scss']
})
export class GudianceFormComponent implements OnInit {

  constructor(private _dialog: MatDialog, private generalFormService: GeneralFormService, private squadAssembleService: SquadAssembleService, private additionsService: AdditionsService, private orderService: OrderService) { }
  @Input() public item: any;
  @Input() public editMode: boolean;
  tripId: number;

  public form: FormGroup;
  public columns: TableCellModel[];

  public formTemplate: FormTemplate = {
    hasGroups: true,
    questionsGroups: [],
  };

  ngOnInit(): void {
    this.tripId = this.squadAssembleService.tripInfofromService.trip.id;
    this.generalFormService.clearFormFields();
    this.generalFormService.setDatesValues();
    this.getSupplierList(6, this.tripId, 0);

    // if (this.editMode) {
    //   this.generalFormService.setFormValues(this.order);
    // }
    this.generalFormService.itemsList = []
    let itemIndex = this.generalFormService.details.findIndex(i => i.key === 'itemId');
    this.generalFormService.details[itemIndex].inputProps.options = this.generalFormService.itemsList;
    if (this.item != undefined && this.item != null) {
      if (this.item.globalParameters.supplierId != undefined) {
        this.generalFormService.getOrderItemBySupplierId(this.item.globalParameters.supplierId);
      }
      this.generalFormService.setFormValues(this.item);
    }
    else {
      let peopleInTripIndex = this.generalFormService.details.findIndex(i => i.key === 'peopleInTrip');
      this.generalFormService.details[peopleInTripIndex].value = this.squadAssembleService.peopleInTrip;
    }
    this.setformTemplate();

  }

  setformTemplate() {
    let index = this.generalFormService.questionGroups.findIndex(el => el.key === "details");
    this.generalFormService.questionGroups[index].questions = this.generalFormService.details;
    //let detailsArr = this.generalFormService.details;
    let detailsArr = this.generalFormService.questionGroups[index].questions;
    detailsArr = this.changeLabels(detailsArr);
    let guideQuestions = detailsArr.concat(this.generalFormService.guidance);
    this.generalFormService.questionGroups[index].questions = guideQuestions;
    this.formTemplate.questionsGroups = this.generalFormService.questionGroups;

  }
  changeLabels(tempArr) {
    console.log('tempArr is :', tempArr);
    let startDateIndex = tempArr.findIndex(el => el.key === 'startDate');
    tempArr[startDateIndex].label = 'מתאריך';
    let endDateIndex = tempArr.findIndex(el => el.key === 'endDate');
    tempArr[endDateIndex].label = 'עד תאריך';
    let startHourIndex = tempArr.findIndex(el => el.key === 'startHour');
    tempArr[startHourIndex].label = 'שעת התייצבות';
    let endHourIndex = tempArr.findIndex(el => el.key === 'endHour');
    tempArr[endHourIndex].label = 'שעת פיזור';
    let locationIndex = tempArr.findIndex(el => el.key === 'location');
    tempArr[locationIndex].label = 'מקום התייצבות';
    return tempArr;
  }

  getSupplierList(orderTypeId, tripId, orderId) {
    this.orderService.getSupplierList(orderTypeId, tripId, orderId).subscribe(
      response => {
        console.log(response);
        this.generalFormService.supplierList = [];
        response.forEach(element => {
          this.generalFormService.supplierList.push({ label: element.name, value: element.id.toString() });
        });
        let index = this.generalFormService.details.findIndex(i => i.key === 'supplierId');
        this.generalFormService.details[index].inputProps.options = this.generalFormService.supplierList;
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
        if (this.form)
          this.form.controls["details"].get('supplier').setValue(response.id.toString());
      },
      error => console.log(error),       // error
      () => console.log('completed')     // complete
    )

  }

  public onSave(): void {
    if (this.form) {
      if (!this.additionsService.globalValidations(this.form)) { return; }
      if (!this.validationsGudiance()) { return; }
      this.editMode = true;
      let orderId;
      if (this.generalFormService.economyOrderList.length > 0) {
        orderId = this.generalFormService.economyOrderList[0].order.orderId
      }
      let guide = {} as GuidanceOrder;
      guide.globalParameters = {} as OrderItemCommonDetails;
      guide.order = {} as Order;
      guide.order.orderId = orderId;
      guide.order.supplier = {} as Supplier;
      guide.order.orderType = {} as OrderType;
      Object.keys(this.form.value.details).map((key, index) => {
        if (key !== 'scatterLocation' && key !== 'guideName' && key !== 'languageGuidance' && key !== 'guideInstructions') {
          if (key != 'startDate' && key != 'endDate') {
            guide.globalParameters[key] = this.form.value.details[key]
          } else {
            if (key == 'startDate') {
              guide.globalParameters[key] = this.generalFormService.changeDateFormat(this.form.value.details[key], 'UTC')
            }
            if (key == 'endDate') {
              guide.globalParameters[key] = this.generalFormService.changeDateFormat(this.form.value.details[key], 'UTC')
            }
          }
        }
        else {

        }

      });
      guide.globalParameters['startHour'] = this.setDateTimeFormat(guide.globalParameters.startDate, guide.globalParameters.startHour);
      guide.globalParameters['endHour'] = this.setDateTimeFormat(guide.globalParameters.endDate, guide.globalParameters.endHour);
      guide.globalParameters['comments'] = this.form.value.comments.comments;
      guide.globalParameters.orderId = orderId;
      guide.order.supplier.id = +this.form.value.details.supplierId;
      guide.order.tripId = this.squadAssembleService.tripInfofromService.trip.id;
      guide.order.orderType.name = 'הדרכה';
      guide.order.orderType.id = 6;
      if (this.item.globalParameters.tempOrderIdentity != undefined)
        guide.globalParameters.tempOrderIdentity = this.item.globalParameters.tempOrderIdentity;
      this.generalFormService.addOrder(guide, guide.order.orderType.id);
      this.form.disable({ emitEvent: false });
    }
  }
  validationsGudiance() {
    if (this.generalFormService.originalItemList.length > 0) {
      var item = this.generalFormService.originalItemList.find(el => el.id.toString() === this.form.value.details['itemId']);
    }
    if (item.credit === 0) {
      if (this.form.value.details['startHour'] === null || this.form.value.details['startHour'] === "" || this.form.value.details['startHour'] === undefined) {
        const dialogRef = this._dialog.open(ConfirmDialogComponent, {
          width: '500px',
          data: { message: 'בהזמנת הדרכה - חובה למלא שעת התייצבות', content: '', rightButton: 'ביטול', leftButton: 'המשך' }
        })
        return false;
      }
      if (this.form.value.details['location'] === null || this.form.value.details['location'] === "" || this.form.value.details['location'] === undefined) {
        const dialogRef = this._dialog.open(ConfirmDialogComponent, {
          width: '500px',
          data: { message: 'בהזמנת הדרכה - חובה למלא מקום התייצבות', content: '', rightButton: 'ביטול', leftButton: 'המשך' }
        })
        return false;
      }
    }
    return true;
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
