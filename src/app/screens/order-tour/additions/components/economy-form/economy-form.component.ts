import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormTemplate } from 'src/app/components/form/logic/form.service';
import { TableCellModel } from 'src/app/utilities/models/TableCell';
import { AdditionsService } from '../../services/additions.service';
import { TransportService } from '../../services/transport.service';
import { EconomyOrder, Order, OrderItemCommonDetails, OrderService, OrderType, Supplier, TransportOrder, UserService } from 'src/app/open-api';
import { SquadAssembleService } from '../../../squad-assemble/services/squad-assemble.service';
import { GeneralFormService } from '../../services/general-form.service';

@Component({
  selector: 'app-economy-form',
  templateUrl: './economy-form.component.html',
  styleUrls: ['./economy-form.component.scss']
})
export class EconomyFormComponent implements OnInit {

  constructor(private transportService: TransportService, private generalFormService: GeneralFormService, private squadAssembleService: SquadAssembleService, private additionsService: AdditionsService, private orderService: OrderService) { }
  @Input() public order: any;
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
    this.orderService.getSupplierList(4, this.tripId, 0);
     
    // if (this.editMode) {
    //   this.generalFormService.setFormValues(this.order);
    // }
    if (this.order!= undefined && this.order!= null) {
      this.generalFormService.setFormValues(this.order);
    }

    let index = this.generalFormService.questionGroups.findIndex(el => el.key === "details");
    // this.generalFormService.questionGroups[index].questions=this.generalFormService.details;
    // let economyQuestions = this.generalFormService.questionGroups[index].questions.concat(this.generalFormService.economy);
    // this.generalFormService.questionGroups[index].questions = economyQuestions;
     //option2
     let detailsArr= this.generalFormService.details;
     detailsArr= this.changeLabels(detailsArr);
      let economyQuestions = detailsArr.concat(this.generalFormService.economy);
     this.generalFormService.questionGroups[index].questions = economyQuestions;
    this.formTemplate.questionsGroups=this.generalFormService.questionGroups;

    
  }

 
    changeLabels(tempArr){
      console.log('tempArr is :',tempArr);
     
       let startDateIndex = tempArr.findIndex(el=> el.key === 'startDate');
       tempArr[startDateIndex].label= 'מתאריך';
       let endDateIndex = tempArr.findIndex(el=> el.key === 'endDate');
       tempArr[endDateIndex].label= 'עד תאריך';
       let startHourIndex = tempArr.findIndex(el=> el.key === 'startHour');
       tempArr[startHourIndex].label= 'שעת הגשה';
       let endHourIndex = tempArr.findIndex(el=> el.key === 'endHour');
       tempArr[endHourIndex].label= 'שעת סיום';
       return tempArr;
    }

  public onSave(): void {
    if (this.form) {
      this.editMode = true;
      this.form.disable();
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
        else if (key !== "supplier") {
          t[key] = this.form.value.details[key]
        }
      });
      //t.globalParameters['endHour'] = '2021-11-21T14:00:00';
     // t.globalParameters['startHour'] = '2021-11-21T15:00:00';
      t.globalParameters['comments'] = this.form.value.comments.comments;
      t.globalParameters.orderId=orderId;
      t.order.supplier.id = +this.form.value.details.supplier;
      t.order.tripId = this.squadAssembleService.tripInfofromService.trip.id;
      t.order.orderType.name = 'כלכלה';
      t.order.orderType.id = 4;
      this.generalFormService.addOrder(t,'כלכלה');
    }
  }

 


  public onEdit() {
    this.editMode = false;
    this.form.enable();
  }

  public onValueChange(event) {
    this.form = event;
    // console.log(this.form)
  }
}
