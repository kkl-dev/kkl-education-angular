import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { ActivitiesCardInterface } from 'src/app/components/activities-card/activities-card.component';
import { FacilitiesService } from 'src/app/services/facilities.service';
import { DAYS } from 'src/mock_data/facilities';

@Component({
  selector: 'app-save-activity',
  templateUrl: './save-activity.component.html',
  styleUrls: ['./save-activity.component.scss']
})
export class SaveActivityComponent implements OnInit {
  constructor(private facilitiesServices: FacilitiesService) { }

  public form: FormGroup;
  public orderingCustomer: boolean = false;
  public showSleepAreas: boolean = false;
  public addedAdditions: string[] = [];
  @Input() public activity: ActivitiesCardInterface;
  @Input() type:string;
  @Input() additonsType: string[] = ['הסעה', 'כלכלה', 'הדרכה', 'אבטחה', 'הפעלה מוסיקלית'];
  @Input() days: {
    day: string;
    options: {
      svgUrl: string;
      sleepingAreas: number;
      avialableSpaces: number;
      type: string;
      singleUnit: string;
    }
  }[] = DAYS;
  public selectedDate: number = 0;
  @Output() emitFormValues: EventEmitter<any> = new EventEmitter();

  ngOnInit(): void {
    this.form = new FormGroup({
      'title': new FormControl(this.activity.title),
      'start': new FormControl('08:00'),
      'end': new FormControl('08:00'),
      'backgroundColor': new FormControl('#ECF8EE'),
      'date': new FormControl(''),
      'className': new FormControl('border-activities'),
      'invitingCustomer': new FormControl(),
      'additions': new FormControl()
    });
  }

  onSubmit() {
    if(this.type){
      this.form.controls['invitingCustomer'].setValue(this.orderingCustomer);
    }
    this.form.controls['additions'].setValue(this.addedAdditions);
    this.form.controls['start'].setValue(this.arrangeTime('start'));
    this.form.controls['end'].setValue(this.arrangeTime('end'));
    this.emitFormValues.emit(this.form.value);
    this.facilitiesServices.closeModal('close');
  }
  orderingCustomerHandler() {
    this.orderingCustomer = !this.orderingCustomer;
  }

  updateAddedAdditions(value: string) {
    const index = this.addedAdditions.findIndex(addition => addition === value);
    if (index >= 0) {
      this.addedAdditions.splice(index, 1);
    } else {
      this.addedAdditions.push(value);
    }
  }
  // date && time functions // 
  public arrangeTime(arg: string): any {
    const [day, month, year] = this.days[this.selectedDate].day.split(".");
    const [hours, minutes] = this.form.value[arg].split(':');
    return `${year}-${month}-${day}T${hours}:${minutes}`;

  }
  public getDay(event: any): void {
    this.selectedDate = event;
  }

}
