import { AdditionsService } from '../../utilities/services/additions.service';
import { Component, Input, OnInit } from '@angular/core';
import { NavigationCardModel } from 'src/app/utilities/models/nav-card-model';

@Component({
  selector: 'app-nav-card',
  templateUrl: './nav-card.component.html',
  styleUrls: ['./nav-card.component.scss']
})
export class NavCardComponent implements OnInit {

  @Input() public item: NavigationCardModel = {  }
  @Input() public width: NavigationCardModel = {  }
  @Input() public height: NavigationCardModel = {  }

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
