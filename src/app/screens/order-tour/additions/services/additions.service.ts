import { StepperService } from './../../../../utilities/services/stepper.service';
import { StepModel } from 'src/app/utilities/models/step.model';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { LocationModel } from '../models/location.model';
import { ScheduleModel } from 'src/app/screens/order-tour/additions/models/schedule.model';
import { OrderEvent, OrderType, TempOrder, TransportOrder } from 'src/app/open-api';
import { TripService } from 'src/app/services/trip.service';

@Injectable({
  providedIn: 'root'
})
export class AdditionsService {
  item = {} as TransportOrder;
  orderTypes: OrderType[];
  tempOrder: TempOrder[];
  private steps: StepModel[] = [
    // {
    //   label: 'היסעים',
    //   isActive: true,
    //   svgUrl: 'bus',
    //   badgeValue: 3,
    // },
    // {
    //   label: 'אבטחה',
    //   isActive: false,
    //   svgUrl: 'shield',
    // },
    // {
    //   label: 'אתרים',
    //   isActive: false,
    //   svgUrl: 'site',
    // },
    // {
    //   label: 'כלכלה',
    //   isActive: false,
    //   svgUrl: 'dinner',
    // },
    // {
    //   label: 'אירוח',
    //   isActive: false,
    //   svgUrl: 'tent',
    // },
    // {
    //   label: 'הדרכה',
    //   isActive: false,
    //   svgUrl: 'guide',
    // },
    // {
    //   label: 'הפעלה מוסיקלית',
    //   isActive: false,
    //   svgUrl: 'music',
    // },
  ];

  private locationsSubject = new BehaviorSubject<LocationModel[]>([])
  public locations$: Observable<LocationModel[]> = this.locationsSubject.asObservable();

  private scheduleSubject = new BehaviorSubject<ScheduleModel[]>([])
  public schedule$: Observable<ScheduleModel[]> = this.scheduleSubject.asObservable();

  private itemSubject = new BehaviorSubject<TransportOrder[]>([])
  public item$: Observable<TransportOrder[]> = this.itemSubject.asObservable();

  public emitItem(item: TransportOrder[]) {
    this.itemSubject.next(item)
  }
  constructor(
    private stepperService: StepperService, tripService: TripService
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


  public orderList: OrderEvent[] = []
  //public orderToServer = {} as OrderModel
  addOrderItems(item: any) {
    // this.item$.subscribe(response => this.orderList = response);
    this.orderList.push(item);
    console.log(this.orderList);
  }
}
