import { StepModel } from './../models/step.model';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StepperService {

  constructor() { }


  private findItemIndex(steps: StepModel[], key: string, value: any): number {
    return steps.findIndex((item) => item[key] === value)
  }

  private findStepsIndex(steps: StepModel[], key: string, value: string): { on: number, off: number } {
    const indexToUnActive = this.findItemIndex(steps, 'isActive', true)

    const indexToActive = this.findItemIndex(steps, key, value)

    return { on: indexToActive, off: indexToUnActive }
  }

  private toggleStepStatus(steps: StepModel[], index: { on: number, off: number }): StepModel[] {
    steps[index.off].isActive = false
    steps[index.on].isActive = true

    return steps
  }

  public updateStepStatus(steps: StepModel[], step: StepModel, key: string): StepModel[] {
    return this.toggleStepStatus(steps, this.findStepsIndex(steps, key, step[key]))
  }

}
