import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormTemplate } from 'src/app/components/form/logic/form.service';
import { TableCellModel } from 'src/app/utilities/models/TableCell';
import { AdditionsService } from '../../services/additions.service';
import { TransportService } from '../../services/transport.service';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss']
})
export class OrderFormComponent implements OnInit {

  constructor(private transportService: TransportService, private additionsService: AdditionsService) { }
  @Input() public order: any;
  @Input() public editMode: boolean;
  public form: FormGroup;
  public columns: TableCellModel[];

  public formTemplate: FormTemplate = {
    hasGroups: true,
    questionsGroups: [],
  };

  ngOnInit(): void {
    if (this.editMode) {
      this.transportService.setFormValues(this.order);
    }
    this.formTemplate.questionsGroups = this.transportService.questionGroups;
  }
  // public onSave(): void {
  //   if (this.form) {
  //     this.editMode = true;
  //     this.form.disable();
  //     var t = {} as TransportOrder;
  //     t.globalParameters = {} as OrderItemCommonDetails;
  //     Object.keys(this.form.value.details).map((key, index) => {
  //       if (key !== 'pickUpAddress' && key !== 'pickUpLocation') {
  //         t.globalParameters[key] = this.form.value.details[key]
  //       }
  //       else {
  //         t[key] = this.form.value.details[key]
  //       }
  //     });
  //     t.globalParameters['comments'] = this.form.value.comments.comments;
  //     //change hard coded
  //     t.order.tripId = this.additionsService.tempOrder[0].tripId;
  //     t.order.orderType.name = this.additionsService.tempOrder[0].orderTypeName;
  //     t.order.orderType.id = this.additionsService.tempOrder[0].orderTypeCode;
  //     this.additionsService.addOrderItems(t);
  //   }
  // }

  public onEdit() {
    this.editMode = false;
    this.form.enable();
  }

  public onValueChange(event) {
    this.form = event;
    console.log(this.form)
  }
}
