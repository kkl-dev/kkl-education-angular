import { EventInput } from '@fullcalendar/angular';
import '../calendar/calendar.component.scss';

let eventGuid = 0;
const TODAY_STR = new Date().toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today


export const INITIAL_EVENTS: EventInput[] = [
  {
    id: createEventId(),
    title: 'All-day event',
    start: TODAY_STR
  },
  {
    id: createEventId(),
    title: 'Timed event',
    start: TODAY_STR + 'T12:00',
    end: TODAY_STR + 'T14:30',
    backgroundColor: '#ECF8EE',
    borderColor: '#ECF8EE',
    textColor: 'black',
    editable: true,
    className:'border-activities',
    type:'activity'
  },
  {
    id: createEventId(),
    title: 'Timed event',
    start: TODAY_STR + 'T12:00:00',
    end: TODAY_STR + 'T14:30:00',
    backgroundColor: '#F0F6FE',
    borderColor: '#F0F6FE',
    textColor: 'black',
    className: 'border-facilities',
    type:'facility'
  }
];

export function createEventId() {
  return String(eventGuid++);
}
