import { FormService } from 'src/app/components/form/logic/form.service';
import { Component, Input, OnInit } from '@angular/core';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
import { QuestionGroup } from 'src/app/components/form/logic/question-group';
import { SquadAssembleService } from '../../services/squad-assemble.service';
import { FormHeader } from '../squad-group/squad-group.component';
import { Subject, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-squad-client',
  templateUrl: './squad-client.component.html',
  styleUrls: ['./squad-client.component.scss']
})
export class SquadClientComponent implements OnInit {

  @Input() public group: QuestionGroup;

  public expend: boolean = true;
  public clientQuestions: QuestionBase<string | number | Date>[];
  public contactQuestions: QuestionBase<string | number | Date>;
  public $questions: Subject<QuestionBase<string | number | Date>[]>;

  private client: boolean = false;

  constructor(
    private squadAssembleService: SquadAssembleService,
    private formService: FormService,

  ) { }

  ngOnInit(): void {

    this.$questions = new Subject<QuestionBase<string | number | Date>[]>()
    this.contactQuestions = this.group.questions.pop()
    this.setClientQuestions()
  }

  private setClientQuestions() {
    this.group.questions = this.group.questions.filter((question: QuestionBase<string>) => question.key !== 'contect')
  }

  // method to add new client form
  public onAddClient() {
    this.client = !this.client;
    console.log(this.client)

    this.updateClientHeader()

  }

  private updateClientHeader() {
    const header: FormHeader = {
      label: 'איש קשר',
      slot: 'button',
    };

    this.client
      ? (this.contactQuestions.group.header = header)
      : (this.contactQuestions.group.header = null);

    this.$questions.next([this.contactQuestions]);
  }

  private updateClientForm() {
    this.updateClientHeader()
    this.formService.formGroup.controls.contact.patchValue({ fullName: ' שלום אברהם' });
  }

  private subscribeToOnSelectChange() {


    this.formService.onChangeSelect.subscribe((value) => {
      if (this.group.key === 'client') {
        this.client = true
        this.updateClientForm();
        this.formService.formGroup.controls.contact.disable();
        console.log(this.formService.formGroup.controls.contact)
      }
    });
  }

  
  public onEdit() {
    
  }

}
