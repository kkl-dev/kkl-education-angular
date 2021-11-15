import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { ActivitiesCardInterface } from 'src/app/components/activities-card/activities-card.component';
import { FacilitiesService } from 'src/app/services/facilities.service';
import { TripService } from 'src/app/services/trip.service';
import { DAYS } from 'src/mock_data/facilities';

@Component({
  selector: 'app-save-activity',
  templateUrl: './save-activity.component.html',
  styleUrls: ['./save-activity.component.scss']
})
export class SaveActivityComponent implements OnInit {

  constructor(private facilitiesServices: FacilitiesService, private tripService: TripService) { }

  selectedActivity$: Observable<ActivitiesCardInterface>;
  subscribeToActivity: Subscription;
  updateForm: boolean = false;
  form: FormGroup;
  orderingCustomer: boolean = false;
  showSleepAreas: boolean = false;
  selectedDay: number = 0;
  defaultImage: string = 'defaultFacility.svg';

  @Input() type: string;
  @Input() public additonsType: any[] = [
    { name: 'הסעה', completed: false, svg: 'bus' },
    // { name: 'אבטחה', completed: false , svg:'shield' },
    { name: 'הדרכה', completed: false, svg: 'man-with-bag' },
    { name: 'כלכלה', completed: false, svg: 'dinner' },
    // { name: 'הפעלה מוסיקלית', completed: false , svg:'music' },
  ];
  @Input() public additonsType2: any[] = [
    { name: 'הסעה', completed: false, svg: 'bus' }
  ];
  @Input() days: any[] = this.tripService.facilitiesArray;
  @Output() emitFormValues: EventEmitter<any> = new EventEmitter();

  ngOnInit(): void {
    this.selectedActivity$ = this.facilitiesServices.getSelectedActivity();
    this.subscribeToActivity = this.selectedActivity$.subscribe(data => {
      this.createForm(data);
    });
  }

  ngOnDestroy(): void {
    this.subscribeToActivity.unsubscribe();
  }

  startTimeChanged(event: string): void {
    this.form.controls['start'].setValue(event);
  }

  endTimeChanged(event: string): void {
    this.form.controls['end'].setValue(event);
  }

  deleteItem(event): void {
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
      this.form.controls['additions'].setValue(this.additonsType.filter(item => item.completed));
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
  arrangeTime(arg: string): any {
    // yak changed for compatible with date (2021-11-07T00:00:00) and not (21.10.2021)
    //  const [day, month, year] = this.days[this.selectedDay].day.split(".");
    let day = this.days[this.selectedDay].date.split("T");
    let [hours, minutes] = this.form.value[arg].split(':');
    if (hours.length == 1) {
      hours = `0${hours}`;
    }
    return `${day[0]}T${hours}:${minutes}`;
    //return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  getDay(event: any): void {
    this.selectedDay = event;
  }

  separateTimeFromDate(args: string): string {
    const [date, time] = args.split('T');
    return time;
  }
  
  createForm(data): void {
    if (!data.start) {
      this.form = new FormGroup({
        'title': new FormControl(data.name),
        'selectedDay': new FormControl(this.selectedDay),
        // 'start': new FormControl('08:00'),
        // 'end': new FormControl('09:00'),
        'start': new FormControl('08:00'),
        'end': new FormControl('09:00'),
        'backgroundColor': new FormControl('#f0f9f1'),
        'date': new FormControl(''),
        'className': new FormControl('border-activities'),
        'type': new FormControl('activity'),
        'invitingCustomer': new FormControl(false),
        'additions': new FormControl(),
        'haveAdditions': new FormControl(true),
        'itemId': new FormControl(data.itemId || null),
        'svgUrl': new FormControl('assets/images/' + data.iconPath || 'assets/images/' + data.svgUrl),
        //'svgUrl': new FormControl('assets/images/' + data.iconPath) || null,
        'img': new FormControl(data.sitePicture),
        'activityId': new FormControl(data.activityId || null),
        'tripActivityIdentity': new FormControl(data.tripActivityIdentity || null),
        'tripId': new FormControl(data.tripId || null),
        'description': new FormControl(data.description || null)
      });
      //console.log('this form => ', this.form);
    } else {
      this.updateForm = true;
      if (data.start.includes("T")) {
        data.start = this.separateTimeFromDate(data.start);
      }
      if (data.end.includes("T")) {
        data.end = this.separateTimeFromDate(data.end);
      }
      // data.start = this.separateTimeFromDate(data.start);
      // data.end = this.separateTimeFromDate(data.end);
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
