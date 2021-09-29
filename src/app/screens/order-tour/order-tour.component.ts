import { StepperService } from './../../utilities/services/stepper.service';
import { OrderTourService } from './../../utilities/services/order-tour.service';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { StepModel } from 'src/app/utilities/models/step.model';

@Component({
  selector: 'app-order-tour',
  templateUrl: './order-tour.component.html',
  styleUrls: ['./order-tour.component.scss'],
  providers: [StepperService]
})
export class OrderTourComponent implements OnInit, AfterViewInit {

  public activeStep: number;

  public $activeStep = new Subject<number>();

  public nextPage: string = 'education/search';
  public prevPage: string = 'education/results';

  public currentRoute: string;
  public sleepStatus: boolean;

  public steps: StepModel[];
  public currentStep: StepModel;

  constructor(
    private router: Router,
    private orderTourService: OrderTourService
  ) { }


  ngOnInit(): void {
    this.setOrderTourSteps()
    this.getCurrentUrl();
    this.subscribeToCurrentRoute();
    this.getActiveStep();
    this.setActiveStep()


  }

  ngAfterViewInit() {
  }

  // SUBSCRIBE SECTION
  private subscribeToCurrentRoute() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.formatUrl(event.url);
        this.handleSleepStatus();
        this.getActiveStep()
        this.setActiveStep()
      });
  }

  // method to set initial steps array
  private setOrderTourSteps() {
    this.steps = this.orderTourService.getSteps()
  }

  // step logic
  private updateStepsStatus(step: StepModel) {
    this.orderTourService.updateStepStatus(step, 'label')
    this.steps = this.orderTourService.getSteps()
  }

  private handleSleepStatus() {
    this.sleepStatus = this.currentRoute === 'sleeping';
  }

  private getActiveStep() {
    this.currentStep = this.steps.find(
      (step: StepModel) => this.currentRoute === step.path
    );
  }

  private setActiveStep() {
    this.updateStepsStatus(this.currentStep)
  }


  // route url logic
  private getCurrentUrl() {
    this.formatUrl(this.router.url);
  }

  private formatUrl(url: string) {
    const path = url.split('/');
    this.currentRoute = path[3];
  }


  // LISTEN TO OUTPUE EVENTS
  public changeActiveStep(newActiveStep: number): void {
    this.activeStep = newActiveStep;
  }

  public onChangeStep(step: StepModel) {
    this.router.navigateByUrl(`/education/order-tour/${step.path}`);
    this.updateStepsStatus(step)
  }

  public changeActiveStepBottomNavigation(newActiveStep: number): void {
    this.activeStep = +newActiveStep;
  }

}
