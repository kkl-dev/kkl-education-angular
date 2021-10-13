import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import timeGridPlugin from '@fullcalendar/timegrid';
import { EventInput } from '@fullcalendar/angular';
import { Observable, Subscription } from 'rxjs';
import { FacilitiesService } from 'src/app/services/facilities.service';
import heLocale from '@fullcalendar/core/locales/he';
import interactionPlugin from '@fullcalendar/interaction'; 

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

  constructor(private facilitiesService: FacilitiesService) { }

  public calendarOptions: CalendarOptions = {
    plugins: [timeGridPlugin,interactionPlugin],
    initialView: 'timeGridDay',
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
    eventClick:(info) => {
      console.log(info.event);
      this.facilitiesService.findObjectInCalendarArray(info.event.id);
    }
  }



  ngOnInit(): void {
    this.valueSub = this.facilitiesService.getCalendarEventsArr().subscribe(value => {
      if (this.myCalendarComponent) {
        this.myCalendarComponent.options.events = value;
      } else {
        setTimeout(() => {
          this.myCalendarComponent.options.events = value;
        }, 500);
      }

    });
  }

}
