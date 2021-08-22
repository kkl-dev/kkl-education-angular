import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[appLabelLength]',
})
export class LabelLengthDirective {
  @Input() cols: number;

  @HostBinding("style.height") public height: string;


  constructor() {
    console.log(this.height);
  }
}
