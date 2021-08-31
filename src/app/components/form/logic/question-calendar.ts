import { QuestionBase } from './question-base';

export class QuestionCalendar extends QuestionBase<Date> {
  controlType = 'calendar';
  type = 'date';
  icon = 'date_range';
}
