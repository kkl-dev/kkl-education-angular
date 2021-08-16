import { AdditionsService } from './../../services/additions.service';
import { Component, Input, OnInit } from '@angular/core';
import { NavigationCardModel } from 'src/app/models/nav-card-model';

@Component({
  selector: 'app-nav-card',
  templateUrl: './nav-card.component.html',
  styleUrls: ['./nav-card.component.scss']
})
export class NavCardComponent implements OnInit {

  @Input() public item: NavigationCardModel = {}

  constructor(
    private additionsService : AdditionsService
  ) { }

  ngOnInit(): void {
  }

  public onCardClick() : void {
    this.additionsService.emitItem(this.item);
  }

}