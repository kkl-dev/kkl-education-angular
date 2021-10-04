import { Component, Input, OnInit } from '@angular/core';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
import { QuestionGroup } from 'src/app/components/form/logic/question-group';
import { ListItem } from 'src/app/components/grid/list-item.model';
import { SquadAssembleService } from '../../services/squad-assemble.service';

@Component({
  selector: 'app-squad-schedule',
  templateUrl: './squad-schedule.component.html',
  styleUrls: ['./squad-schedule.component.scss']
})
export class SquadScheduleComponent implements OnInit {

  @Input() public group: QuestionGroup;
  @Input() public questions: QuestionBase<string | number | Date>[];

  public tripId: string = '0000000';

  public list: ListItem[] = [{
    label: 'מס לילות',
    value: '2',
  },
  {
    label: 'מס ימים',
    value: '3',
  },];


  constructor(
    private squadAssembleService: SquadAssembleService,
  ) { }

  ngOnInit() {
    this.questions = this.group.questions || [];
  }

  //log form when valid
  
  public logForm(form) {
    this.squadAssembleService.updateFormArray(form);
  }


}
