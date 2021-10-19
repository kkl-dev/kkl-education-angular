import { AdditionsService } from './../../services/additions.service';
import { Component, OnInit, Input } from '@angular/core';
import { StepModel } from 'src/app/utilities/models/step.model';
import { UserService } from 'src/app/open-api';
import { OrderService } from 'src/app/open-api';
import { SquadAssembleService } from '../../../squad-assemble/services/squad-assemble.service';
import { tourTransport } from 'src/mock_data/transport';


@Component({
  selector: 'app-navigation-grid',
  templateUrl: './navigation-grid.component.html',
  styleUrls: ['./navigation-grid.component.scss']
})
export class NavigationGridComponent implements OnInit {

  @Input() public steps: StepModel[];
  @Input() public tempOrderReduce: any;

  public title: string = "תוספות"
  // public tempOrderReduce: any;

  constructor(
    private additionsService: AdditionsService, private squadAssembleService: SquadAssembleService, private userService: UserService, private orderService: OrderService) { }

  ngOnInit(): void {
    this.getOrderTypes()
    // this.steps = this.additionsService.getSteps()
  }
  convertStepsModel() {
    this.steps = [];
    for (var i in this.additionsService.orderTypes) {
      var step = {} as StepModel;
      step.label = this.additionsService.orderTypes[i].name
      switch (step.label) {
        case 'היסעים':
          step.svgUrl = 'bus';
          break;
        case 'אבטחה':
          step.svgUrl = 'shield';
          break;
        case 'אתרים':
          step.svgUrl = 'site';
          break;
        case 'כלכלה':
          step.svgUrl = 'dinner';
          break;
        case 'אירוח/פעילות':
          step.svgUrl = 'tent';
          break;
        case 'הדרכה':
          step.svgUrl = 'guide';
          break;
        case 'מפעיל מוסיקלי':
          step.svgUrl = 'music';
          break;
      }
      // step.svgUrl = this.additionsService.orderTypes[i].iconPath
      for (var j in this.tempOrderReduce) {
        if (this.tempOrderReduce[j][0].orderTypeCode === this.additionsService.orderTypes[i].id) { step.badgeValue = this.tempOrderReduce[j].length; }
      }
      this.steps.push(step)
    }
  }
  getOrderTypes() {
    this.orderService.getOrderTypes().subscribe(
      response => {
        console.log(response)
        this.additionsService.orderTypes = response;

        this.convertStepsModel();
      },
      error => console.log(error),       // error
      () => console.log('completed')     // complete
    )
  }
  onChangeStep(step: StepModel) {
    this.additionsService.updateStepStatus(step, 'label')
    this.steps = this.additionsService.getSteps()
  }
}
