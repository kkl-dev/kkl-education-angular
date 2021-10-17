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
];

export function createEventId() {
  return String(eventGuid++);
}
