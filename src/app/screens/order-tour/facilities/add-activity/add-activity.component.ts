import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { FacilitiesService } from 'src/app/services/facilities.service';
import { TripService } from 'src/app/services/trip.service';
import { DAYS } from 'src/mock_data/facilities';

@Component({
  selector: 'app-add-activity',
  templateUrl: './add-activity.component.html',
  styleUrls: ['./add-activity.component.scss']
})
export class AddActivityComponent implements OnInit {
  // @Input() days: any[] = DAYS;
  @Input() days: any[] = this.tripService.facilitiesArray;

  public form: FormGroup;
  public showSleepAreas: boolean = false;
  public selectedDay: number = 0;
  @Output() emitFormValues: EventEmitter<any> = new EventEmitter();

  constructor(private facilitiesServices: FacilitiesService, private tripService: TripService) { }

  public onSubmit(): void {
    this.form.controls['selectedDay'].setValue(this.selectedDay);
    this.form.controls['start'].setValue(this.arrangeTime('start'));
    this.form.controls['end'].setValue(this.arrangeTime('end'));
    this.emitFormValues.emit(this.form.value);
    this.facilitiesServices.closeModal('close');
  }
  public ngOnInit(): void {
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
  public getDay(event: any): void {
    this.selectedDay = event;
  }
  public startTimeChanged(event: string) {
    this.form.controls['start'].setValue(event);
  }
  public endTimeChanged(event: string) {
    this.form.controls['end'].setValue(event);
  }

  public arrangeTime(arg: string): any {
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
