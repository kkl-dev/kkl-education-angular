import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { IconCardModel } from 'src/app/utilities/models/IconCardModel';

@Component({
  selector: 'app-icon-card',
  templateUrl: './icon-card.component.html',
  styleUrls: ['./icon-card.component.scss'],
})
export class IconCardComponent implements OnInit {
  @Output() onClick: EventEmitter<IconCardModel> = new EventEmitter();

  @Input() public item: IconCardModel;
  @Input() public variant: string;

  constructor() {}

  ngOnInit(): void {
    this.setVariant();
  }

  public onCardClick(): void {
    if (!this.item.isActive) {
      this.onClick.emit(this.item);
    }
  }

  private setVariant() {
    this.variant = this.variant || 'square';
  }
}
