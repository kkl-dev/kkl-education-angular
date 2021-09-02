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
  @Input() public size: number;

   public width: number;
   public height: number;


  constructor() {}

  ngOnInit(): void {
    this.setVariant();
    this.setSize()
  }

  public onCardClick(): void {
    if (!this.step.isActive) {
      this.onClick.emit(this.step);
    }
  }

  private setVariant() {
    this.variant = this.variant || 'square';
  }

  private setSize() {
    this.width = this.size;
    this.height = this.size;
  }
}
