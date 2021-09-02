import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { IconCardModel } from 'src/app/utilities/models/IconCardModel';

@Component({
  selector: 'app-icon-card',
  templateUrl: './icon-card.component.html',
  styleUrls: ['./icon-card.component.scss'],
})
export class IconCardComponent implements OnInit {
  @Output() onClick: EventEmitter<IconCardModel> = new EventEmitter();

  @Input() public step: IconCardModel;
  @Input() public variant: string;
  @Input() public stepper: string;
  @Input() public size: number;

  public shape: boolean;
  public width: number;
  public height: number;
  public classes: {};

  constructor() { }

  ngOnInit(): void {
    this.setVariant();
    this.setSize();
    this.setClasses();
  }

  public onCardClick(): void {
    if (!this.step.isActive) {
      this.onClick.emit(this.step);
    }
  }

  private setVariant() {
    console.log(this.variant);
    this.variant = this.variant || 'square';
    console.log(this.variant);
  }

  private setSize() {
    this.width = this.size;
    this.height = this.size;
  }

  private seActive() { }

  private setClasses() {
    this.classes = {
      [this.variant]: true,
      stepper: true,
    };

    this.shape = this.variant === 'circle'

  }
}
