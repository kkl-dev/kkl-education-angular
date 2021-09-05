import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { StepModel } from 'src/app/utilities/models/step.model';

@Component({
  selector: 'app-icon-card',
  templateUrl: './icon-card.component.html',
  styleUrls: ['./icon-card.component.scss'],
})
export class IconCardComponent implements OnInit {


  @Input() public step: StepModel;
  @Input() public variant: string;
  @Input() public stepper: string;
  @Input() public size: number;

  @Output() onClick: EventEmitter<StepModel> = new EventEmitter();

  public shape: boolean;
  public width: number;
  public height: number;
  public classes: {};

  constructor() { }

  ngOnInit(): void {
    this.setSize();
    this.setClasses();
  }

  public onCardClick(): void {
    if (!this.step.isActive) {
      this.onClick.emit(this.step);
    }
  }

  private setSize() {
    this.width = this.size;
    this.height = this.size;
  }

  private setClasses() {
    this.shape = this.variant === 'circle'

  }
}
