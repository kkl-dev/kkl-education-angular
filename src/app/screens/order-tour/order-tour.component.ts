import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { IconCardModel } from 'src/app/utilities/models/IconCardModel';

@Component({
  selector: 'app-order-tour',
  templateUrl: './order-tour.component.html',
  styleUrls: ['./order-tour.component.scss'],
})
export class OrderTourComponent implements OnInit {
  public activeStep: number;
  public nextPage: string = 'education/search';
  public prevPage: string = 'education/results';

  public currentRoute: string;
  public sleepStatus: boolean;

  public steps: IconCardModel[] = [
    {
      svgUrl: 'group',
      label: 'הרכב קבוצה',
      path: 'squad-assemble',
      isActive: true,
    },
    {
      svgUrl: 'bed',
      label: 'לינה',
      path: 'sleeping',
      isActive: true,
    },
    {
      svgUrl: 'playground',
      label: 'מתקנים ופעילות',
      path: 'facilities',
      isActive: true,
    },
    {
      svgUrl: 'list',
      label: 'תוספות',
      path: 'additions',
      isActive: true,
    },
    {
      svgUrl: 'add',
      label: 'סיכום',
      path: 'summary',
      isActive: true,
    },
  ];

  public changeActiveStep(newActiveStep: number): void {
    this.activeStep = newActiveStep;
  }
  public changeActiveStepBottomNavigation(newActiveStep: number): void {
    this.activeStep = +newActiveStep;
  }
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.getCurrentUrl();
    this.subscribeToCurrentRoute();
    this.setActiveStep();
  }

  private getCurrentUrl() {
    this.formatUrl(this.router.url);
  }

  private subscribeToCurrentRoute() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.formatUrl(event.url);
        this.handleStatus();
      });
  }

  private formatUrl(url: string) {
    const path = url.split('/');
    this.currentRoute = path[3];
  }

  private handleStatus() {
    this.sleepStatus = this.currentRoute === 'sleeping';
  }

  private setActiveStep() {
    this.activeStep = this.steps.findIndex(
      (step: IconCardModel) => this.currentRoute === step.path
    );
  }
}
