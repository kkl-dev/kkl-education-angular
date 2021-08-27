import { AdditionsService } from '../../utilities/services/additions.service';
import { Component, Input, OnInit } from '@angular/core';
import { IconCardModel } from 'src/app/utilities/models/IconCardModel';

@Component({
  selector: 'app-nav-card',
  templateUrl: './nav-card.component.html',
  styleUrls: ['./nav-card.component.scss']
})
export class NavCardComponent implements OnInit {

  @Input() public item: IconCardModel = {  }
  @Input() public width: IconCardModel = {  }
  @Input() public height: IconCardModel = {  }

  constructor(
    private additionsService: AdditionsService
  ) { }

  ngOnInit(): void {
  }

  public onCardClick(): void {
    if (!this.item.isActive) {
      this.additionsService.emitItem(this.item);
    }
  }

}
