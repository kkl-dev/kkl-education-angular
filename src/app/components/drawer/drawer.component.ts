import { Component, OnInit, ViewChild } from '@angular/core';
import { FormContainerComponent } from '../form/form-container/form-container.component';
import { DatePipe } from '@angular/common';
import { QuestionBase } from '../form/logic/question-base';
import { QuestionCalendar } from '../form/logic/question-calendar';
import { TextboxQuestion } from '../form/logic/question-textbox';
import { Offset } from '../form/logic/question-offset';
import { QuestionTextarea } from '../form/logic/question-textarea';
@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss'],
})
export class DrawerComponent implements OnInit {
  reminderForm: QuestionBase<string | Date>[] = [
    new QuestionCalendar({
      key: 'date',
      cols: 'span 6',
      label: 'תאריך',
      value: new Date(),
    }),
    new Offset({
      cols: 'span 1',
    }),

    new TextboxQuestion({
      key: 'time',
      cols: 'span 5',
      label: 'שעה',
      value: '',
    }),
    new QuestionTextarea({
      key: 'comment',
      label: 'תזכורת',
      cols: 'span 12',
      value: '',
    }),
  ];
  @ViewChild('drawerForm', { static: true })
  drawerForm!: FormContainerComponent;

  index: number = -1;

  isOpen: boolean = false;

  reminderArray: { date: Date; time: string; comment: string }[] = [
    {
      date: new Date(),
      time: '08:00',
      comment: 'asdasdasdasdasd asda asd asd asd asd ad asd asd aasd asd asd ',
    },
    { date: new Date(), time: '08:00', comment: 'asdasdd asd asd ' },
  ];

  newCommentHandler(newComment: { date: Date; time: string; comment: string }) {
    console.log('newComment');
    if (this.index > -1) {
      this.reminderArray.splice(this.index, 1, newComment);
      this.index = -1;
    } else {
      this.reminderArray.push(newComment);
    }
    this.drawerForm.form.reset();
  }

  editComment(index: number) {
    console.log(new Date(this.reminderArray[index].date));

    this.drawerForm.form.patchValue({
      date: this.datePipe.transform(this.reminderArray[index].date,"yyyy-MM-dd"),
      time: this.reminderArray[index].time,
      comment: this.reminderArray[index].comment,
    });
    this.index = index;
  }

  deleteComment(index: number) {
    this.reminderArray.splice(index, 1);
  }

  toggleDrawer() {
    this.isOpen = !this.isOpen;
  }

  deleteFormInputs(e: Event) {
    e.preventDefault();
    this.drawerForm.form.reset();
  }

  constructor(private datePipe: DatePipe) {}

  ngOnInit(): void {}
}
