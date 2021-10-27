import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
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

  public selectedActivity$: Observable<ActivitiesCardInterface>;
  public subscribeToActivity: Subscription;
  public updateForm: boolean = false;
  public form: FormGroup;
  public orderingCustomer: boolean = false;
  public showSleepAreas: boolean = false;
  public selectedDay: number = 0;

  @Input() type: string;
  @Input() public additonsType: any[] = [
    { name: 'הסעה', completed: false },
    { name: 'אבטחה', completed: false },
    { name: 'הדרכה', completed: false },
    { name: 'כלכלה', completed: false },
    { name: 'הפעלה מוסיקלית', completed: false },
  ];
  @Input() days: any[] = DAYS;
  @Output() emitFormValues: EventEmitter<any> = new EventEmitter();

  ngOnInit(): void {
    this.selectedActivity$ = this.facilitiesServices.getSelectedActivity();
    this.subscribeToActivity = this.selectedActivity$.subscribe(data => this.createForm(data));
  }
  public ngOnDestroy(): void {
    this.subscribeToActivity.unsubscribe();
  }
  public startTimeChanged(event: string): void {
    this.form.controls['start'].setValue(event);
  }
  public endTimeChanged(event: string): void {
    this.form.controls['end'].setValue(event);
  }
  public deleteItem(event): void {
    event.preventDefault();
    const id = this.form.controls['id'].value;
    this.facilitiesServices.deleteItemFromArray(id);
    this.facilitiesServices.closeModal('close');
  }
  onSubmit() {
    if (this.type) {
      this.form.controls['invitingCustomer'].setValue(this.orderingCustomer);
    }
    if (this.form.controls['additions']) {
      this.form.controls['additions'].setValue(this.additonsType);
    }
    this.form.controls['selectedDay'].setValue(this.selectedDay);
    this.form.controls['start'].setValue(this.arrangeTime('start'));
    this.form.controls['end'].setValue(this.arrangeTime('end'));
    if (this.updateForm) {
      this.facilitiesServices.updateItemInArrayOfCalendar(this.form.value);
      this.facilitiesServices.closeModal('close');
      return;
    }
    this.emitFormValues.emit(this.form.value);
    this.facilitiesServices.closeModal('close');
  }
  orderingCustomerHandler() {
    this.orderingCustomer = !this.orderingCustomer;
  }

  // date && time functions // 
  public arrangeTime(arg: string): any {
    const [day, month, year] = this.days[this.selectedDay].day.split(".");
    let [hours, minutes] = this.form.value[arg].split(':');
    if (hours.length == 1) {
      hours = `0${hours}`;
    }
    return `${year}-${month}-${day}T${hours}:${minutes}`;

  }
  public getDay(event: any): void {
    this.selectedDay = event;
  }
  public separateTimeFromDate(args: string): string {
    const [date, time] = args.split('T');
    return time;
  }
  public createForm(data): void {
    if (!data.start) {
      this.form = new FormGroup({
        'title': new FormControl(data.title),
        'selectedDay': new FormControl(this.selectedDay),
        'start': new FormControl('08:00'),
        'end': new FormControl('09:00'),
        'backgroundColor': new FormControl('#F0F6FE'),
        'borderColor' : new FormControl('#37C56B'),
        'date': new FormControl(''),
        'className': new FormControl('border-activities'),
        'type': new FormControl('activity'),
        'invitingCustomer': new FormControl(false),
        'additions': new FormControl(),
        'haveAdditions': new FormControl(true),
        'svgUrl': new FormControl(data.svgUrl),
        'img': new FormControl(data.img)
      });
    } else {
      this.updateForm = true;
      data.start = this.separateTimeFromDate(data.start);
      data.end = this.separateTimeFromDate(data.end);
      this.selectedDay = data.selectedDay;
      if (data.invitingCustomer) {
        this.orderingCustomer = data.invitingCustomer;
      }
      if (data.additions && data.additions.length !== 0) {
        this.additonsType = data.additions;
      }
      this.form = new FormGroup({});
      for (const property in data) {
        this.form.addControl(property, new FormControl(data[property]));
      }
    }
  }

}
