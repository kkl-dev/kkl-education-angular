import { QuestionBase } from './question-base';

export class QuestionCalendar extends QuestionBase<Date> {
  controlType = 'date';
  type = 'date';
  icon = 'date_range';
}
