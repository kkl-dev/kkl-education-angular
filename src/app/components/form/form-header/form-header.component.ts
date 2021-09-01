import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-form-header',
  templateUrl: './form-header.component.html',
  styleUrls: ['./form-header.component.scss'],
})
export class FormHeaderComponent implements OnInit {
  @Input() text: string;
  @Input() custom: string;
  @Input() title: string;
  @Input() classes: {};
  @Input() slots: {};

  constructor() {}

  ngOnInit(): void {
    this.title = this.title || '';
    console.log(this.classes);
  }
}
