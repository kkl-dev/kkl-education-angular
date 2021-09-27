import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-form-header',
  templateUrl: './form-header.component.html',
  styleUrls: ['./form-header.component.scss'],
})
export class FormHeaderComponent implements OnInit {
  @Input() variant: string;
  @Input() slot: string;
  @Input() classes: {};
  @Input() slots: {};

  constructor() {}

  ngOnInit(): void {
    this.variant = this.variant || ''
  }
}
