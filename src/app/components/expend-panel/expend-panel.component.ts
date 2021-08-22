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
  constructor() {}

  public panelOpenState = false;

  @Input() subtitle: string;
  @Input() content: string;
  @Input() actins: string;

  ngOnInit(): void {}
}
