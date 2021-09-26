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
  public budgetGroup: QuestionGroup;

  constructor(private squadAssembleService: SquadAssembleService) {}

  ngOnInit(): void {
    this.squads = [
      {
        group: {
          key: 'date',
          header: { text: 'מועד ושם הטיול', custom: 'tourId' },
          questions: this.squadAssembleService.timeAndNameFormInputs,
        },
        hasBottom: true,
      },
      {
        group: {
          key: 'client',
          header: { text: 'לקוח', custom: 'client' },
          questions: this.squadAssembleService.customerFormInputs,
          cols: 1,
        },
      },
      {
        group: {
          key: 'squad',
          header: { text: 'הרכב הקבוצה', custom: 'gender' },
          questions: this.squadAssembleService.groupAssembleFormMixedInputs,
          cols: 5,
        },
        hasBottom: true,
      },
      {
        group: {
          key: 'details',
          header: { text: 'פרטי הטיול', custom: '' },
          questions: this.squadAssembleService.tourDetailsFormInputs,

        },
        hasBottom: true,
      },
    ].reverse();

    this.budgetGroup = {
      key: 'budget',
      header: { text: 'תקציב', custom: 'budget' },
      questions: this.squadAssembleService.budgetQuestions,
      cols: 1,
    };
  }
}
