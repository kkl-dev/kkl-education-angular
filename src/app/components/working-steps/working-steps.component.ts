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
export class WorkingStepsComponent implements OnInit {

  @Input() steps: StepModel[];
  @Input() variant: string;
  @Input() size: number;
  @Input() iconSize: number;
  @Input() divider: boolean;

  @Input() isSleep: boolean;

  @Output() changeActiveStep = new EventEmitter<number>();
  @Output() changStep = new EventEmitter<StepModel>();

  constructor() { }

  ngOnInit(): void {
    this.setStyle()
  }

  public onStepClick(index: number) {
    this.changeActiveStep.emit(index);
  }

  public onCardClick(step: StepModel) {

    this.isSleep = step.path === 'sleeping'
    console.log(step.path)
    console.log(this.isSleep)
    this.changStep.emit(step)
  }

  private setStyle() {
    this.size = this.size || 60
    this.divider = this.divider
    this.variant = this.variant || 'circle'
  }
}
