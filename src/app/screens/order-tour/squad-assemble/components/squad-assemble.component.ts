import { Component, OnInit } from '@angular/core';
import { QuestionGroup } from 'src/app/components/form/logic/question-group';
import { SquadAssembleService } from '../services/squad-assemble.service';

interface SquadGroup {
  group: QuestionGroup;
  hasBottom?: boolean;
  bottomText?: string;
}

@Component({
  selector: 'app-squad-assemble',
  templateUrl: './squad-assemble.component.html',
  styleUrls: ['./squad-assemble.component.scss'],
})
export class SquadAssembleComponent implements OnInit {
  public squads: SquadGroup[];

  constructor(private squadAssembleService: SquadAssembleService) { }

  ngOnInit(): void {
    this.squads = [
      {
        group: {
          header: { text: 'מועד ושם הטיול', custom: 'tourId' },
          questions: this.squadAssembleService.timeAndNameFormInputs,
        },
        hasBottom: true,

      },
      {
        group: {
          header: { text: 'לקוח', custom: 'client' },
          questions: this.squadAssembleService.customerFormInputs,
          cols: '3',
        },
      },
      {
        group: {
          header: { text: 'הרכב הקבוצה', custom: 'gender' },
          questions: this.squadAssembleService.groupAssembleFormInputs,
          gutter: 30,
          cols: '3',
        },
        hasBottom: true,
      },
      {
        group: {
          header: { text: 'פרטי הטיול', custom: '' },
          questions: this.squadAssembleService.tourDetailsFormInputs,
        },
      },
    ].reverse();
  }
}
