import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Router } from '@angular/router';

export interface StepModel {
  svgSrc: string;
  text: string;
  path: string;
}

@Component({
  selector: 'app-working-steps',
  templateUrl: './working-steps.component.html',
  styleUrls: ['./working-steps.component.scss'],
})
export class WorkingStepsComponent implements OnInit {
  @Input() activeStep: number = 0;
  @Input() steps: StepModel[];

  @Output() changeActiveStep = new EventEmitter<number>();

  constructor(private router: Router) {}

  ngOnInit(): void {}

  setActiveStep(number: number) {
    this.changeActiveStep.emit(+number);
  }

  public onStepClick({ path, index }) {
    console.log(index)
    this.setActiveStep(index);
    this.router.navigateByUrl(`/education/order-tour/${path}`);
  }
}
