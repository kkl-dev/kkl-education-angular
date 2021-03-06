import { Observable } from 'rxjs';
import { StepModel } from './../models/step.model';
import { StepperService } from './stepper.service';
import { Injectable } from '@angular/core';
import { SquadAssembleService } from 'src/app/screens/order-tour/squad-assemble/services/squad-assemble.service';

@Injectable({
  providedIn: 'root',
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
      label: 'תוספות',
      path: 'additions',
      svgUrl: 'add',
      isActive: false,
    },
    {
      svgUrl: 'list',
      label: 'סיכום',
      path: 'summary',
      isActive: false,
    },
  ];

  constructor(
    private stepperService: StepperService,
    private squadAssembleService: SquadAssembleService
  ) {}

  public getSteps(): StepModel[] {
    return [...this.steps];
  }

  public updateStepStatus(step: StepModel, key: string) {
    this.steps = this.stepperService.updateStepStatus(this.steps, step, key);
  }

  public getNewClientObs(): Observable<boolean> {
    return this.squadAssembleService.getNewClientObs();
  }
}
