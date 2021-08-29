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
    // questionsGroups: this.questionGroups,
  };

  constructor(private TransportService: TransportService) {}

  ngOnInit(): void {
    this.formTemplate.questionsGroups = this.TransportService.questionGroups
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
