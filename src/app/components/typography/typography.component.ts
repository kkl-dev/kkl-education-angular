import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-typography',
  templateUrl: './typography.component.html',
  styleUrls: ['./typography.component.scss'],
})
export class TypographyComponent implements OnInit {
  @Input() color: string;
  @Input() size: string = '';
  @Input() bold: number;
  @Input() variant: string;

  constructor() {}

  ngOnInit(): void {
    this.color = this.color || 'text';

    if (this.size) {
      this.variant = '';
    } else {
      this.variant = this.variant || 'mat-title';
    }

    this.bold = this.bold || 500;
  }
}
