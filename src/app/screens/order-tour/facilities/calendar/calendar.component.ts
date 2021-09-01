import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular';
import { Calendar } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import { formatDate } from '@fullcalendar/angular';
import { INITIAL_EVENTS } from './event-utils';

 @Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    plugins: [timeGridPlugin],
    initialView: 'timeGridDay',
    allDaySlot:false,
    locale:'heb',
    direction:'rtl',
    titleFormat:{year:'numeric',month:'numeric',day:'numeric'},
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
      right: 'timeGridDay'
    },
    initialEvents: INITIAL_EVENTS
  }
  
constructor() { }

ngOnInit(): void {
}

}
