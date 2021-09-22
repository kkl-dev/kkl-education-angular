import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { StepModel } from 'src/app/utilities/models/step.model';
import { RouteService } from 'src/app/utilities/services/route.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {

  public prefix = '';
  public showStatus: boolean = true;
  public showWizard: boolean = true;



  public status: StepModel[] = [
    {
      label: 'בתהליך',
      svgUrl: 'reload',
      badgeValue: 3,
    },
    {
      label: 'מחכה לאישור',
      svgUrl: 'report',
      badgeValue: 1,
    },
    {
      label: 'סגור',
      svgUrl: 'flag',
      badgeValue: 20,
    },
  ];

  private falseUrlWizard: string[] = ['education'];
  private falseUrlStatus: string[] = ['education'];

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private routeService: RouteService
  ) {}

  ngOnInit(): void {
    this.routeService.subscribeToRoute().subscribe((url: string) => {
      const path = this.routeService.getCurrentPath(url);
      this.showWizard = this.setShowState(path, this.falseUrlWizard);
      this.showStatus = this.setShowState(path, this.falseUrlStatus);
    });
  }

  private setShowState(path: string, falseSteps: string[]): boolean {
    return falseSteps.findIndex((item: string) => item === path) !== -1;
  }
}
