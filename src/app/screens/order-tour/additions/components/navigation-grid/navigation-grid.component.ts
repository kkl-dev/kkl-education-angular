import { AdditionsService } from './../../services/additions.service';
import { Component, OnInit, Input,Output, EventEmitter } from '@angular/core';
import { StepModel } from 'src/app/utilities/models/step.model';
import { StepModel1 } from 'src/app/utilities/models/step.model';
import { OrderType, UserService } from 'src/app/open-api';
import { OrderService } from 'src/app/open-api';
import { SquadAssembleService } from '../../../squad-assemble/services/squad-assemble.service';
import { tourTransport } from 'src/mock_data/transport';



@Component({
  selector: 'app-navigation-grid',
  templateUrl: './navigation-grid.component.html',
  styleUrls: ['./navigation-grid.component.scss']
})
export class NavigationGridComponent implements OnInit {

  //@Input() public steps: StepModel[];
  public steps: StepModel1[];
 // @Input() public tempOrderReduce: any;
   tempOrderReduce: any;
  @Output() changeStep: EventEmitter<number> = new EventEmitter();
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
      var step = {} as StepModel1;
      step.label = this.additionsService.orderTypes[i].name
      switch (step.label) {
        case 'היסעים':
          step.svgUrl = 'bus';
          step.value=1;
         
          break;
        case 'אבטחה':
          step.svgUrl = 'shield';
          step.value=2;
          break;
        case 'אתרים':
          step.svgUrl = 'site';
          step.value=3;
          break;
        case 'כלכלה':
          step.svgUrl = 'dinner';
          step.value=4;
          break;
        case 'אירוח/פעילות':
          step.svgUrl = 'tent';
          step.value=7;
          break;
        case 'הדרכה':
          step.svgUrl = 'guide';
          step.value=6;
          break;
        case 'מפעיל מוסיקלי':
          step.svgUrl = 'music';
          step.value=10;
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
        this.additionsService.tempOrderReduce1.subscribe(res=>{
          this.tempOrderReduce=res;
          this.convertStepsModel();
        })
        
      },
      error => console.log(error),       // error
      () => console.log('completed')     // complete
    )
  }
  onChangeStep(step: StepModel1) {
    this.changeStep.emit(step.value);
    //this.additionsService.updateStepStatus(step, 'label')
    //this.steps = this.additionsService.getSteps()
  }

}
