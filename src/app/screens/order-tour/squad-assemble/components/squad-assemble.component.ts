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
          header: { label: 'מועד ושם הטיול', slot: 'tourId' },
          questions: this.squadAssembleService.timeAndNameFormInputs,
        },
        hasBottom: true,
      },
      {
        group: {
          key: 'client',
          header: { label: 'לקוח', slot: 'client' },
          questions: this.squadAssembleService.customerFormInputs,
          cols: 1,
        },
      },
      {
        group: {
          key: 'squad',
          header: { label: 'הרכב הקבוצה', slot: 'gender' },
          questions: this.squadAssembleService.groupAssembleFormMixedInputs,
          cols: 5,
        },
        hasBottom: true,
      },
      {
        group: {
          key: 'details',
          header: { label: 'פרטי הטיול', slot: '' },
          questions: this.squadAssembleService.tourDetailsFormInputs,

        },
        hasBottom: true,
      },
    ].reverse();

    this.budgetGroup = {
      key: 'budget',
      header: { label: 'תקציב', slot: 'budget' },
      questions: this.squadAssembleService.budgetQuestions,
      cols: 1,
    };
  }
}
