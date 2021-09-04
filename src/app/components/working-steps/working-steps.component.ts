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

  @Output() changeActiveStep = new EventEmitter<number>();
  @Output() changStep = new EventEmitter<StepModel>();

  constructor() { }

  ngOnInit(): void {
    this.setStype()
  }

  public onStepClick(index: number) {
    this.changeActiveStep.emit(index);
  }

  public onCardClick(step: StepModel) {
    this.changStep.emit(step)
  }

  private setStype() {
    this.size = this.size || 80
    this.divider = this.divider
    this.variant = this.variant || 'circle'
  }
}
