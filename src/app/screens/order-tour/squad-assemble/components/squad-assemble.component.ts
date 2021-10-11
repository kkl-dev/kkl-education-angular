import { Component, OnInit } from '@angular/core';
import { QuestionGroup } from 'src/app/components/form/logic/question-group';
import { BreakpointService } from 'src/app/utilities/services/breakpoint.service';
import { SquadAssembleService } from '../services/squad-assemble.service';

@Component({
  selector: 'app-squad-assemble',
  templateUrl: './squad-assemble.component.html',
  styleUrls: ['./squad-assemble.component.scss'],
})
export class SquadAssembleComponent implements OnInit {
  public squads: QuestionGroup[];
  public budgetGroup: QuestionGroup;

  private newClientMode: boolean;

  constructor(
    private squadAssembleService: SquadAssembleService,
  ) {}

  ngOnInit(): void {
    this.subscribeToNewClient();
  }

  private setSquads() {
    this.squads = [
      {
        key: 'schedule',
        header: { label: 'מועד ושם הטיול', slot: 'tourId' },
        questions: this.squadAssembleService.scheduleQuestions,
      },
      this.newClientMode
        ? this.squadAssembleService.newClient
        : {
            key: 'client',
            header: { label: 'לקוח', slot: 'client' },
            questions: this.squadAssembleService.customerFormInputs,
            cols: 3,
          },
      {
        key: 'group',
        header: { label: 'הרכב הקבוצה', slot: 'gender' },
        questions: this.squadAssembleService.groupAssembleFormMixedInputs,
        cols: 5,
      },
      {
        key: 'details',
        header: { label: 'פרטי הטיול', slot: '' },
        questions: this.squadAssembleService.tourDetailsFormInputs,
      },
    ].reverse();

    this.budgetGroup = {
      key: 'budget',
      header: { label: 'תקציב', slot: 'budget' },
      questions: this.squadAssembleService.budgetQuestions,
      cols: 1,
    };
  }

  private subscribeToNewClient() {
    this.squadAssembleService.getNewClientObs().subscribe((value: boolean) => {
      this.newClientMode = value;
      this.setSquads();
    });
  }
}
