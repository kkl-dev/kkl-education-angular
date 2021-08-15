import { Component, OnInit } from '@angular/core';
import { Offset } from '../form-container/dynamic-form-question/question-offset';
import { QuestionBase } from '../form-container/question-base';
import { QuestionCalendar } from '../form-container/question-calendar';
import { QuestionTextarea } from '../form-container/question-textarea';
import { TextboxQuestion } from '../form-container/question-textbox';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss'],
})
export class DrawerComponent implements OnInit {
  reminderForm: QuestionBase<string | Date>[] = [
    new QuestionCalendar({
      key: 'date',
      columns: 'span 6',
      label: 'תאריך',
      value:  new Date(),
      order: 3,
    }),
    new Offset({
      columns: 'span 1',
    }),

    new TextboxQuestion({
      key: 'time',
      columns: 'span 5',
      label: 'שעה',
      value: '',
      order: 1,
    }),
    new QuestionTextarea({
      key: 'comment',
      label: 'תזכורת',
      innerLabel: '',
      columns: 'span 12',
      order: 7,
      value: '',
    }),
  ];

  index: number = -1;

  isOpen:boolean=false

  reminderArray: { date: Date; time: string; comment: string }[] = [ { date: new Date(), time: '08:00', comment: 'asdasdasdasdasd asda asd asd asd asd ad asd asd aasd asd asd ' },
  { date: new Date(), time: '08:00', comment: 'asdasdd asd asd ' }];

  newCommentHandler(newComment: { date: Date; time: string; comment: string }) {
    console.log('newComment');
    if (this.index > -1) {
      this.reminderArray.splice(1, this.index, newComment);
    } else {
      this.reminderArray.push(newComment);
    }
  }
  editComment(index: number) {
    console.log('index');
    this.reminderForm = [
      new QuestionCalendar({
        key: 'date',
        columns: 'span 6',
        label: 'תאריך',
        value: this.reminderArray[index].date,
        order: 3,
      }),
      new Offset({
        columns: 'span 1',
      }),

      new TextboxQuestion({
        key: 'time',
        columns: 'span 5',
        label: 'שעה',
        value: this.reminderArray[index].time.toString(),
        order: 1,
      }),
      new QuestionTextarea({
        key: 'comment',
        label: 'תזכורת',
        innerLabel: '',
        columns: 'span 12',
        order: 7,
        value: this.reminderArray[index].comment.toString(),
      }),
    ];

    this.index = index;
  }

  deleteComment(index: number) {
    console.log(index);
    this.reminderArray.splice(index, 1);
  }

  toggleDrawer(){
    this.isOpen=!this.isOpen
  }
  constructor() {}

  ngOnInit(): void {}
}
