import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
import { QuestionGroup } from 'src/app/components/form/logic/question-group';
import { SquadNewClientService } from './squad-new-client.service';

@Component({
  selector: 'app-squad-new-client',
  templateUrl: './squad-new-client.component.html',
  styleUrls: ['./squad-new-client.component.scss'],
})
export class SquadNewClientComponent implements OnInit {
  @Input() public group: QuestionGroup;
  @Input() public questions: QuestionBase<string | number | Date>[];

  constructor(private squadNewClientService: SquadNewClientService) {}

  ngOnInit(): void {
  }

  public onClear() {
    this.squadNewClientService.emitNewClient(false);
  }
}
