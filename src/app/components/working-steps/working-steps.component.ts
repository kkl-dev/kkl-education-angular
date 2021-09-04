import { OrderTourService } from './../../utilities/services/order-tour.service';
import { StepperService } from './../../utilities/services/stepper.service';
import { StepModel } from './../../utilities/models/step.model';
import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  AfterViewInit,
} from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-working-steps',
  templateUrl: './working-steps.component.html',
  styleUrls: ['./working-steps.component.scss'],
})
export class WorkingStepsComponent implements OnInit, AfterViewInit {

  public size : number = 80;

  @Input() $activeStep: Observable<number>;
  @Input() steps: StepModel[];

  @Output() changeActiveStep = new EventEmitter<number>();
  @Output() changStep = new EventEmitter<StepModel>();

  public activeStep: number;

  constructor(
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.subscribeToActiveStep();
  }

  public onStepClick(index: number) {
    this.changeActiveStep.emit(index);
  }

  public onCardClick(step: StepModel) {
    this.changStep.emit(step)
  }

  private subscribeToActiveStep() {
    this.$activeStep.subscribe((value) => {
      this.activeStep = value;
    });
  }
}
