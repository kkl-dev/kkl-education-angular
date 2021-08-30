import { Component, OnInit } from '@angular/core';
import { QuestionGroup } from 'src/app/components/form/logic/form.service';
import { SquadAssembleService } from '../services/squad-assemble.service';
import { FormHeader } from './squad-group/squad-group.component';

export interface SquadGroup {
  header: FormHeader;
  group: QuestionGroup;
}

@Component({
  selector: 'app-squad-assemble',
  templateUrl: './squad-assemble.component.html',
  styleUrls: ['./squad-assemble.component.scss'],
})
export class SquadAssembleComponent implements OnInit {
  public squadForm: SquadGroup[];

  constructor(private squadAssembleService: SquadAssembleService) {}

  ngOnInit(): void {
    this.squadForm = [
      {
        header: { text: 'מועד ושם הטיול', custom: '' },
        group: { questions: this.squadAssembleService.timeAndNameFormInputs },
      },
      {
        header: { text: 'לקוח', custom: '' },
        group: { questions: this.squadAssembleService.customerFormInputs },
      },
      {
        header: { text: 'הרכב הקבוצה', custom: 'button' },
        group: {
          questions: this.squadAssembleService.groupAssembleFormMixedInputs,
          cols: '2',
        },
      },
      {
        header: { text: 'פרטי הטיול', custom: '' },
        group: { questions: this.squadAssembleService.tourDetailsFormInputs },
      },
    ].reverse();
  }
}
