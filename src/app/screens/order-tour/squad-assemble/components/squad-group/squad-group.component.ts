import { Component, Input } from '@angular/core';
import { FormService } from 'src/app/components/form/logic/form.service';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
import { FlexCell } from 'src/app/components/grid/flex-cell/flex-cell.component';
import { QuestionGroup } from 'src/app/components/form/logic/question-group';
import { SquadAssembleService } from '../../services/squad-assemble.service';
import { Subject } from 'rxjs';
import { ListItem } from 'src/app/components/grid/list-item.model';

export interface FormHeader {
  label: string;
  slot?: any;
}

@Component({
  selector: 'app-squad-group',
  templateUrl: './squad-group.component.html',
  styleUrls: ['./squad-group.component.scss'],
  providers: [FormService],
})
export class SquadGroupComponent {

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
