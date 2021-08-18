import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-typography',
  templateUrl: './typography.component.html',
  styleUrls: ['./typography.component.scss'],
})
export class TypographyComponent implements OnInit {
  constructor() {}

  @Input() color: string;
  @Input() variant: string;

  ngOnInit(): void {}
}
