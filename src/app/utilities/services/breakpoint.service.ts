import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, shareReplay, takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BreakpointService implements OnDestroy {

  public destroyed = new Subject<void>();

  public currentScreenSize: string;

  private displayNameMap = new Map([
    [Breakpoints.XSmall, 'xs'],
    [Breakpoints.Small, 'sm'],
    [Breakpoints.Medium, 'md'],
    [Breakpoints.Large, 'lg'],
    [Breakpoints.XLarge, 'xl'],
  ]);

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .pipe(takeUntil(this.destroyed))
      .subscribe((result) => {
        for (const query of Object.keys(result.breakpoints)) {
          if (result.breakpoints[query]) {
            this.currentScreenSize =
              this.displayNameMap.get(query) ?? 'Unknown';
          }
        }
      });
  }

    public isTablet(): Observable<boolean> {
      return this.breakpointObserver.observe(Breakpoints.Medium)
        .pipe(
          map(result => result.matches),
          shareReplay()
        );
    }


  ngOnDestroy() {}
}
