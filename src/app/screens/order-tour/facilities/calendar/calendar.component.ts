import { Component, ComponentFactoryResolver, EmbeddedViewRef, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import timeGridPlugin from '@fullcalendar/timegrid';
import { EventInput } from '@fullcalendar/angular';
import { Observable, Subscription } from 'rxjs';
import { FacilitiesService } from 'src/app/services/facilities.service';
import heLocale from '@fullcalendar/core/locales/he';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarCardComponent } from './calendar-card/calendar-card.component';
import { DynamicComponent } from 'src/app/components/dynamic/dynamic.component';
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
  public hideComponent: boolean = false;
  @ViewChild('calendar') myCalendarComponent: FullCalendarComponent;
  @ViewChild('dynamic', { read: DynamicComponent }) myDynamicComponent: DynamicComponent;

  sleepingDates: any = [];
  days: any[] = this.tripService.facilitiesArray;
  till: any;

  constructor(private facilitiesService: FacilitiesService, private resolver: ComponentFactoryResolver, private tripService: TripService) {
    //get sleeping Dates from trip service
    this.sleepingDates = this.tripService.convertDatesFromSlashToMinus();
    // add another day to last day
    let lastDay = new Date(this.days[this.days.length - 1].date);
    this.till = new Date(lastDay.setDate(lastDay.getDate() + 1));
  }

  calendarOptions: CalendarOptions = {}

  ngOnInit(): void {
    this.valueSub = this.facilitiesService.getCalendarEventsArr().subscribe(value => {
      console.log('this.value Sub', value)
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

  public arrangeDate(date: Date) {
    // 2021-10-15T08:00
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}T${hours <= 9 ? '0' + hours : hours}:${minutes <= 9 ? '0' + minutes : minutes}`
  }
}