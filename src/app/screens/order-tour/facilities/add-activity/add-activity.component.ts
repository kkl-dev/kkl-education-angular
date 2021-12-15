import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { FacilitiesService } from 'src/app/services/facilities.service';
import { TripService } from 'src/app/services/trip.service';
import { DAYS } from 'src/mock_data/facilities';
import { ActivitiesService } from 'src/app/open-api';
import { TripActivity } from 'src/app/open-api';
import { SquadAssembleService } from '../../squad-assemble/services/squad-assemble.service';

@Component({
  selector: 'app-add-activity',
  templateUrl: './add-activity.component.html',
  styleUrls: ['./add-activity.component.scss']
})
export class AddActivityComponent implements OnInit {
  // @Input() days: any[] = DAYS;
  @Input() days: any[] = this.tripService.facilitiesArray;
  @Output() emitFormValues: EventEmitter<any> = new EventEmitter();

  public form: FormGroup;
  public showSleepAreas: boolean = false;
  public selectedDay: number = 0;

  constructor(private facilitiesServices: FacilitiesService, private tripService: TripService, private activitiyService: ActivitiesService, private squadAssembleService: SquadAssembleService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'title': new FormControl(''),
      'selectedDay': new FormControl(this.selectedDay),
      'start': new FormControl("08:00"),
      'end': new FormControl("09:00"),
      'backgroundColor': new FormControl('#f0f9f1'),
      'date': new FormControl(''),
      'className': new FormControl('border-activities'),
      'type': new FormControl('activity'),
      'itemId': new FormControl(0)

    });
  }

  onSubmit(): void {
    this.form.controls['selectedDay'].setValue(this.selectedDay);
    this.form.controls['start'].setValue(this.arrangeTime('start'));
    this.form.controls['end'].setValue(this.arrangeTime('end'));

    this.CreateActivity();

    // this.emitFormValues.emit(this.form.value);    
    // this.facilitiesServices.closeModal('close');
  }

  CreateActivity() {
    let newActivity = {} as TripActivity;
    newActivity.activityId = this.form.value.itemId;
    newActivity.activityName = this.form.value.title;
    newActivity.date = this.form.value.start;
    newActivity.description = this.form.value.title;
    newActivity.fromHour = this.form.value.start;
    newActivity.tillHour = this.form.value.end;
    newActivity.tripId = this.squadAssembleService.tripInfofromService.trip.id;

    this.activitiyService.createTripActivity(newActivity).subscribe((res: any) => {
      this.form.value.tripActivityIdentity = res.activityId; //.tripActivityIdentity;
      console.log(res);

      this.emitFormValues.emit(this.form.value);
      this.facilitiesServices.closeModal('close');
    }, (error) => {
      console.log(error);
      this.facilitiesServices.closeModal('close');
    }
    );
  }

  getDay(event: any): void {
    this.selectedDay = event;
  }

  startTimeChanged(event: string) {
    this.form.controls['start'].setValue(event);
  }

  endTimeChanged(event: string) {
    this.form.controls['end'].setValue(event);
  }

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
}
