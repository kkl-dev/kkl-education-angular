
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
  supplierListSub: Subscription;
  supplierSub: Subscription
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
    this.getSupplierList(this.orderType, this.tripId, 0);


    // if (this.editMode) {
    //   this.generalFormService.setFormValues(this.order);
    // }
    this.generalFormService.itemsList = []
    let itemIndex = this.generalFormService.details.findIndex(i => i.key === 'itemId');
    this.generalFormService.details[itemIndex].inputProps.options = this.generalFormService.itemsList;
    if (this.item != undefined && this.item != null) {
      if (this.item.globalParameters.supplierId != undefined) {
        this.supplierId = this.item.globalParameters.supplierId;
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
    let detailsArr = this.generalFormService.details;
    detailsArr = this.changeLabels(detailsArr);
    let siteQuestions = detailsArr.concat(this.generalFormService.site);
    this.generalFormService.questionGroups[index].questions = siteQuestions;
    this.formTemplate.questionsGroups = this.generalFormService.questionGroups;

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

  getSupplierList(orderTypeId, tripId, orderId) {
    this.supplierListSub = this.orderService.getSupplierList(orderTypeId, tripId, orderId).subscribe(
      response => {
        this.generalFormService.supplierList = [];
        response.forEach(element => {
          this.generalFormService.supplierList.push({ label: element.name, value: element.id.toString() });
        });
        let index = this.generalFormService.details.findIndex(i => i.key === 'supplierId');
        this.generalFormService.details[index].inputProps.options = this.generalFormService.supplierList;
      },
      error => console.log(error),       // error
      () => console.log('completed')     // complete
    )
  }

  getSupplierByOrderType(orderTypeId) {
    let centerFieldId = this.squadAssembleService.tripInfofromService.trip.centerField.id;
    this.supplierSub = this.orderService.getSupplierByOrderType(orderTypeId, centerFieldId).subscribe(
      response => {
        console.log(response);
        this.supplierId = response.id;
        this.form.controls["details"].get('supplierId').setValue(response.id.toString());
      },
      error => console.log(error),       // error
      () => console.log('completed')     // complete
    )

  }

  public onSave(): void {
    if (this.form) {
      if (this.form.status === 'VALID') {
        const dialogRef = this._dialog.open(ConfirmDialogComponent, {
          width: '500px',
          data: { message: 'יש למלא את כל שדות החובה בטופס', content: '', rightButton: 'ביטול', leftButton: 'המשך' }
        })
        return;
      }
      if (!this.additionsService.globalValidations(this.form)) { return; }
      if (!this.validationsSite()) { return; }
      this.editMode = true;
      let orderId;
      if (this.generalFormService.economyOrderList.length > 0) {
        orderId = this.generalFormService.economyOrderList[0].order.orderId
      }
      var site = {} as SiteOrder;
      site.globalParameters = {} as OrderItemCommonDetails;
      site.order = {} as Order;
      site.order.orderId = orderId;
      site.order.supplier = {} as Supplier;
      site.order.orderType = {} as OrderType;
      Object.keys(this.form.value.details).map((key, index) => {
        if (key !== 'siteCode' && key !== 'siteAddress' && key !== 'totalHours' && key !== 'isCustomerOrder') {
          if (key != 'startDate' && key != 'endDate') {
            site.globalParameters[key] = this.form.value.details[key]
          } else {
            if (key == 'startDate') {
              site.globalParameters[key] = this.generalFormService.changeDateFormat(this.form.value.details[key], 'UTC')
            }
            if (key == 'endDate') {
              site.globalParameters[key] = this.generalFormService.changeDateFormat(this.form.value.details[key], 'UTC')
            }
          }
        }
        else {

        }

      });
      site.globalParameters['startHour'] = this.setDateTimeFormat(site.globalParameters.startDate, site.globalParameters.startHour);
      site.globalParameters['endHour'] = this.setDateTimeFormat(site.globalParameters.endDate, site.globalParameters.endHour);
      site.globalParameters['comments'] = this.form.value.comments.comments;
      site.globalParameters.orderId = orderId;
      site.order.supplier.id = +this.form.value.details.supplierId;
      site.order.tripId = this.squadAssembleService.tripInfofromService.trip.id;
      site.order.orderType.name = 'אתרים';
      site.order.orderType.id = 3;
      // if(this.item.globalParameters.tempOrderIdentity!= undefined)
      //  site.globalParameters.tempOrderIdentity=this.item.globalParameters.tempOrderIdentity;
      this.generalFormService.addOrder(site, site.order.orderType.id);
      this.form.disable({ emitEvent: false });
    }
  }
  validationsSite() {
    if (this.form.value.details['peopleInTrip'] === null || this.form.value.details['peopleInTrip'] === undefined || this.form.value.details['peopleInTrip'] === "") {
      const dialogRef = this._dialog.open(ConfirmDialogComponent, {
        width: '500px',
        data: { message: 'חובה לציין את מספר המשתתפים באתר', content: '', rightButton: 'ביטול', leftButton: 'המשך' }
      })
      return false;
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
    let isPristine = this.form.pristine;
    if (isPristine == true && this.supplierId == undefined) {
      this.getSupplierByOrderType(this.orderType);
    }
    // else if(isPristine==true){
    //   this.form.controls["details"].get('supplierId').setValue(this.supplierId)
    // }
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

  ngOnDestroy() {
    if (this.supplierListSub) { this.supplierListSub.unsubscribe(); }
    if (this.supplierSub) { this.supplierSub.unsubscribe(); }
  }

}
