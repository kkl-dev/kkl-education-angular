import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  AfterViewInit,
} from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private router: Router) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.subscribeToActiveStep();
  }

  setActiveStep(number: number) {
    this.changeActiveStep.emit(number);
  }

  public onStepClick({ path, index }) {
    this.setActiveStep(index);
    this.router.navigateByUrl(`/education/order-tour/${path}`);
  }

  private subscribeToActiveStep() {
    this.$activeStep.subscribe((value) => {
      console.log(value);
      this.activeStep = value;
    });
  }
}
