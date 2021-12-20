//import { Component, OnInit } from '@angular/core';
//import { Observable } from 'rxjs';
import { ActivitiesCardInterface } from 'src/app/components/activities-card/activities-card.component';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
import { FacilitiesService } from 'src/app/services/facilities.service';
//import { InfoCard } from '../../education-results/education-results.component';
import { INITIAL_EVENTS } from './calendar/event-utils';
import { EventInput } from '@fullcalendar/angular';
import { ACTIVITIES_ARRAY, FACILITIES_ARRAY, FORM_ARRAY, UP_COMING_ACTIVITIES_ARRAY } from 'src/mock_data/facilities';
import { FacilitiesConvertingService } from 'src/app/services/facilities-converting.service';
import { ActivitiesService, UserService, OrderService } from 'src/app/open-api';
import { TripService } from 'src/app/services/trip.service';
import { QuestionSelect } from 'src/app/components/form/logic/question-select';
import { Validators } from '@angular/forms';
import { QuestionAutocomplete } from 'src/app/components/form/logic/question-autocomplete';
import { UserDataService } from 'src/app/services/user-data.service';
import { SquadAssembleService } from '../squad-assemble/services/squad-assemble.service';

import { Component, ComponentFactoryResolver, EmbeddedViewRef, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import timeGridPlugin from '@fullcalendar/timegrid';
//import { EventInput } from '@fullcalendar/angular';
import { Observable, Subscription } from 'rxjs';
//import { FacilitiesService } from 'src/app/services/facilities.service';
import heLocale from '@fullcalendar/core/locales/he';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarCardComponent } from './calendar/calendar-card/calendar-card.component';
import { DynamicComponent } from 'src/app/components/dynamic/dynamic.component';
//import { TripService } from 'src/app/services/trip.service';

@Component({
  selector: 'app-facilities',
  templateUrl: './facilities.component.html',
  styleUrls: ['./facilities.component.scss']
})

export class FacilitiesComponent implements OnInit {
  calenderArray = [];

  public eventsArr: EventInput[] = [...INITIAL_EVENTS];
  public closeModal$: Observable<string>;
  public selectedFacility$: Observable<any>;
  public selectedActivity$: Observable<ActivitiesCardInterface>;
  //public calendarEventsArr$: Observable<EventInput[]>;
  public timesArray: Array<string | number> = [];
  public hiddenElements: any = { facilities: false, activities: false };
  public colors = { green: '#37C56B', blue: '#448ECD' }
  public activityIsUpComing: boolean = false;
  formArray: QuestionBase<string | number>[];
  tripId: number = 0;
  // public formArray: QuestionBase<string | number>[] = FORM_ARRAY;
  // public facilitiesArray: InfoCard1[] = FACILITIES_ARRAY;
  // public upComingActivitiesArray: ActivitiesCardInterface[] = UP_COMING_ACTIVITIES_ARRAY;
  // public upComingActivitiesArray: any[];
  orderType: any;
  //createForm: any;
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
  mealArray: any[] = [
    {
      iconPath: 'restaurant.svg',
      name: 'ארוחת בוקר',
      itemId: 1,
      orderTypeCode: 4
    },
    {
      iconPath: 'roast-chicken.svg',
      name: 'ארוחת צהריים',
      itemId: 164,
      orderTypeCode: 4
    }, {
      iconPath: 'fruits.svg',
      name: 'ארוחת ערב',
      itemId: 3,
      orderTypeCode: 4
    }
  ];
  activitiesArray: any[] = [
    {
      iconPath: 'alarm.svg',
      name: 'השכמה',
      itemId: null
    },
    {
      iconPath: 'bus-with-flag.svg',
      name: 'התייצבות',
      itemId: null
    }
  ];

  activityList: any;
  tempOrderList: any;

  constructor(private facilitiesService: FacilitiesService, private usersService: UserService, private tripService: TripService,
    private activitiyService: ActivitiesService, private facilitiesConvertingService: FacilitiesConvertingService,
    private userDataService: UserDataService, private orderService: OrderService, private squadAssembleService: SquadAssembleService,
    private resolver: ComponentFactoryResolver) {
    //get sleeping Dates from trip service
    this.sleepingDates = this.tripService.convertDatesFromSlashToMinus();
    // add another day to last day
    let lastDay = new Date(this.days[this.days.length - 1].date);
    this.till = new Date(lastDay.setDate(lastDay.getDate() + 1));
  }

  ngOnInit(): void {
    try {
      this.tripId = this.squadAssembleService.tripInfofromService.trip.id;
    } catch (error) {
      console.log(error);
    }
    this.getAvailableFacilities();
    this.fillTimes();
    this.getAreas();
    this.getActivityCategories();
    this.getTripActivities();
    this.setFormArray();
    this.getOrderService();
    this.getTripCalendar();

    this.closeModal$ = this.facilitiesService.getCloseModalObs();
    this.selectedFacility$ = this.facilitiesService.getSelectedFacility();
    this.selectedActivity$ = this.facilitiesService.getSelectedActivity();

    this.calendarOptions = {
      plugins: [timeGridPlugin, interactionPlugin],
      initialView: 'timeGridDay',
      validRange: {
        start: this.sleepingDates.from,
        end: this.till
      },
      slotEventOverlap: false,
      allDaySlot: false,
      locales: [heLocale],
      selectable: true,
      titleFormat: { year: 'numeric', month: 'long', day: 'numeric' },
      eventTimeFormat: {
        hour: 'numeric',
        minute: '2-digit',
        meridiem: false
      },
      slotLabelFormat: {
        hour: 'numeric',
        minute: '2-digit',
        meridiem: false
      },
      headerToolbar: {
        left: 'prev,next',
        center: 'title',
        // right: 'timeGridDay,timeGridWeek,dayGridMonth'
        right: ''
      },
      initialEvents: [],
      eventClick: (info) => {
        this.facilitiesService.findObjectInCalendarArray(info.event.id);
      },
      eventDrop: (info) => {
        this.facilitiesService.updateTimesInArray(info.event.id, [this.arrangeDate(info.event.start), this.arrangeDate(info.event.end)]);
      },
      eventResize: (info) => {
        this.facilitiesService.updateTimesInArray(info.event.id, [this.arrangeDate(info.event.start), this.arrangeDate(info.event.end)]);
      },
      eventContent: (props) => {
        const factory = this.resolver.resolveComponentFactory(CalendarCardComponent);
        this.myDynamicComponent.viewContainerRef.clear();
        const componentRef = this.myDynamicComponent.viewContainerRef.createComponent(factory, 0);
        componentRef.instance.props = props;
        componentRef.changeDetectorRef.detectChanges();
        const html = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

        return { html: html.innerHTML };
      }
    }
  }

  getOrderService() {
    this.orderService.getOrderTypes().subscribe((orderType: any) => {
      console.log('order Type: ', orderType);
      if (orderType) {
        this.orderType = orderType;
      }
    },
      error => {
        console.log("error in get Order Types : ", { error });
      });
  }

  private setFormArray() {
    // console.log('this.tripActivitiesShow: ', this.tripActivitiesShow)
    this.formArray = [
      //// not in use for now
      // new QuestionSelect({
      //   key: 'durationOfActivity',
      //   label: 'משך פעילות',
      //   validations: [Validators.required],
      //   inputProps: { options: [{ label: 'אירוח', value: '2' }] }
      // }),
      new QuestionSelect({
        key: 'areas',
        label: 'אזור',
        // validations: [Validators.required],
        inputProps: { options: this.areas }
      }),
      new QuestionSelect({
        key: 'typeOfActivity',
        label: 'סוג פעילות',
        // validations: [Validators.required],
        inputProps: { options: this.activityCategories }
      }),
      new QuestionAutocomplete({
        key: 'activity',
        label: 'חפש פעילות',
        cols: 1,
        value: '',
        // validations: [Validators.required],
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
          this.areas.push({ label: element.name, value: element.id.toString() });
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
      let tripActivitiesConverted = this.facilitiesConvertingService.convertTripActivities(res);
      // console.log('tripActivitiesConverted: ', tripActivitiesConverted);
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
    this.facilitiesArray = this.tripService.facilitiesArray[0].facilitiesList;
    this.facilitiesArray.map(n => { n.orderTypeCode = 7 });
  }

  logForm(form) {
    console.log("facility - form: ", form);
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
    //for autocmplete filter
    if (obj.activity) {
      tripActivities = tripActivities.filter((a: any) =>
        //a.name == obj.activity);
        a.activityId == obj.activity);

      if (tripActivities == []) {
        console.log('tripActivities emty must use auto complete: ')
      }
    }

    this.tripActivitiesFilter = tripActivities;
    this.tripActivitiesInfo = tripActivities;
    this.tripActivitiesShow = [];
    this.tripActivitiesFilter.forEach(element => {
      this.tripActivitiesShow.push({ label: element.name, value: element.activityId.toString() })
    });
    //console.log('this.tripActivitiesShow: ', this.tripActivitiesShow)
    this.setFormArray();
    this.calculatePages(this.tripActivitiesFilter.length);
    this.pagesToShow(1);
  }

  newPageEmit(page) {
    //console.log("page: ", page);
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
    if (this.tripActivitiesFilter.length > 6) {
      this.tripActivitiesInfo = this.tripActivitiesFilter.slice(page - 1, page + 5);
    } else {
      this.tripActivitiesInfo = this.tripActivitiesFilter;
    }
    console.log("tripActivitiesInfo: ", this.tripActivitiesInfo);
    // this.tripActivitiesInfo = this.tripActivitiesInfoTotal;
    //console.log("tripActivitiesInfo: ", this.tripActivitiesInfo);
  }

  updateTrip() {
    //let userInfo = this.userDataService.user.name || 'שחר גל';
    let events: any = this.eventsArr;
    this.activitiyService.updateTripActivities(events).subscribe((tripCalendar: any) => {
      //console.log('update Trip Activities: ', tripCalendar);
      if (tripCalendar) {
        //....
      }
    },
      error => {
        console.log("error: ", { error });
      });
  }

  getTripCalendar() {
    this.facilitiesService.calendarEventsArr.next([]);

    this.activitiyService.getTripCalendar(this.tripId).subscribe((tripCalendar: any) => {
      console.log('get Trip Calendar: ', tripCalendar);
      //if (tripCalendar) {
      this.activityList = tripCalendar.activityList;
      this.tempOrderList = tripCalendar.tempOrderList;
      let newTempOrderObj: any;
      let newTempActivityList: any;

      console.log("calendarEventsArr value 2", this.facilitiesService.calendarEventsArr.value);

      // add to calender
      for (let i = 0; i < this.tempOrderList.length; i++) {
        //console.log('this.tempOrderList no. ' + i + ": ", this.tempOrderList[i]);
        newTempOrderObj = this.facilitiesConvertingService.convertTempOrderListfromTripCalendarApi(this.tempOrderList[i]);

        this.addToCalendar(newTempOrderObj, true);
        this.calenderArray.push(newTempOrderObj);
      }

      for (let i = 0; i < this.activityList.length; i++) {
        //console.log('this.activityList no. ' + i + ": ", this.activityList[i]);
        newTempActivityList = this.facilitiesConvertingService.convertActivityListfromTripCalendarApi(this.activityList[i]);
        // if(newTempActivityList.title) {
        this.addToCalendar(newTempActivityList, true);
        this.calenderArray.push(newTempActivityList);
        //}
      }
      console.log('calenderArray', this.calenderArray);

      // if (this.myCalendarComponent) {
      //   this.myCalendarComponent.options.events = this.calenderArray;
      // } else {
      //   setTimeout(() => {
      //     this.myCalendarComponent.options.events = this.calenderArray;
      //   }, 500);
      // }
      this.valueSub = this.facilitiesService.getCalendarEventsArr().subscribe(value => {
        console.log('getCalendarEventsArr: ', value);
        if (this.myCalendarComponent) {
          this.myCalendarComponent.options.events = value;
          //send info to api
        } else {
          setTimeout(() => {
            this.myCalendarComponent.options.events = value;
          }, 500);
        }
      });

      //}
    },
      error => {
        console.log("error: ", { error });
      });
  }

  calculatePages(num) {
    //console.log("num: ", num);
    var quotient = Math.floor(num / 6);
    var remainder = num % 6;
    this.pagesAmount = quotient + remainder;
  }

  addToCalendar(event: any, fromTripCalendarApi: boolean): void {
    //console.log("addToCalendar: ", event);
    let isEditable: boolean = (event.orderId) ? false : true;
    const tmpObj: EventInput = {
      id: `${this.eventsArr.length}`,
      textColor: 'black',
      editable: isEditable,
    }

    for (const property in event) {
      tmpObj[property] = event[property];
    }
    this.eventsArr.push(tmpObj);
    this.facilitiesService.updateCalendarEventsArr(tmpObj, fromTripCalendarApi);
  }

  openModal(args: string): void {
    this.facilitiesService.closeModal(args);
    console.log('openModal args: ' + args);
  }

  public fillTimes(): void {
    for (let i = 0; i < 24; i++) {
      i < 10 ? this.timesArray.push(`0${i}:00`) : this.timesArray.push(`${i}:00`);
    }
  }

  public updateChosenFacility(args: any) {
    console.log('updateChosenFacility args', args)
    this.facilitiesService.updateSelectedFacility(args);
  }

  public updateChosenUpComingActivity(args: ActivitiesCardInterface) {
    console.log('update ChosenUp Coming Activity args' + args);
    this.activityIsUpComing = true;
    this.facilitiesService.updateSelectedActivity(args);
  }

  public updateChosenActivity(args: ActivitiesCardInterface) {
    console.log('update Chosen Activity args' + args);
    this.activityIsUpComing = false;
    this.facilitiesService.updateSelectedActivity(args);
  }

  onOptionSelected(e: any) {
    console.log('onOptionSelected - e', e);
  }


  //calender c 
  @ViewChild('calendar') myCalendarComponent: FullCalendarComponent;
  @ViewChild('dynamic', { read: DynamicComponent }) myDynamicComponent: DynamicComponent;
  value!: EventInput[];
  valueSub: Subscription;
  hideComponent: boolean = false;
  sleepingDates: any = [];
  days: any[] = this.tripService.facilitiesArray;
  till: any;
  calendarOptions: CalendarOptions = {}


  arrangeDate(date: Date) {
    // 2021-10-15T08:00
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}T${hours <= 9 ? '0' + hours : hours}:${minutes <= 9 ? '0' + minutes : minutes}`
  }

}