import { Component, OnInit } from '@angular/core';
import { QuestionGroup } from 'src/app/components/form/logic/form.service';
import { SquadAssembleService } from '../services/squad-assemble.service';

@Component({
  selector: 'app-squad-assemble',
  templateUrl: './squad-assemble.component.html',
  styleUrls: ['./squad-assemble.component.scss'],
})
export class SquadAssembleComponent implements OnInit {

  public squadForm: QuestionGroup[];

  constructor(
    private squadAssembleService : SquadAssembleService
  ) {}

  ngOnInit(): void {
    this.squadForm = this.squadAssembleService.squadForm

  }

}
