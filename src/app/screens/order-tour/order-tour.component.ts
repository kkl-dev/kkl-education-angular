import { StepperService } from './../../utilities/services/stepper.service';
import { OrderTourService } from './../../utilities/services/order-tour.service';
import { AfterViewInit, Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject, Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { StepModel } from 'src/app/utilities/models/step.model';
import { SquadAssembleService } from './squad-assemble/services/squad-assemble.service';
import { TripService } from 'src/app/services/trip.service';
import { ActivitiesService, UserService } from 'src/app/open-api';
import { Location } from '@angular/common';
import { AdditionsService } from './additions/services/additions.service';
import { ConfirmDialogComponent } from 'src/app/utilities/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FacilitiesService } from 'src/app/services/facilities.service';
import { FacilitiesConvertingService } from 'src/app/services/facilities-converting.service';
import { UserDataService } from 'src/app/services/user-data.service';


@Component({
  selector: 'app-order-tour',
  templateUrl: './order-tour.component.html',
  styleUrls: ['./order-tour.component.scss'],
  providers: [StepperService],
})
export class OrderTourComponent implements OnInit, AfterViewInit, OnDestroy {
  public activeStep: number;

  public $activeStep = new Subject<number>();

  public nextPage: string = 'education/search';
  public prevPage: string = 'education/results';
  public hasSave: boolean;

  public currentRoute: string;
  public sleepStatus: boolean;

  public steps: StepModel[];
  public currentStep: StepModel;
  addOrderSub: Subscription;
  createActivitiesSub: Subscription;

  constructor(
    private router: Router,
    private orderTourService: OrderTourService,
    private squadAssemble: SquadAssembleService,
    private tripService: TripService,
    private userService: UserService,
    private activitiyService: ActivitiesService,
    private location: Location,
    private route: ActivatedRoute,
    private additionsService: AdditionsService,
    private _dialog: MatDialog,
    private _facilitiesService: FacilitiesService,
    private _facilitiesConvertingService: FacilitiesConvertingService,
    private userDataService: UserDataService
  ) { }

  ngOnInit(): void {
    this.setOrderTourSteps();
    this.getCurrentUrl();
    this.subscribeToCurrentRoute();
    this.getActiveStep();
    this.setActiveStep();
    this.subscribeToNewClient();
}

  ngAfterViewInit() { }

  // SUBSCRIBE SECTION
  private subscribeToCurrentRoute() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.formatUrl(event.url);
        this.handleSleepStatus();
        this.getActiveStep();
        this.setActiveStep();
      });
  }

  private subscribeToNewClient() {
    this.orderTourService.getNewClientObs().subscribe((value: boolean) => {
      this.hasSave = value;
    });
  }

  // method to set initial steps array
  private setOrderTourSteps() {
    this.steps = this.orderTourService.getSteps();
  }

  // step logic
  private updateStepsStatus(step: StepModel) {
    if (step.label == 'לינה') {
      this.syncToTripInfo();
    }
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
    this.updateStepsStatus(this.currentStep);
  }

  // route url logic
  private getCurrentUrl() {
    this.formatUrl(this.router.url);
  }

  private formatUrl(url: string) {
    const path = url.split('/');
    this.currentRoute = path[3];
  }

  // LISTEN TO OUTPUT EVENTS
  public changeActiveStep(newActiveStep: number): void {
    this.activeStep = newActiveStep;
  }

  public onChangeStep(step: StepModel) {
    // just for test
    if (step.path == 'facilities') {
      this.createTrip(this.steps[2].path);
    }
    if (step.label == 'לינה') {
      let flag = this.syncToTripInfo();
      if (flag == false) {
        const dialogRef = this._dialog.open(ConfirmDialogComponent, {
          width: '500px',
          data: { message: 'נא מלא את שדות החובה בטופס', content: '', rightButton: 'ביטול', leftButton: 'המשך' }
        })
        step.path = 'squad-assemble';
        this.router.navigateByUrl(`/education/order-tour/${step.path}`)
        return;
      }
      else {
        if (this.tripService.isOneDayTrip) {
          step.path = "facilities";
        }
      }
    }
    this.router.navigateByUrl(`/education/order-tour/${step.path}`);
    this.updateStepsStatus(step);

  }

  public changeActiveStepBottomNavigation(newActiveStep: number): void {
    this.activeStep = +newActiveStep;
  }

  syncToTripInfo() {
    //let flagObj={flag:false,msg:''}
    let flag = false;
    let scheduleForm;
    let detalisForm;
    let ageGroupForm;
    let ContactForm;
    let budgetFlag;
    let customerFlag;
    try {
      let startDate;
      let endDate;
      for (let i = 0; i < this.squadAssemble.formsArray.length; i++) {
        if (this.squadAssemble.formsArray[i].controls.centerField) {
          console.log('I am schedule');
          if (this.squadAssemble.formsArray[i].status == 'INVALID') {
            console.log('schedule is invalid');
            scheduleForm = false;
            continue;
          }
          this.squadAssemble.tripInfo.tripDescription = this.squadAssemble.formsArray[i].get('tripDescription').value;
          var center = this.squadAssemble.formsArray[i].get('centerField').value;
          this.squadAssemble.tripInfo.centerField = this.tripService.fieldForestCentersOriginal.filter((el: { id: number; }) => el.id === parseInt(center))[0];
          this.tripService.centerFieldObj.next(this.squadAssemble.tripInfo.centerField);
          localStorage.setItem('centerFieldObj', JSON.stringify(this.squadAssemble.tripInfo.centerField));
          this.squadAssemble.tripInfo.centerField.linkSite = '';
          let areaId= +this.squadAssemble.formsArray[i].get('areaTrip').value;
          this.squadAssemble.tripInfo.areaTrip= this.squadAssemble.originalRegionList.find(i=> i.id=== areaId); 
          let tripDates = this.squadAssemble.formsArray[i].get('dates').value;
          let subTripDates = tripDates.split("-");
          startDate = subTripDates[0];
          let tripStartArr = startDate.split("/");
          let tripStart = tripStartArr[2] + '-' + tripStartArr[1] + '-' + tripStartArr[0];
          this.squadAssemble.tripInfo.tripStart = tripStart;
          endDate = subTripDates[1];
          let tripEndingArr = endDate.split("/");
          let tripEnding = tripEndingArr[2] + '-' + tripEndingArr[1] + '-' + tripEndingArr[0];
          this.squadAssemble.tripInfo.tripEnding = tripEnding;
          this.squadAssemble.tripInfo.commentManager = this.squadAssemble.formsArray[i].get('commentManager').value;
          let dates = { from: startDate, till: endDate }
          this.tripService.sleepingDates = dates;
          console.log('sleppingDates from orderTour is:', dates);
          scheduleForm = true;
        }
        if (this.squadAssemble.formsArray[i].controls.attribute) {

          console.log('I am details');
          if (this.squadAssemble.formsArray[i].status == 'INVALID') {
            console.log('schedule is invalid');
            detalisForm = false;
            continue;
          }
          this.squadAssemble.tripInfo.insideCenterFieldId = parseInt(this.squadAssemble.formsArray[i].get('insideCenterFieldId').value);
          //this.squadAssemble.tripInfo.departmentId = parseInt(this.squadAssemble.formsArray[i].get('departmentId').value);
          this.squadAssemble.tripInfo.departmentId = parseInt(this.squadAssemble.formsArray[i].get('department').value);

          // if ( this.squadAssemble.tripInfo.departmentId==1){
           
            let countryId= this.squadAssemble.formsArray[i].get('tripLocation').value;
            let countryObj;
            if (countryId != "900"){
               countryObj= this.tripService.countries.find(i=> i.id=== countryId);
            } 
            else{
              countryObj = {id: countryId ,name:'ישראל'};
            }
            this.squadAssemble.tripInfo.country= countryObj;
          // }
          var attribute = this.squadAssemble.formsArray[i].get('attribute').value;
          this.squadAssemble.tripInfo.attribute = this.tripService.attributesOriginal.filter(el => el.id === parseInt(attribute))[0];
          var activityType = this.squadAssemble.formsArray[i].get('activityType').value;
          this.squadAssemble.tripInfo.activity = this.tripService.activityByAttributeOriginal.filter(el => el.id === parseInt(activityType))[0];
          detalisForm = true;
        }

        if (this.squadAssemble.formsArray[i].controls.ageGroup) {
          console.log('I am ageGroup');
          if (this.squadAssemble.formsArray[i].status == 'INVALID') {
            console.log('schedule is invalid');
            ageGroupForm = false;
            continue;
          }
          var ageGroup = this.squadAssemble.formsArray[i].get('ageGroup').value;
          this.squadAssemble.tripInfo.ageGroup = this.tripService.ageGroupOriginal.filter(el => el.id === parseInt(ageGroup))[0];
          if (this.squadAssemble.formsArray[i].get('numAdultAndYoung').value)
             if(parseInt(this.squadAssemble.formsArray[i].get('numAdultAndYoung').value)>=0)
            this.squadAssemble.tripInfo.numAdultAndYoung = +this.squadAssemble.formsArray[i].get('numAdultAndYoung').value;
            else{
              this.squadAssemble.formsArray[i].get('numAdultAndYoung').setValue('');
              this.setDialogMessage('לא ניתן להזין מספר שלילי בשדה ילדים/מבוגרים');
              return false;
            }      
          if (this.squadAssemble.formsArray[i].get('numDrivers').value)
          if (parseInt(this.squadAssemble.formsArray[i].get('numDrivers').value)>=0)
            this.squadAssemble.tripInfo.numDrivers = +this.squadAssemble.formsArray[i].get('numDrivers').value;
            else{
              this.squadAssemble.formsArray[i].get('numDrivers').setValue('');
              this.setDialogMessage('לא ניתן להזין מספר שלילי בשדה מספר נהגים');
              return false;
            }      
          if (this.squadAssemble.formsArray[i].get('numAccompanied').value)
          if (parseInt(this.squadAssemble.formsArray[i].get('numAccompanied').value)>= 0)
            this.squadAssemble.tripInfo.numAccompanied = +this.squadAssemble.formsArray[i].get('numAccompanied').value;
            else{
              this.squadAssemble.formsArray[i].get('numAccompanied').setValue('');
              this.setDialogMessage('לא ניתן להזין מספר שלילי בשדה מספר מלווים');
              return false;
            }      
          if (this.squadAssemble.formsArray[i].get('numGuides').value)
          if (parseInt(this.squadAssemble.formsArray[i].get('numGuides').value) >= 0)
            this.squadAssemble.tripInfo.numGuides = +this.squadAssemble.formsArray[i].get('numGuides').value;
            else{
              this.squadAssemble.formsArray[i].get('numGuides').setValue('');
              this.setDialogMessage('לא ניתן להזין מספר שלילי בשדה מספר מדריכים');
              return false;
            }     
          // if(this.squadAssemble.formsArray[i].get('medics').value)
          // this.squadAssemble.tripInfo.numAccompaniedAndGuide = +this.squadAssemble.formsArray[i].get('medics').value;
          ageGroupForm = true;
        }
        if (this.squadAssemble.formsArray[i].controls.contactName) {
          console.log('I am contact');
          if (this.squadAssemble.formsArray[i].status == 'INVALID') {
            console.log('schedule is invalid');
            ContactForm = false;
            continue;
          }
          this.squadAssemble.tripInfo.contactName = this.squadAssemble.formsArray[i].get('contactName').value;
          this.squadAssemble.tripInfo.contactPhone = this.squadAssemble.formsArray[i].get('contactPhone').value;
          this.squadAssemble.tripInfo.contactEmail = this.squadAssemble.formsArray[i].get('contactEmail').value;
          ContactForm = true;
        }
      }
       if(this.tripService.budgetByParam.budget.isByCity==1 ){
         if(!this.tripService.budgetByParam.budget.cityId){
           flag =false;
           return flag;
         }
      }
      this.squadAssemble.tripInfo.budget = this.tripService.budgetByParam.budget;
      budgetFlag=true;
       this.squadAssemble.tripInfo.customer = this.squadAssemble.Customer;
       if (this.squadAssemble.tripInfo.customer.id != undefined)
       customerFlag= true;
      
       if(scheduleForm ==true && ContactForm ==true && ageGroupForm ==true && detalisForm==true && customerFlag==true && budgetFlag==true)
       flag=true
       else
       return flag;
      
      if(this.squadAssemble.payerCustomer.name!= undefined)
      this.squadAssemble.tripInfo.customerPay= this.squadAssemble.payerCustomer;
      let date = new Date()
      let year= date.getFullYear();
      let month= date.getMonth()+1;
      let day = date.getDate();
      let dateFormat= year+'-'+(month)+'-'+day;
      this.squadAssemble.tripInfo.generateTime=dateFormat;
       if(startDate==endDate ){
          this.tripService.isOneDayTrip=true;
           this.createTrip(this.steps[2].path);
       }
    }
    catch (error) {
      console.log(error);
      flag = false;
      return flag;
    }
    console.log('tripInfo obj is: ', this.squadAssemble.tripInfo);
    return flag;
  }


   public findInvalidControls(formName) {
        // const controls = this.AddCustomerForm.controls;
        // for (const name in controls) {
        //     if (controls[name].invalid) {
        //         invalid.push(name);
        //     }
        // }
        // return invalid;
    }





  createTrip(route) {

    if (this.squadAssemble.tripInfofromService != undefined ){
      this.router.navigateByUrl(
        `/education/order-tour/${route}`
      );
      return;
    }
  
    let tripInfo = this.squadAssemble.tripInfo;
    let obj = this.squadAssemble.filledNightsArray;
    tripInfo.lodgingReservation = obj;
    if (!this.tripService.isOneDayTrip) {
      tripInfo.lodgingReservation = obj;
      for (let i = 0; i < tripInfo.lodgingReservation.length; i++) {
        for (let j = 0; j < tripInfo.lodgingReservation[i].nightsCount.length; j++) {
          let dateFormat = tripInfo.lodgingReservation[i].nightsCount[j].date;
          let dateArray = dateFormat.split("/");
          dateFormat = dateArray[2] + '-' + dateArray[1] + '-' + dateArray[0];
          tripInfo.lodgingReservation[i].nightsCount[j].date = dateFormat;
        }
      }
    }
    else {
      tripInfo.lodgingReservation = [];
    }
    this.userService.createTrip(tripInfo).subscribe(res => {
      console.log('tripInfo from server is :', res);
      this.squadAssemble.tripInfofromService = res;
      localStorage.setItem('tripId',res.trip.id.toString());
      localStorage.setItem('tripInfofromService', JSON.stringify(this.squadAssemble.tripInfofromService));
      this.router.navigateByUrl(
        `/education/order-tour/${route}`
      );
    }, (err) => {
      console.log(err);
      const dialogRef = this._dialog.open(ConfirmDialogComponent, {
        width: '500px',
        data: { message: 'אירעה שגיאה בשמירת הטיול, נא פנה למנהל המערכת', content: '', rightButton: 'ביטול', leftButton: 'המשך' }
      })
    })
  }

  createTripActivities(route) {
    // this.router.navigateByUrl(
    //       `/education/order-tour/${route}`
    //     );
        ////  ------   yak del since it is being called in facilities
    //let userName = this.userDataService.user.name || 'שחר גל';
    let events = this._facilitiesService.calendarEventsArr.value;
    let eventsArr: any = this._facilitiesConvertingService.convertActivityForApi(events);
    this.createActivitiesSub = this.activitiyService.createTripActivities(eventsArr).subscribe(res => {
      console.log(res);
      this.router.navigateByUrl(
        `/education/order-tour/${route}`
      );
    }, (err) => {
      console.log(err);
      const dialogRef = this._dialog.open(ConfirmDialogComponent, {
        width: '500px',
        data: { message: 'אירעה שגיאה בשליחת הנתונים, נא פנה למנהל המערכת', content: '', rightButton: 'ביטול', leftButton: 'המשך' }
      })
    })
  }

  // AddOrder() {
  //   if (this.additionsService.orderList.length > 0) {
  //     this.addOrderSub = this.orderService.addOrder(4, this.additionsService.orderList).subscribe(res => {
  //       console.log(res);
  //     }, (err) => {
  //       console.log(err);
  //       const dialogRef = this._dialog.open(ConfirmDialogComponent, {
  //         width: '500px',
  //         data: { message: 'אירעה שגיאה בשמירת ההזמנה, נא פנה למנהל המערכת', content: '', rightButton: 'ביטול', leftButton: 'המשך' }
  //       })
  //     })
  //   }


  // }



  public changeActiveStepNextNavigation(): void {
    this.activeStep = +this.activeStep++;
    const routeIndex =
      this.steps.findIndex(
        (step) => step.path === this.route.snapshot.firstChild.routeConfig.path
      ) + 1;
    if (routeIndex < this.steps.length) {
      if (routeIndex == 1) {
        let flag = this.syncToTripInfo();
        if (flag == false ) {
          const dialogRef = this._dialog.open(ConfirmDialogComponent, {
            width: '500px',
            data: { message: 'נא מלא את שדות החובה בטופס', content: '', rightButton: 'ביטול', leftButton: 'המשך' }
          })
          this.router.navigateByUrl(
            `/education/order-tour/${this.steps[0].path}`
          );
          return;
        }
        else{
          if( this.tripService.isOneDayTrip==true)
          return;
        }
      }
      if (routeIndex == 2) {
        this.createTrip(this.steps[routeIndex].path);
        return;
      }
      if (routeIndex == 3) {
        if (this._facilitiesService.calendarEventsArr.value.length > 0) {
          this.createTripActivities(this.steps[routeIndex].path);
          return;
        }
      }
      // if (routeIndex === 4) this.AddOrder();
      this.router.navigateByUrl(
        `/education/order-tour/${this.steps[routeIndex].path}`
      );
    } else {
      console.log('last route navigate to next page');
      this.router.navigateByUrl(
        `/education/search`
      );
    }
  }
  public changeActiveStepPrevNavigation(): void {
    this.activeStep = +this.activeStep--;
    this.location.back();
  }

  setDialogMessage(message){
    const dialogRef = this._dialog.open(ConfirmDialogComponent, {
      width: '500px',
       data: { message: message, content: '', rightButton: 'ביטול', leftButton: 'המשך' }
     })

  }

  ngOnDestroy() {
    if (this.addOrderSub) { this.addOrderSub.unsubscribe(); }
    if (this.createActivitiesSub) { this.createActivitiesSub.unsubscribe(); }
  }
}

