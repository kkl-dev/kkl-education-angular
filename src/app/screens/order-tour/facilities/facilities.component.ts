import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivitiesCardInterface } from 'src/app/components/activities-card/activities-card.component';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
import { FacilitiesService } from 'src/app/services/facilities.service';
import { InfoCard } from '../../education-results/education-results.component';
import { INITIAL_EVENTS } from './calendar/event-utils';
import { EventInput } from '@fullcalendar/angular';
import { ACTIVITIES_ARRAY, FACILITIES_ARRAY, FORM_ARRAY, UP_COMING_ACTIVITIES_ARRAY } from 'src/mock_data/facilities';

@Component({
  selector: 'app-facilities',
  templateUrl: './facilities.component.html',
  styleUrls: ['./facilities.component.scss']
})

export class FacilitiesComponent implements OnInit {
  public eventsArr: EventInput[] = [...INITIAL_EVENTS];
  public closeModal$: Observable<string>;
  public selectedFacility$: Observable<InfoCard>;
  public selectedActivity$: Observable<ActivitiesCardInterface>;
  public calendarEventsArr$: Observable<EventInput[]>;
  public timesArray: Array<string | number> = [];
  public hiddenElements: any = { facilities: false, activities: false };
  public colors = { green: '#37C56B', blue: '#448ECD' }
  public activityIsUpComing: boolean = false;
  //data 
  public formArray: QuestionBase<string | number>[] = FORM_ARRAY;
  public facilitiesArray: InfoCard[] = FACILITIES_ARRAY;
  public activitiesArray: ActivitiesCardInterface[] = ACTIVITIES_ARRAY;
  public upComingActivitiesArray: ActivitiesCardInterface[] = UP_COMING_ACTIVITIES_ARRAY;

  constructor(private facilitiesService: FacilitiesService) { }

  ngOnInit() {
    this.fillTimes();
    this.calendarEventsArr$ = this.facilitiesService.getCalendarEventsArr();
    this.closeModal$ = this.facilitiesService.getCloseModalObs();
    this.selectedFacility$ = this.facilitiesService.getSelectedFacility();
    this.selectedActivity$ = this.facilitiesService.getSelectedActivity();
  }

  public addToCalendar(event: any): void {
    const tmpObj: EventInput = {
      id: `${this.eventsArr.length}`,
      title: event.title,
      start: event.start,
      end: event.end,
      backgroundColor: event.backgroundColor,
      borderColor: event.backgroundColor,
      textColor: 'black',
      editable: true,
      className: event.className,
      invitingCustomer: event.invitingCustomer,
      additions: event.additions,
      type: event.type
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
  public updateChosenFacility(args: InfoCard) {
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
