import {
  Directive,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { BreakpointService } from '../services/breakpoint.service';

@Directive({
  selector: '[appSize]',
})
export class SizeDirective implements OnInit, OnDestroy {
  @Input() size: number;
  @Input() type: string;
  @Input() divider: number;
  @Input() isSleep: boolean;

  private tablet$: Observable<boolean>;

  private subscription: Subscription;
  private stepperSize: number;

  @HostBinding('style.height') public height: string;
  @HostBinding('style.width') public width: string;

  constructor(private breakpointService: BreakpointService) { }

  ngOnInit(): void {
    this.setSize();
    this.tablet$ = this.breakpointService.isTablet();
    this.subscribeToBreakpoint();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private setSize() {
    switch (this.type) {
      case 'wizard':
        this.width = '6rem';
        this.height = '7.5rem';
        break;
      case 'status':
        this.width = `6rem`;
        this.height = `6rem`;
        break;
      case 'step':
        this.width = `${this.size}rem !important`;
        this.height = `8rem !important`;
        break;
      default:
        this.width = `${this.size * (this.divider || 1)}rem`;
        this.height = `${this.size}rem`;
    }
  }

  private subscribeToBreakpoint() {
    this.subscription = this.tablet$.subscribe((tablet: boolean) => {
      this.setSize();
    });
  }
}
