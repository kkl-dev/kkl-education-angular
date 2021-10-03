import { AdditionsService } from './../../services/additions.service';
import { Component, OnInit, Input } from '@angular/core';
import { StepModel } from 'src/app/utilities/models/step.model';


@Component({
  selector: 'app-navigation-grid',
  templateUrl: './navigation-grid.component.html',
  styleUrls: ['./navigation-grid.component.scss']
})
export class NavigationGridComponent implements OnInit {

  @Input() public steps: StepModel[];

  public title: string = "תוספות"

  constructor(
    private additionsService: AdditionsService
  ) { }

  ngOnInit(): void {
    this.steps = this.additionsService.getSteps()
  }

  public onChangeStep(step: StepModel) {
    this.additionsService.updateStepStatus(step, 'label')
    this.steps = this.additionsService.getSteps()
  }

}
