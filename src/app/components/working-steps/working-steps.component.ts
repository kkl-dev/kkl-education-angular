import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Router } from '@angular/router';

export interface StepModel {
  svgUrl: string;
  text: string;
  path: string;
  size?: number;
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
    this.setActiveStep(index);
    this.router.navigateByUrl(`/education/order-tour/${path}`);
  }
}
