import { Component, Input, OnInit ,Output ,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-activities-card',
  templateUrl: './activities-card.component.html',
  styleUrls: ['./activities-card.component.scss']
})


export class ActivitiesCardComponent implements OnInit {
  @Input() public obj:ActivitiesCardInterface;
  @Output() public buttonClicked:EventEmitter<any> =  new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

}

export interface ActivitiesCardInterface{
  svgUrl?:string;
  img?:string;
  title:string;
  content?:string;
  hours?:number;
}