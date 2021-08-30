import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  FormTemplate,
} from 'src/app/components/form/logic/form.service';
import { LocationModel } from 'src/app/screens/order-tour/additions/models/location.model';
import { TableCellModel } from 'src/app/utilities/models/TableCell';
import { TransportModel } from '../../models/transport-model';
import { TransportService } from '../../services/transport.service';


@Component({
  selector: 'app-transport-form',
  templateUrl: './transport-form.component.html',
  styleUrls: ['./transport-form.component.scss']
})
export class TransportFormComponent implements OnInit {

  @Input() location: LocationModel;

  public form: FormGroup;
  public editMode: boolean = false;

  public columns: TableCellModel[];

  public formTemplate: FormTemplate = {
    hasGroups: true,
    questionsGroups: []
  };

  constructor(
    private transportService: TransportService,
    private transport : TransportModel
    ) {}

  ngOnInit(): void {
    this.formTemplate.questionsGroups = this.transportService.questionGroups
  }

  public onSave() {
    if (this.form) {
      this.editMode = !this.editMode;
      this.form.disable();
    }
    // find if object already in a schedule
  }

  public onEdit() {
    this.editMode = !this.editMode;
    this.form.enable();
  }

  public onValueChange(event) {
    if (!this.editMode) {
      this.form = event;
    }
  }
}
