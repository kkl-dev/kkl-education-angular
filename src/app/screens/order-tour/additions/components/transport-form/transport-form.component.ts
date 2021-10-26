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
    private orderService: OrderService) { }

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
