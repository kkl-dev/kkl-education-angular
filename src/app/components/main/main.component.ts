import { UserDataService } from './../../utilities/services/user-data.service';
import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationCardModel } from 'src/app/models/nav-card-model';
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



  public status: NavigationCardModel[] = [
    {
      title: 'בתהליך',
      svgUrl: 'reload',
      badgeValue: 3,
    },
    {
      title: 'מחכה לאישור',
      svgUrl: 'report',
      badgeValue: 1,
    },
    {
      title: 'סגור',
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
