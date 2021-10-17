import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Validators, FormControl } from '@angular/forms';
import { ActivitiesCardInterface } from 'src/app/components/activities-card/activities-card.component';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
import { QuestionSelect } from 'src/app/components/form/logic/question-select';
import { QuestionTextbox } from 'src/app/components/form/logic/question-textbox';
import { InfoCard } from '../../education-results/education-results.component';
import { TripService } from 'src/app/services/trip.service';
import { FakeService } from 'src/app/services/fake.service';
import { UserService } from 'src/app/open-api/api/user.service';
import { ActivitiesService } from 'src/app/open-api/api/activities.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FacilitiesService } from './services/facilities.service';


@Component({
  selector: 'app-facilities',
  templateUrl: './facilities.component.html',
  styleUrls: ['./facilities.component.scss']
})

export class FacilitiesComponent implements OnInit, AfterViewInit {

  @Input() public control: FormControl;


  timesArray: Array<string | number> = [];
  hiddenElements: any = { facilities: false, activities: false };
  facilityForDay: any;
  tripActivities?: any;
  areas?: any = [{
    "lable": 11,
    "value": "גולן, עמק החולה"  }];
  activityCategories?: any;

  colors = { green: '#37C56B', blue: '#448ECD' }
  // arrays
  timeLineArray: Array<object> = [
    {
      title: 'ארוחת צהריים', startTime: '12:00', endTime: '13:00',
      iconSrc: 'assets/images/roast-chicken.svg', color: this.colors.green
    },
    {
      title: 'מטבח שדה', startTime: '12:00', endTime: '13:00',
      iconSrc: 'assets/images/kitchen.svg', color: this.colors.blue
    },
    {
      title: 'התייצבות', startTime: '10:00', endTime: '11:00',
      iconSrc: 'assets/images/finish-flag-1.svg', color: this.colors.green, secondIcon: 'bus'
    },
  ];
  // formArray: any = this.facilitiesService.formArray;
  formArray?: QuestionBase<string | number>[] = []



  facilitiesArray: any = [{
    "date": "2021-09-10T:00:00:00",
    "facilitiesList": []
  }];

  // activitiesArray: InfoCard[] = [
  activitiesArray: any[] = [
    {
      iconPath: 'assets/images/fruits.svg',
      name: 'ארוחת ערב',
    },
    {
      iconPath: 'assets/images/roast-chicken.svg',
      name: 'ארוחת צהריים',
    },
    {
      iconPath: 'assets/images/restaurant.svg',
      name: 'ארוחת בוקר',
    },
    {
      iconPath: 'assets/images/alarm.svg',
      name: 'השכמה',
    },
    {
      iconPath: 'assets/images/bus-with-flag.svg',
      name: 'התייצבות',
    },
    {
      iconPath: 'assets/images/fruits.svg',
      name: 'ארוחת ערב',
    },
    {
      iconPath: 'assets/images/alarm.svg',
      name: 'השכמה',
    },
  ];
  upComingActivitiesArray: ActivitiesCardInterface[] = [
    { img: "assets/images/img-1.png", title: "ניווט יערני במחנה", content: "על הפעילות הסבר על הפעילות הסבר על הפעילות הסבר על הפעילות", hours: 1.5 },
    { img: "assets/images/img-2.png", title: "סולמות וחבלים בין העצים", content: "על הפעילות הסבר על הפעילות הסבר על הפעילות הסבר על הפעילות", hours: 3 },
    { img: "assets/images/img-3.png", title: "יום עיון והשתלמות", content: "על הפעילות הסבר על הפעילות הסבר על הפעילות הסבר על הפעילות", hours: 5 },
    { img: "assets/images/img-1.png", title: "ניווט יערני במחנה", content: "על הפעילות הסבר על הפעילות הסבר על הפעילות הסבר על הפעילות", hours: 1.5 },
    { img: "assets/images/img-2.png", title: "סולמות וחבלים בין העצים", content: "על הפעילות הסבר על הפעילות הסבר על הפעילות הסבר על הפעילות", hours: 3 },
    { img: "assets/images/img-3.png", title: "יום עיון והשתלמות", content: "על הפעילות הסבר על הפעילות הסבר על הפעילות הסבר על הפעילות", hours: 5 },
  ];

  constructor(private usersService: UserService, private tripService: TripService, private api: FakeService,
    private activitiesService: ActivitiesService, private facilitiesService: FacilitiesService) { }

  ngAfterViewInit(): void {}
  ngOnInit(): void {

    this.formArray = [
      new QuestionSelect({
        key: 'durationOfActivity',
        label: 'משך פעילות',
        validations: [Validators.required],
        inputProps: { options: [{ label: 'גולן, עמק החולה', value: '11' }, { label: 'גjsdfk df', value: '12' }] }
      }),
      new QuestionSelect({
        key: 'areas',
        label: 'אזור',
        inputProps: { options: this.areas },
        validations: [Validators.required]
      }),
      new QuestionSelect({
        key: 'typeOfActivity',
        label: 'סוג פעילות',
        validations: [Validators.required],
        inputProps: { options: [{ label: '', value: '' }] }
      }),
      new QuestionTextbox({
        key: 'search',
        label: 'חפש פעילות',
        value: '',
        validations: [Validators.required]
      }),
    ];
    
    console.log("trip service: ", this.tripService);

    // del temp fixed dates and place
    // this.facilitiesArray = this.tripService.facilitiesArray;
    // this.facilityForDay = this.facilitiesArray[0].facilitiesList;
    this.getAvailableFacilities();
    this.fillTimes();
    this.getAreas();
    this.getActivityCategories();
    this.getTripActivities();
  }


  getAreas() {
    this.usersService.getAreas().subscribe((areas: any) => {
      console.log('get areas: ', areas);
      this.areas = [];
      areas.forEach(element => {
        this.areas.push({ label: element.name, value: element.id });
      });
      console.log('get areas 2: ', this.areas);

      //this.facilitiesService.formArray[1].inputProps = this.areas;
      //this.formArray = this.facilitiesService.formArray[1].inputProps;
       this.formArray[1].inputProps = this.areas;


      // console.log(this.formArray)
    },
      error => {
        console.log("error: ", { error });
      });
  }

  getActivityCategories() {
    this.activitiesService.getActivityCategories().subscribe((activityCategories: any) => {
      console.log('get activity Categories: ', activityCategories);
      this.activityCategories = [];
      activityCategories.forEach(element => {
        this.activityCategories.push({ label: element.name, value: element.id });
      });
      console.log('get activity Categories 2: ', activityCategories);

    },
      error => {
        console.log("error: ", { error });
      });
  }

  getTripActivities() {
    this.activitiesService.getTripActivities().subscribe((tripActivities: any) => {
      console.log('get tripActivities: ', tripActivities);
      this.tripActivities = [];
      tripActivities.forEach(element => {
        this.tripActivities.push({ label: element.name, value: element.id });
      });
      console.log('get tripActivities2: ', tripActivities);

    },
      error => {
        console.log("error: ", { error });
      });
  }

  getAvailableFacilities() {
    //let sleepingDates = this.tripService.convertDatesFromSlashToMinus();  
    //temp fixed dates and place
    this.usersService.getAvailableFacilities(1, '2021-10-10', '2021-10-12').subscribe((facilities: any) => {
      console.log('get Available Facilities: ', facilities);
      if (facilities) {
        this.facilitiesArray = facilities;
        this.facilityForDay = facilities[0].facilitiesList;
        this.tripService.setfacilitiesArray(facilities);
        console.log('facility For Day: ', this.facilityForDay);
      }
    },
      error => {
        console.log("error: ", { error });
      });
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent) {
    //this.optionSelected.emit(event)
    console.log({ event })
  }


  fillTimes(): void {
    for (let i = 0; i < 24; i++) {
      i < 10 ? this.timesArray.push(`0${i}:00`) : this.timesArray.push(`${i}:00`);
    }
  }
}
