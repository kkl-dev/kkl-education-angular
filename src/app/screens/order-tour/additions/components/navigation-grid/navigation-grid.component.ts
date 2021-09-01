import { AdditionsService } from '../../services/additions.service';
import { Observable } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { IconCardModel } from 'src/app/utilities/models/IconCardModel';


@Component({
  selector: 'app-navigation-grid',
  templateUrl: './navigation-grid.component.html',
  styleUrls: ['./navigation-grid.component.scss']
})
export class NavigationGridComponent implements OnInit {

  public title: string = "תוספות"
  public cards$: Observable<IconCardModel[]> = this.additionsService.navigationCards$

  constructor(
    private additionsService: AdditionsService
  ) { }

  ngOnInit(): void {
  }

  public onCardClick(item: IconCardModel) {
    this.additionsService.toggleCardStatus(item, 'title');

  }

}
