import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { AdditionsService } from '../../services/additions.service';
import { StepModel } from 'src/app/utilities/models/step.model';


@Component({
  selector: 'app-navigation-grid',
  templateUrl: './navigation-grid.component.html',
  styleUrls: ['./navigation-grid.component.scss']
})
export class NavigationGridComponent implements OnInit {

  public title: string = "תוספות"
  public steps$: Observable<StepModel[]>;

  constructor(
    private additionsService: AdditionsService
  ) { }

  ngOnInit(): void {
    this.steps$ = this.additionsService.steps$;

  }

  public onCardClick(step: StepModel) {

    this.additionsService.toggleCardStatus(step, 'label');

  }

}
