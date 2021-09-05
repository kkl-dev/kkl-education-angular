import { Directive, HostBinding, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appSize]'
})
export class SizeDirective implements OnInit {

  @Input() size: number;


  @HostBinding("style.height") public height: string;
  @HostBinding("style.width") public width: string;


  constructor() {}

  ngOnInit() {
    this.width = `${this.size * 2}px`
    this.height = `${this.size}px`

  }

}
