import { Directive, Input, HostBinding } from '@angular/core';

@Directive({
  selector: '[appActiveState]'
})
export class ActiveStateDirective {

  @Input('active') active: string
  @Input('default') defualt: string
  @Input('state') state: boolean

  @HostBinding("style.color") public color: string;


  constructor() {

    this.color = 'yellow'

    if (this.state) {
      this.color = this.active
    } else {
      this.color = this.defualt
    }

  }

}
