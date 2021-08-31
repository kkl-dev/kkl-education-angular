import { Component, OnInit } from '@angular/core';
import { QuestionGroup } from 'src/app/components/form/logic/question-group';
import { SquadAssembleService } from '../services/squad-assemble.service';


@Component({
  selector: 'app-squad-assemble',
  templateUrl: './squad-assemble.component.html',
  styleUrls: ['./squad-assemble.component.scss'],
})
export class SquadAssembleComponent implements OnInit {
  public squads: QuestionGroup[];

  constructor(private squadAssembleService: SquadAssembleService) {}

  ngOnInit(): void {

    this.squads = [
      {
        header: { text: 'מועד ושם הטיול', custom: '' },
        questions: this.squadAssembleService.timeAndNameFormInputs,
      },
      // {
      //   header: { text: 'לקוח', custom: 'client' },
      //   questions: this.squadAssembleService.customerFormInputs,
      // },
      // {
      //   header: { text: 'הרכב הקבוצה', custom: 'gender' },
      //   questions: this.squadAssembleService.groupAssembleFormMixedInputs,
      //   cols: '2',
      // },

      // {
      //   header: { text: 'פרטי הטיול', custom: '' },
      //   questions: this.squadAssembleService.tourDetailsFormInputs,
      // },
    ].reverse();
  }
}
