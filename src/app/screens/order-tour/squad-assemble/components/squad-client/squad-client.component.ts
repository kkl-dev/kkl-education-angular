import { FormGroup } from '@angular/forms';
import { SquadClientService } from './squad-client.service';
import { FormService } from 'src/app/components/form/logic/form.service';
import { Component, Input, OnInit } from '@angular/core';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
import { QuestionGroup } from 'src/app/components/form/logic/question-group';
import { SquadAssembleService } from '../../services/squad-assemble.service';
import { FormHeader } from '../squad-group/squad-group.component';
import { Subject, BehaviorSubject, Observable } from 'rxjs';

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

  public $editMode: Observable<boolean> = this.squadClientService.getEditMode()
  public editMode: boolean;

  private contactFormGroup: FormGroup

  private header: FormHeader = {
    label: 'איש קשר',
    slot: 'button',
  };

  constructor(
    private formService: FormService,
    private squadClientService: SquadClientService

  ) { }

  ngOnInit(): void {

    this.$questions = new Subject<QuestionBase<string | number | Date>[]>()
    this.$editMode = this.squadClientService.getEditMode()
    this.setClientQuestions()
    this.subscribeToEditMode()
  }

  private setClientQuestions() {
    this.contactQuestions = this.group.questions.pop()
    this.group.questions = this.group.questions.filter((question: QuestionBase<string>) => question.key !== 'contect')
  }


  private subscribeToEditMode() {
    this.$editMode.subscribe(
      (mode: boolean) => {
        this.editMode = mode
      }
    )
  }


  // method to add new editMode form
  public onAddClient() {
    this.editMode = !this.editMode;
    this.toggleFormState()
    this.updateClientHeader()
  }

  private toggleFormState() {
    this.editMode
      ? this.contactFormGroup.enable()
      : this.contactFormGroup.disable()
  }

  private updateClientHeader() {

    this.editMode
      ? (this.contactQuestions.group.header = this.header)
      : (this.contactQuestions.group.header = null);

    this.$questions.next([this.contactQuestions]);
  }

  private updateClientForm() {
    this.contactFormGroup.patchValue({ fullName: ' שלום אברהם' });
  }


  public registerToClient(formGroup: FormGroup) {
    this.contactFormGroup = formGroup
  }


  public onEdit() {
    this.updateClientForm()
  }

}
