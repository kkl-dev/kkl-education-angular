import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import {
  FormTemplate,
  QuestionGroup,
} from 'src/app/components/form/logic/form.service';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
import { QuestionCalendar } from 'src/app/components/form/logic/question-calendar';
import { QuestionSelect } from 'src/app/components/form/logic/question-select';
import { QuestionTextarea } from 'src/app/components/form/logic/question-textarea';
import { QuestionTextbox } from 'src/app/components/form/logic/question-textbox';
import { LocationModel } from 'src/app/screens/order-tour/additions/models/location.model';
import { TableCellModel } from 'src/app/utilities/models/TableCell';
import { TransportModel } from '../../models/transport-model';
import { TransportService } from '../../services/transport.service';

@Component({
  selector: 'app-transport',
  templateUrl: './transport.component.html',
  styleUrls: ['./transport.component.scss'],
})
export class TransportComponent implements OnInit {
  
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

    console.log(this.transport)

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
