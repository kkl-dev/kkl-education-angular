import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-working-steps',
  templateUrl: './working-steps.component.html',
  styleUrls: ['./working-steps.component.scss'],
})
export class WorkingStepsComponent implements OnInit {
  @Input() activeStep:number = 0;
  @Input() steps:{
    svgSrc: string;
    text: string;
  }[] =[] ;

  public stepsArray:{
    svgSrc: string;
    text: string;
  }[]=[];

  @Output() changeActiveStep = new EventEmitter<number>();

  public chosenStep:number = 0;

  public chooseStep(index :number):void {
    this.chosenStep = +index;
  }

  constructor() {}

  ngOnInit(): void {

    this.stepsArray=this.steps
  }
  setActiveStep(number:number) {
    this.changeActiveStep.emit(+number);
  }
}
 