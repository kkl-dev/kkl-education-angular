import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { StepModel } from 'src/app/utilities/models/step.model';

@Component({
  selector: 'app-order-tour',
  templateUrl: './order-tour.component.html',
  styleUrls: ['./order-tour.component.scss'],
})
export class OrderTourComponent implements OnInit, AfterViewInit {
  public activeStep: number;

  public $activeStep = new Subject<number>();

  public nextPage: string = 'education/search';
  public prevPage: string = 'education/results';

  public currentRoute: string;
  public sleepStatus: boolean;

  public steps: StepModel[] = [
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
      isActive: false,
    },
    {
      svgUrl: 'playground',
      label: 'מתקנים ופעילות',
      path: 'facilities',
      isActive: false,
    },
    {
      svgUrl: 'list',
      label: 'תוספות',
      path: 'additions',
      isActive: false,
    },
    {
      svgUrl: 'add',
      label: 'סיכום',
      path: 'summary',
      isActive: false,
    },
  ];

  constructor(private router: Router) {}


  ngOnInit(): void {
    this.getCurrentUrl();
    this.subscribeToCurrentRoute();
  }

  ngAfterViewInit() {
    this.setActiveStep();
  }

  public changeActiveStep(newActiveStep: number): void {
    this.activeStep = newActiveStep;
    this.router.navigateByUrl(`/education/order-tour/${this.findStepPath()}`);
  }

  public changeActiveStepBottomNavigation(newActiveStep: number): void {
    this.activeStep = +newActiveStep;
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
        this.setActiveStep()
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
      (step: StepModel) => this.currentRoute === step.path
    );
    this.$activeStep.next(this.activeStep);
  }

  private findStepPath() : string {
    return this.steps[this.activeStep].path
  }
}
