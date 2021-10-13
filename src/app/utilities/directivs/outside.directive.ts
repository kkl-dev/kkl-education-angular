import { Directive, ElementRef, EventEmitter, Output } from '@angular/core';
import { FacilitiesService } from 'src/app/services/facilities.service';

@Directive({
  selector: '[appOutside]',
  host: {
    '(document:click)': 'onClick($event)',
  }
})
export class OutsideDirective {

  constructor(private elementRef: ElementRef, private factilitiesServices: FacilitiesService) { }
  public counter = 0;

  public onClick(event: any) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.counter++;
      if (this.counter > 1) {
        this.factilitiesServices.closeModal('close');
      }
    }
  }
}
