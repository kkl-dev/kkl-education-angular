import { Component, ElementRef, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-form-header',
  templateUrl: './form-header.component.html',
  styleUrls: ['./form-header.component.scss']
})
export class FormHeaderComponent implements OnInit {


  @Input() text : string
  @Input() custom : string
  @Input() slots : {}

  constructor() { }

  ngOnInit(): void {

    console.log(this.custom)
    console.log(this.slots)
  }

}
