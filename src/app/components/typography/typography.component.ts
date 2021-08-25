import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-typography',
  templateUrl: './typography.component.html',
  styleUrls: ['./typography.component.scss'],
})
export class TypographyComponent implements OnInit {
  @Input() color: string;
  @Input() size: number | string;
  @Input() bold: number | string;
  @Input() variant: string;
  @Input() underline: string;
  @Input() classes: {
    variant: string;
    color: string;
    underline: string;
  };

  constructor() {}

  ngOnInit(): void {
    this.setColor();
    this.seFontSize();
    this.setFontWeight();

    this.underline = this.underline || ''


  }

  private setColor() {
    this.color = this.color || 'text';
  }

  private seFontSize() {
    if (this.size) {
      this.variant = '';
    } else if (this.variant) {
      this.variant = this.variant || 'mat-title';
    } else {
      this.variant = '';
      this.size = 16;
    }
  }

  private setFontWeight() {
    this.bold = this.bold || 500;
  }
}
