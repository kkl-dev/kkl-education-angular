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

  @Input() size: number;
  @Input() iconSize: number;
  @Input() steps: StepModel[];

  @Output() changeActiveStep = new EventEmitter<number>();
  @Output() changStep = new EventEmitter<StepModel>();

  constructor() { }

  ngOnInit(): void {
    this.setSize()
  }

  public onStepClick(index: number) {
    this.changeActiveStep.emit(index);
  }

  public onCardClick(step: StepModel) {
    this.changStep.emit(step)
  }


  private setSize() {
    this.size = this.size || 60
  }
}
