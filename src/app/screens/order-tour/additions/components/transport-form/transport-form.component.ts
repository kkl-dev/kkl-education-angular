import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormTemplate } from 'src/app/components/form/logic/form.service';
import { LocationModel } from 'src/app/screens/order-tour/additions/models/location.model';
import { TableCellModel } from 'src/app/utilities/models/TableCell';
import { TransportModel } from '../../models/transport.model';
import { TransportService } from '../../services/transport.service';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-transport-form',
  templateUrl: './transport-form.component.html',
  styleUrls: ['./transport-form.component.scss'],
})
export class TransportFormComponent implements OnInit {
  @Input() public location: LocationModel;
  @Input() public transport: TransportModel;
  @Input() public editMode: boolean;

  //time inputs
  public pickUpHour: string;
  public dropDownHour: string;

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
    console.log(this.form);
  }

  public onSave(): void {
    if (this.form) {
      this.editMode = true;
      this.form.disable();
    }

    console.log(this.pickUpHour);
    console.log(this.dropDownHour);
    
    console.log(this.form);

    // find if object already in a schedule
  }

  public onEdit() {
    this.editMode = false;
    this.form.enable();
  }

  public onRegister(form: FormGroup) {
    this.form = form;
    this.registerToSupplier();
  }

  private registerToSupplier() {
    this.form.controls['details']
      .get('supplier')
      .valueChanges.pipe(map((value) => console.log(value)));
  }

  public startTimeChanged(event: string) {
    console.log(this.form);
    this.dropDownHour=event
    console.log(this.form.controls[0]);
    
    
    // this.form.controls['pickUpHour'].setValue(event);
  } 
  
  public endTimeChanged(event: string) {
    this.pickUpHour=event
    console.log(this.form.controls.locations);
    // this.form.controls['dropDownHour'].patchValue(event);
  }
}
