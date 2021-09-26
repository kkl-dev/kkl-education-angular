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
  @Input() public expanded: boolean;
  @Input() public hideToggle: boolean;

  public panelOpenState = false;

  constructor() {}

  ngOnInit(): void {
    this.variant = this.variant || ''
    this.expanded = this.expanded || false
    this.hideToggle = this.hideToggle || false
  }
}
