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
  public steps$: Observable<StepModel[]>;

  constructor(
    private router: Router,
    private orderTourService: OrderTourService
  ) { }


  ngOnInit(): void {
    this.getCurrentUrl();
    this.subscribeToCurrentRoute();
    this.setOrderTourSteps()
  }

  ngAfterViewInit() {
    this.setActiveStep();
  }

  private setOrderTourSteps() {
    this.steps = this.orderTourService.getSteps()
  }

  public changeActiveStep(newActiveStep: number): void {
    this.activeStep = newActiveStep;
  }

  public onChangeStep(step: StepModel) {
    this.router.navigateByUrl(`/education/order-tour/${step.path}`);
    this.orderTourService.updateStepStatus(step, 'label')
    this.steps = this.orderTourService.getSteps()
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

  // private findStepPath(): string {
  //   return this.steps[this.activeStep].path
  // }
}
