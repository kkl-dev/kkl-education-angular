import { StepperService } from './../../utilities/services/stepper.service';
import { OrderTourService } from './../../utilities/services/order-tour.service';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { StepModel } from 'src/app/utilities/models/step.model';
import { SquadAssembleService } from './squad-assemble/services/squad-assemble.service';
import { TripService } from 'src/app/services/trip.service';

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
    private orderTourService: OrderTourService,
    private squadAssemble: SquadAssembleService,
    private tripService: TripService
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

  // method to set initiel steps array
  private setOrderTourSteps() {
    this.steps = this.orderTourService.getSteps()
  }

  // step logic
  private updateStepsStatus(step: StepModel) {
    this.syncToTripInfo();
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
    this.syncToTripInfo();
   //this.router.navigate([this.routerLinkContinue]);
    this.activeStep = +newActiveStep;
  }

  syncToTripInfo() {
    try{
      this.squadAssemble.tripInfo.tripDescription = this.squadAssemble.formsArray[3].get('tripDescription').value;
      var center = this.squadAssemble.formsArray[3].get('centerField').value;
      this.squadAssemble.tripInfo.centerField = this.tripService.fieldForestCentersOriginal.filter((el: { id: number; }) => el.id === parseInt(center))[0];
      this.squadAssemble.tripInfo.centerField.linkSite='';
      this.squadAssemble.tripInfo.tripEnding = this.squadAssemble.formsArray[3].get('tripEnding').value;
      this.tripService.sleepingDates.till= this.squadAssemble.tripInfo.tripEnding;
      this.squadAssemble.tripInfo.tripStart = this.squadAssemble.formsArray[3].get('tripStart').value;
      this.tripService.sleepingDates.from= this.squadAssemble.tripInfo.tripStart;
      var customer = this.squadAssemble.formsArray[2].get('customer').value;
      this.squadAssemble.tripInfo.customer = this.tripService.customersOriginal.filter(el => el.id === parseInt(customer))[0];
      this.squadAssemble.tripInfo.contactName = this.squadAssemble.formsArray[2].get('contact').get('contactName').value;
      this.squadAssemble.tripInfo.contactPhone = this.squadAssemble.formsArray[2].get('contact').get('contactPhone').value;
      this.squadAssemble.tripInfo.contactEmail = this.squadAssemble.formsArray[2].get('contact').get('contactEmail').value;
      var ageGroup = this.squadAssemble.formsArray[1].get('ageGroup').value;
      this.squadAssemble.tripInfo.ageGroup = this.tripService.ageGroupOriginal.filter(el => el.id === parseInt(ageGroup))[0];
      if(this.squadAssemble.formsArray[1].get('numAdultAndYoung').value)
      this.squadAssemble.tripInfo.numAdultAndYoung = +this.squadAssemble.formsArray[1].get('numAdultAndYoung').value;
      if (this.squadAssemble.formsArray[1].get('numDrivers').value)
      this.squadAssemble.tripInfo.numDrivers = +this.squadAssemble.formsArray[1].get('numDrivers').value;
      if(this.squadAssemble.formsArray[1].get('numAccompanied').value)
      this.squadAssemble.tripInfo.numAccompanied = +this.squadAssemble.formsArray[1].get('numAccompanied').value;
      if(this.squadAssemble.formsArray[1].get('numGuides').value)
      this.squadAssemble.tripInfo.numGuides = +this.squadAssemble.formsArray[1].get('numGuides').value;
      if(this.squadAssemble.formsArray[1].get('numAccompaniedAndGuide').value)
      this.squadAssemble.tripInfo.numAccompaniedAndGuide = +this.squadAssemble.formsArray[1].get('numAccompaniedAndGuide').value;
      this.squadAssemble.tripInfo.commentManager = this.squadAssemble.formsArray[0].get('commentManager').value;
      this.squadAssemble.tripInfo.insideCenterFieldId = parseInt(this.squadAssemble.formsArray[0].get('insideCenterFieldId').value);
      this.squadAssemble.tripInfo.departmentId = parseInt(this.squadAssemble.formsArray[0].get('departmentId').value);
      var attribute = this.squadAssemble.formsArray[0].get('attribute').value;
      this.squadAssemble.tripInfo.attribute = this.tripService.attributesOriginal.filter(el => el.id === parseInt(attribute))[0];
       var activityType =  this.squadAssemble.formsArray[0].get('activityType').value;
       this.squadAssemble.tripInfo.activity = this.tripService.activityByAttributeOriginal.filter(el => el.id === parseInt(activityType))[0];
      }
      catch(error){
        console.log(error);
      }      
  
     console.log(this.squadAssemble.tripInfo);
  }

}
