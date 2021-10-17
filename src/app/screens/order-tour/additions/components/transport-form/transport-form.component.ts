import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormTemplate } from 'src/app/components/form/logic/form.service';
import { OrderItemCommonDetails, TransportOrder } from 'src/app/open-api';
import { LocationModel } from 'src/app/screens/order-tour/additions/models/location.model';
import { TableCellModel } from 'src/app/utilities/models/TableCell';
//import { TransportModel } from '../../models/transport-model';
import { AdditionsService } from '../../services/additions.service';
import { TransportService } from '../../services/transport.service';

@Component({
  selector: 'app-transport-form',
  templateUrl: './transport-form.component.html',
  styleUrls: ['./transport-form.component.scss'],
})
export class TransportFormComponent implements OnInit {
  // @Input() public location: LocationModel;
  // @Input() public transport: TransportModel;
  @Input() public transport: TransportOrder;
  @Input() public editMode: boolean;
  public form: FormGroup;
  public columns: TableCellModel[];

  public formTemplate: FormTemplate = {
    hasGroups: true,
    questionsGroups: [],
  };

  constructor(private transportService: TransportService, private additionsService: AdditionsService) { }

  ngOnInit(): void {
    if (this.editMode) {
      this.transportService.setFormValues(this.transport);
    }
    this.formTemplate.questionsGroups = this.transportService.questionGroups;
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
  }
}
