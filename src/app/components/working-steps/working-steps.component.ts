import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  AfterViewInit,
} from '@angular/core';
import { Observable } from 'rxjs';
import { IconCardModel } from 'src/app/utilities/models/IconCardModel';

@Component({
  selector: 'app-working-steps',
  templateUrl: './working-steps.component.html',
  styleUrls: ['./working-steps.component.scss'],
})
export class WorkingStepsComponent implements OnInit, AfterViewInit {
  @Input() $activeStep: Observable<number>;
  @Input() steps: IconCardModel[];

  @Output() changeActiveStep = new EventEmitter<number>();

  public activeStep: number;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.subscribeToActiveStep();
  }

  public onStepClick({ path, index }) {
    this.setActiveStep(index);
  }

  setActiveStep(number: number) {
    this.changeActiveStep.emit(number);
  }


  private subscribeToActiveStep() {
    this.$activeStep.subscribe((value) => {
      this.activeStep = value;
    });
  }
}
