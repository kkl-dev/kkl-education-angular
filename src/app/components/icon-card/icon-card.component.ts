import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { IconCardModel } from 'src/app/utilities/models/IconCardModel';

@Component({
  selector: 'app-icon-card',
  templateUrl: './icon-card.component.html',
  styleUrls: ['./icon-card.component.scss']
})
export class IconCardComponent implements OnInit {

  @Output() onClick: EventEmitter<IconCardModel> = new EventEmitter();

  @Input() public item: IconCardModel;

  constructor(
  ) { }

  ngOnInit(): void {
  }

  public onCardClick(): void {
    if (!this.item.isActive) {
      this.onClick.emit(this.item);
    }
  }

}
