import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  FormTemplate,
  QuestionGroup,
} from 'src/app/components/form/logic/form.service';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
import { LocationModel } from 'src/app/screens/order-tour/additions/models/location.model';
import { TableCellModel } from 'src/app/utilities/models/TableCell';
import { TransportModel } from '../../models/transport-model';
import { TourService } from '../../services/tour.service';
import { TransportService } from '../../services/transport.service';

@Component({
  selector: 'app-transport-form',
  templateUrl: './transport-form.component.html',
  styleUrls: ['./transport-form.component.scss'],
})
export class TransportFormComponent implements OnInit, AfterViewInit {
  @Input() public location: LocationModel;
  @Input() public transport: TransportModel;
  @Input() public editMode: boolean;

  public form: FormGroup;
  public columns: TableCellModel[];

  public formTemplate: FormTemplate = {
    hasGroups: true,
    questionsGroups: [],
  };

  constructor(private transportService: TransportService) {}

  ngOnInit(): void {
    if (this.editMode) {
      this.transportService.setFormValues(this.transport);
    }

    this.formTemplate.questionsGroups = this.transportService.questionGroups;
  }

  ngAfterViewInit(): void {
    if (this.editMode && this.form) {
      // this.form.disable();
    }
  }

  public onSave(): void {
    if (this.form) {
      this.editMode = true;
      this.form.disable();
    }

    this.transport = TransportModel.create(this.form.value);

    console.log(this.transport)

    // find if object already in a schedule
  }

  public onEdit() {
    this.editMode = false;
    this.form.enable();
  }

  public onValueChange(event) {
    this.form = event;
  }
}
