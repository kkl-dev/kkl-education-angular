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
        header: { text: 'מועד שם טיול', custom : '' },
        group: { questions : this.squadAssembleService.timeAndNameFormInputs},
      }



      // {
      //   label: 'לקוח',
      //   questions: this.squadAssembleService.customerFormInputs,
      // },
      // {
      //   label: 'הרכב הקבוצה',
      //   cols: '2',
      //   questions: this.squadAssembleService.groupAssembleFormInputs,
      // },
      // {
      //   cols: '1',
      //   label: 'פרטי הטיול',
      //   questions: this.squadAssembleService.tourDetailsFormInputs,
      // },
    ].reverse();
  }
}
