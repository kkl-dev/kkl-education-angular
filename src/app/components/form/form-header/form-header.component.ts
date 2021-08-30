import { Component, ElementRef, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-form-header',
  templateUrl: './form-header.component.html',
  styleUrls: ['./form-header.component.scss']
})
export class FormHeaderComponent implements OnInit {


  @Input() text : string
  @Input() custom : any
  @Input() slot : ElementRef

  constructor() { }

  ngOnInit(): void {
  }

}
