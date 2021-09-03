import { Observable } from 'rxjs';
import { StepModel } from './../models/step.model';
import { StepperService } from './stepper.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderTourService {


  private steps: StepModel[] = [
    {
      svgUrl: 'group',
      label: 'הרכב קבוצה',
      path: 'squad-assemble',
      isActive: true,
    },
    {
      svgUrl: 'bed',
      label: 'לינה',
      path: 'sleeping',
      isActive: false,
    },
    {
      svgUrl: 'playground',
      label: 'מתקנים ופעילות',
      path: 'facilities',
      isActive: false,
    },
    {
      svgUrl: 'list',
      label: 'תוספות',
      path: 'additions',
      isActive: false,
    },
    {
      svgUrl: 'add',
      label: 'סיכום',
      path: 'summary',
      isActive: false,
    },
  ];

  constructor(
    private stepperService: StepperService
  ) { }

  public getSteps(): StepModel[] {
    return { ...this.steps }
  }

  public getStepsObservable(): Observable<StepModel[]> {
    return this.stepperService.getStepsObservale()
  }

  private setSteps() {
    this.stepperService.setSteps(this.steps)
  }

  private emitSteps() {
    this.stepperService.emitSteps()
  }

  public setOrderTourSteps() {
    this.setSteps()
    this.emitSteps()
  }

  public updateStepStatus(step: StepModel, key: string) {
    this.stepperService.updateStepStatus(step, key)
  }
}
