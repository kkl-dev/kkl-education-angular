import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import timeGridPlugin from '@fullcalendar/timegrid';
import { EventInput } from '@fullcalendar/angular';
import { Observable, Subscription } from 'rxjs';
import { FacilitiesService } from 'src/app/services/facilities.service';

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
    plugins: [timeGridPlugin],
    initialView: 'timeGridDay',
    allDaySlot: false,
    locale: 'heb',
    direction: 'rtl',
    titleFormat: { year: 'numeric', month: 'numeric', day: 'numeric' },
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
    initialEvents: []
  }



  ngOnInit(): void {
    this.valueSub = this.facilitiesService.getCalendarEventsArr().subscribe(value => {
        if(this.myCalendarComponent){
          this.myCalendarComponent.options.events = value;
        } else {
          setTimeout(() => {
            this.myCalendarComponent.options.events = value;
          }, 500);
        }

    });
  }

}
