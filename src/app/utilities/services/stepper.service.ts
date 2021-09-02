import { StepModel } from './../models/step.model';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StepperService {

  private steps: StepModel[];
  private stepsSubject = new BehaviorSubject<StepModel[]>([])
  private steps$ = this.stepsSubject.asObservable()

  constructor() { }

  public setSteps(steps: StepModel[]) {
    this.steps = steps
  }

  public getSteps(): StepModel[] {
    return { ...this.steps }
  }

  private findItemIndex(key: string, value: any): number {
    return this.steps.findIndex((item) => item[key] === value)
  }

  private findStepsIndex(key: string, value: string): { on: number, off: number } {
    const indexToUnActive = this.findItemIndex('isActive', true)

    const indexToActive = this.findItemIndex(key, value)

    return { on: indexToActive, off: indexToUnActive }
  }

  private toggleStepStatus(index: { on: number, off: number }) {
    this.steps[index.off].isActive = false
    this.steps[index.on].isActive = true
  }

  public updateStepStatus(step: StepModel, key: string) {


    this.toggleStepStatus(this.findStepsIndex(key, step[key]))
    this.emitSteps()
  }

  public emitSteps() {
    this.stepsSubject.next(this.steps)
  }

  public getStepsObservale() {
    return this.steps$
  }

}
