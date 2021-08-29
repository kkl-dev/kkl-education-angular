import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-simple-card',
  templateUrl: './simple-card.component.html',
  styleUrls: ['./simple-card.component.scss']
})
export class SimpleCardComponent implements OnInit {
  @Input() title: string;
  @Input() icon: string;
  @Input() startTime: string;
  @Input() endTime: string;
  @Input() color:string;
  
  constructor() { }

  ngOnInit(): void {
  }

}
