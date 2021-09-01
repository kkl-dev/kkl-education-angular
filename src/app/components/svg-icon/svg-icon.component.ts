import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-svg-icon',
  templateUrl: './svg-icon.component.html',
  styleUrls: ['./svg-icon.component.scss']
})
export class SvgIconComponent implements OnInit {
  @Input() firstIcon: string;
  @Input() secondIcon: string;
  @Input() SelectedColor: string;
  @Input() badgeColor: string = 'white';
  @Input() badgeBackgroundColor: string = '#FC1F9D';
  
  constructor() { }

  ngOnInit(): void {
  }

}
