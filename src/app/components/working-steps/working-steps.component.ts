import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IconCardModel } from 'src/app/utilities/models/IconCardModel';


@Component({
  selector: 'app-working-steps',
  templateUrl: './working-steps.component.html',
  styleUrls: ['./working-steps.component.scss'],
})
export class WorkingStepsComponent implements OnInit {
  @Input() activeStep: number;
  @Input() steps: IconCardModel[];

  @Output() changeActiveStep = new EventEmitter<number>();

  constructor(private router: Router) {}

  ngOnInit(): void {
  }

  setActiveStep(number: number) {
    this.changeActiveStep.emit(number);
  }

  public onStepClick({ path, index }) {
    this.setActiveStep(index);
    this.router.navigateByUrl(`/education/order-tour/${path}`);
  }
}
