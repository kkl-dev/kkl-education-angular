import { StepperService } from './../../../../utilities/services/stepper.service';
import { StepModel } from 'src/app/utilities/models/step.model';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { LocationModel } from '../models/location.model';
import { ScheduleModel } from 'src/app/screens/order-tour/additions/models/schedule.model';

@Injectable({
  providedIn: 'root'
})
export class AdditionsService {

  private steps: StepModel[] = [
    {
      label: 'היסעים',
      isActive: true,
      svgUrl: 'bus',
      badgeValue: 3,
    },
    {
      label: 'אבטחה',
      isActive: false,
      svgUrl: 'shield',
    },
    {
      label: 'אתרים',
      isActive: false,
      svgUrl: 'site',
    },
    {
      label: 'כלכלה',
      isActive: false,
      svgUrl: 'dinner',
    },
    {
      label: 'אירוח',
      isActive: false,
      svgUrl: 'tent',
    },
    {
      label: 'הדרכה',
      isActive: false,
      svgUrl: 'guide',
    },
    {
      label: 'הפעלה מוסיקלית',
      isActive: false,
      svgUrl: 'music',
    },
  ];

  private locationsSubject = new BehaviorSubject<LocationModel[]>([])
  public locations$: Observable<LocationModel[]> = this.locationsSubject.asObservable();

  private scheduleSubject = new BehaviorSubject<ScheduleModel[]>([])
  public schedule$: Observable<ScheduleModel[]> = this.scheduleSubject.asObservable();

  constructor(
    private stepperService: StepperService
  ) { }

  public getSteps(): StepModel[] {
    return [... this.steps]
  }

  public updateStepStatus(step: StepModel, key: string) {
    this.steps = this.stepperService.updateStepStatus(this.steps, step, key)
  }

  public emitSchedule(schedule: ScheduleModel[]) {
    this.scheduleSubject.next(schedule)
  }

  public emitLocations(locations: LocationModel[]) {
    this.locationsSubject.next(locations)
  }

}
