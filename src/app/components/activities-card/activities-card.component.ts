import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-activities-card',
  templateUrl: './activities-card.component.html',
  styleUrls: ['./activities-card.component.scss']
})


export class ActivitiesCardComponent implements OnInit {
  @Input() obj:ActivitiesCardInterface;
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