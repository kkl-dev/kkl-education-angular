import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivitiesCardInterface } from 'src/app/components/activities-card/activities-card.component';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
import { FacilitiesService } from 'src/app/services/facilities.service';
import { InfoCard } from '../../education-results/education-results.component';
import { INITIAL_EVENTS } from './calendar/event-utils';
import { EventInput } from '@fullcalendar/angular';
import { ACTIVITIES_ARRAY, FACILITIES_ARRAY, FORM_ARRAY, UP_COMING_ACTIVITIES_ARRAY } from 'src/mock_data/facilities';
import { QuestionSelect } from 'src/app/components/form/logic/question-select';
import { QuestionAutocomplete } from 'src/app/components/form/logic/question-autocomplete';
import { Validators } from '@angular/forms';
import { ActivitiesService, Area, UserService } from 'src/app/open-api';
import { TripService } from 'src/app/services/trip.service';

export interface InfoCard1 {
  svgUrl: string;
  title?: string;
  headline?: string;
  subHeadline?: string;
  availability?: TooltipDataModel1[];
  maxParticipants?: string;
  days?: any[];
}

export interface TooltipDataModel1 {
  startingHour: number;
  endingHour: number;
  totalTime: number;
  user: string;
}

@Component({
  selector: 'app-facilities',
  templateUrl: './facilities.component.html',
  styleUrls: ['./facilities.component.scss']
})

export class FacilitiesComponent implements OnInit {
  public eventsArr: EventInput[] = [...INITIAL_EVENTS];
  public closeModal$: Observable<string>;
  public selectedFacility$: Observable<InfoCard1>;
  public selectedActivity$: Observable<ActivitiesCardInterface>;
  public calendarEventsArr$: Observable<EventInput[]>;
  public timesArray: Array<string | number> = [];
  public hiddenElements: any = { facilities: false, activities: false };
  public colors = { green: '#37C56B', blue: '#448ECD' }
  public activityIsUpComing: boolean = false;
  //data 
  formArray: QuestionBase<string | number>[];
  // public formArray: QuestionBase<string | number>[] = FORM_ARRAY;
  // public facilitiesArray: InfoCard1[] = FACILITIES_ARRAY;
  // public activitiesArray: ActivitiesCardInterface[] = ACTIVITIES_ARRAY;
  // public upComingActivitiesArray: ActivitiesCardInterface[] = UP_COMING_ACTIVITIES_ARRAY;
  // public activitiesArray: any[];
  // public upComingActivitiesArray: any[];

  facilityForDay: any;
  facilitiesArray: any;
  tripActivities: any = [];
  tripActivitiesShow: any = [];
  tripActivitiesFilter: any = [];
  tripActivitiesInfoTotal: any = [];
  tripActivitiesInfo: any = [];
  pagesAmount: any = 5;
  areas: any = [];
  activityCategories: any = [];
  activitiesArray: any[] = [
    {
      iconPath: 'fruits.svg',
      name: 'ארוחת ערב',
    },
    {
      iconPath: 'roast-chicken.svg',
      name: 'ארוחת צהריים',
    },
    {
      iconPath: 'restaurant.svg',
      name: 'ארוחת בוקר',
    },
    {
      iconPath: 'alarm.svg',
      name: 'השכמה',
    },
    {
      iconPath: 'bus-with-flag.svg',
      name: 'התייצבות',
    },
    {
      iconPath: 'fruits.svg',
      name: 'ארוחת ערב',
    },
    {
      iconPath: 'alarm.svg',
      name: 'השכמה',
    },
  ];

  constructor(private facilitiesService: FacilitiesService, private usersService: UserService, private tripService: TripService,
    private activitiyService: ActivitiesService) { }

  ngOnInit(): void {
    this.getAvailableFacilities();
    this.fillTimes();
    this.getAreas();
    this.getActivityCategories();
    this.getTripActivities();
    this.setFormArray();

    this.calendarEventsArr$ = this.facilitiesService.getCalendarEventsArr();	
    this.closeModal$ = this.facilitiesService.getCloseModalObs();	
    this.selectedFacility$ = this.facilitiesService.getSelectedFacility();	
    this.selectedActivity$ = this.facilitiesService.getSelectedActivity();	

  }

  private setFormArray() {
   // console.log('this.tripActivitiesShow: ', this.tripActivitiesShow)
    this.formArray = [
      new QuestionSelect({
        key: 'durationOfActivity',
        label: 'משך פעילות',
        validations: [Validators.required],
        inputProps: { options: [{ label: 'אירוח', value: '2' }] }
      }),
      new QuestionSelect({
        key: 'areas',
        label: 'אזור',
        validations: [Validators.required],
        inputProps: { options: this.areas }
      }),
      new QuestionSelect({
        key: 'typeOfActivity',
        label: 'סוג פעילות',
        validations: [Validators.required],
        inputProps: { options: this.activityCategories }
      }),
      new QuestionAutocomplete({
        key: 'activity',
        label: 'חפש פעילות',
        cols: 1,
        value: '',
        validations: [Validators.required],
        inputProps: {
          options: this.tripActivitiesShow
        },
      }),
    ];
  }

  getAreas() {
    this.usersService.getAreas().subscribe((areas: any) => {
      console.log('getAreas: ', areas);
      if (areas) {
        areas.forEach(element => {
          this.areas.push({ label: element.name, value: element.id.toString() })
        });
      }
    },
      error => {
        console.log("error: ", { error });
      });
  }

  getActivityCategories() {
    this.activitiyService.getActivityCategories().subscribe((res) => {
      res.forEach(element => {
        this.activityCategories.push({ label: element.name, value: element.id.toString() })
      });
    },
      error => {
        console.log("error: ", { error });
      });
  }

  getTripActivities() {
    this.activitiyService.getTripActivities().subscribe(res => {
      console.log("get Trip Activities res: ", { res });
      this.calculatePages(res.length);
      this.tripActivitiesInfoTotal = res;
      this.tripActivitiesFilter = res;
      this.pagesToShow(1);
      // this.pagesAmount = res.length + 1
      res.forEach(element => {
        //this.tripActivities.push({ label: element.name, value: element.activityId.toString() })
        this.tripActivitiesShow.push({ label: element.name, value: element.activityId.toString() })
      });
    })
  }

  getAvailableFacilities() {
    //let sleepingDates = this.tripService.convertDatesFromSlashToMinus();  
    //temp fixed dates and place
    this.usersService.getAvailableFacilities(1, '2021-10-20', '2021-10-21').subscribe((facilities: any) => {
      console.log('get Available Facilities: ', facilities);
      if (facilities) {
        //this.activitiesArray = facilities;
        this.facilitiesArray = facilities[0].facilitiesList;
        //this.tripService.setfacilitiesArray(facilities);
        console.log('facility For Day: ', this.facilitiesArray);
      }
    },
      error => {
        console.log("error: ", error);
      });
  }

  logForm(form) {
    console.log("form: ", form);
    let obj = form.value;
    let tripActivities = this.tripActivitiesInfoTotal;
    if (obj.areas) {
      tripActivities = tripActivities.filter(a =>
        a.regionId == obj.areas);
    } 
    if (obj.typeOfActivity) {
      tripActivities = tripActivities.filter((a: { activityId: any; }) =>
        a.activityId == obj.typeOfActivity);
    }
    this.tripActivitiesFilter = tripActivities;
    this.tripActivitiesInfo = tripActivities;
    this.tripActivitiesShow = [];
    this.tripActivitiesFilter.forEach(element => {
      this.tripActivitiesShow.push({ label: element.name, value: element.activityId.toString() })
    });
    console.log('this.tripActivitiesShow: ', this.tripActivitiesShow)
    this.setFormArray();
    this.calculatePages(this.tripActivitiesFilter.length);
    this.pagesToShow(1);
  }

  newPageEmit(page) {
    console.log("page: ", page);
    if (page == 1) {
      this.pagesToShow(1);
    } else {
      page--;
      let pagesToShow = page * 6;
      pagesToShow++
      this.pagesToShow(pagesToShow);
    }
  }

  pagesToShow(page: any) {
    // this.tripActivitiesInfo = this.tripActivitiesInfoTotal.slice(page - 1, page + 5);
    if (this.tripActivitiesFilter.length > 6) {
      this.tripActivitiesInfo = this.tripActivitiesFilter.slice(page - 1, page + 5);
    } else {
      this.tripActivitiesInfo = this.tripActivitiesFilter;
    }
    console.log("tripActivitiesInfo: ", this.tripActivitiesInfo);
    // this.tripActivitiesInfo = this.tripActivitiesInfoTotal;
    // console.log("tripActivitiesInfo: ", this.tripActivitiesInfo );
  }

  calculatePages(num) {
    //this.pagesAmount = num / 6;
    console.log("num: ", num);
    var quotient = Math.floor(num / 6);
    var remainder = num % 6;
    this.pagesAmount = quotient + remainder;
  }

  public addToCalendar(event: any): void {
    console.log("addToCalendar: ", event);

    const tmpObj: EventInput = {
      id: `${this.eventsArr.length}`,
      textColor: 'black',
      editable: true,
    }
    for (const property in event) {
      tmpObj[property] = event[property];
    }
    this.eventsArr.push(tmpObj);
    this.facilitiesService.updateCalendarEventsArr(tmpObj);
  }

  public openModal(args: string): void {
    this.facilitiesService.closeModal(args);
  }

  public fillTimes(): void {
    for (let i = 0; i < 24; i++) {
      i < 10 ? this.timesArray.push(`0${i}:00`) : this.timesArray.push(`${i}:00`);
    }
  }

  public updateChosenFacility(args: InfoCard1) {
    this.facilitiesService.updateSelectedFacility(args);
  }

  public updateChosenUpComingActivity(args: ActivitiesCardInterface) {
    this.facilitiesService.updateSelectedActivity(args);
    this.activityIsUpComing = true;
  }

  public updateChosenActivity(args: ActivitiesCardInterface) {
    this.activityIsUpComing = false;
    this.facilitiesService.updateSelectedActivity(args);
  }
  // arrays
  public timeLineArray: Array<object> = [
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
}