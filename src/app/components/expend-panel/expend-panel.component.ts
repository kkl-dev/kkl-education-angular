import { Component, ElementRef, Input, OnInit } from '@angular/core';

export interface PanelModel {
  title: ElementRef;
  description: ElementRef;
  content: ElementRef;
  actions: ElementRef;
}

@Component({
  selector: 'app-expend-panel',
  templateUrl: './expend-panel.component.html',
  styleUrls: ['./expend-panel.component.scss'],
})
export class ExpendPanelComponent implements OnInit {

  // prop for custom class
  @Input() public variant: string;

  public panelOpenState = false;

  constructor() {}

  ngOnInit(): void {}
}
