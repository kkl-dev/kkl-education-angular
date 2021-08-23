import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-typography',
  templateUrl: './typography.component.html',
  styleUrls: ['./typography.component.scss'],
})
export class TypographyComponent implements OnInit {
  @Input() color: string;
  @Input() bold: string = '';
  @Input() size: string = '18';
  @Input() variant: string = 'mat-title';

  constructor() {}

  ngOnInit(): void {
    this.color = this.color || 'text';
    if (this.color !== 'text') {
      console.log(this.color);
    }
  }
}
