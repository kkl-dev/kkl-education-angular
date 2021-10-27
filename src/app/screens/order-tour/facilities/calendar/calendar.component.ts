import { Component, ComponentRef, Input, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import timeGridPlugin from '@fullcalendar/timegrid';
import { EventInput } from '@fullcalendar/angular';
import { Observable, Subscription } from 'rxjs';
import { FacilitiesService } from 'src/app/services/facilities.service';
import heLocale from '@fullcalendar/core/locales/he';
import interactionPlugin from '@fullcalendar/interaction';
import { h, render } from 'preact';
import { TripService } from 'src/app/services/trip.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  public calendarEventsArr$!: Observable<EventInput[]>;
  public value!: EventInput[];
  public valueSub: Subscription;
  @ViewChild('calendar') myCalendarComponent: FullCalendarComponent;
  @ViewChild('calendarEventCard', { read: TemplateRef }) eventCard: TemplateRef<any>;

  //sleepingDates = this.tripService.sleepingDates;
  sleepingDates: any = [];
  days: any[] = this.tripService.facilitiesArray;

  constructor(private facilitiesService: FacilitiesService, private vref: ViewContainerRef, private tripService: TripService) { }

  public calendarOptions: CalendarOptions = {}

  public arrangeDate(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}T${hours <= 9 ? '0' + hours : hours}:${minutes <= 9 ? '0' + minutes : minutes}`
  }

  ngOnInit(): void {
    //get sleeping Dates from trip service
    this.sleepingDates = this.tripService.convertDatesFromSlashToMinus();
    // add another day to last day
    let lastDay = new Date(this.days[this.days.length - 1].date);
    let till = new Date(lastDay.setDate(lastDay.getDate() + 1));
    //console.log(till);

    this.valueSub = this.facilitiesService.getCalendarEventsArr().subscribe(value => {
      console.log('this.valueSub', this.valueSub)
      if (this.myCalendarComponent) {
        this.myCalendarComponent.options.events = value;
      } else {
        setTimeout(() => {
          this.myCalendarComponent.options.events = value;
        }, 500);
      }

    });

    this.calendarOptions = {
      plugins: [timeGridPlugin, interactionPlugin],
      initialView: 'timeGridDay',
      validRange: {
        // start: '2021-10-18',
        // end: '2021-10-21'
        start: this.sleepingDates.from,
        end: till
      },
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
        right: 'timeGridDay,timeGridWeek,dayGridMonth'
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
      eventContent: (props, createElement) => {

      }
    }
  }
}
