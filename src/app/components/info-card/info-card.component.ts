import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-info-card',
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.scss']
})
export class InfoCardComponent implements OnInit {

  @Input() public item : any

  defaultImage : string ='path270.svg';
  constructor() { }

  ngOnInit(): void {
  }
   

}
