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

  public onStepClick({ path, index }) {
    this.setActiveStep(index);
    this.router.navigateByUrl(`/education/order-tour/${path}`);
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
