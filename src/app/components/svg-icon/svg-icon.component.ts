import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-svg-icon',
  templateUrl: './svg-icon.component.html',
  styleUrls: ['./svg-icon.component.scss']
})
export class SvgIconComponent implements OnInit {
  @Input() svgUrl: string;
  @Input() imgUrl: string;
  @Input() color: string;
  constructor() { }

  ngOnInit(): void {
  }

}
