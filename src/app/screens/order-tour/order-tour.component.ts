import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { StepModel } from 'src/app/components/working-steps/working-steps.component';

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

  public steps: StepModel[] = [
    {
      svgUrl: 'groups',
      text: 'הרכב קבוצה',
      path: 'squad-assemble',
      iconType: 'mat',
    },
    {
      svgUrl: 'bed',
      text: 'לינה',
      path: 'sleeping',
    },
    {
      svgUrl: 'playground',
      text: 'מתקנים ופעילות',
      path: 'facilities',
    },
    {
      svgUrl: 'list',
      text: 'תוספות',
      path: 'additions',
    },
    {
      svgUrl: 'add',
      text: 'סיכום',
      path: 'summery',
    },
  ];

  public changeActiveStep(newActiveStep: number): void {
    this.activeStep = +newActiveStep;
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
    console.log(this.currentRoute);
    this.activeStep = this.steps.findIndex(
      (step: StepModel) => this.currentRoute === step.path
    );
  }
}
