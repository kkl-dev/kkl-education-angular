import { FormGroup } from '@angular/forms';
import { SquadClientService } from './squad-client.service';
import { FormService } from 'src/app/components/form/logic/form.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
import { QuestionGroup } from 'src/app/components/form/logic/question-group';
import { FormHeader } from '../squad-group/squad-group.component';
import { Subject, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-squad-client',
  templateUrl: './squad-client.component.html',
  styleUrls: ['./squad-client.component.scss']
})
export class SquadClientComponent implements OnInit, OnDestroy {
  @Input() public group: QuestionGroup;

  public clientQuestions: QuestionBase<string | number | Date>[];
  public contactQuestions: QuestionBase<string | number | Date>;

  public $questions: Subject<QuestionBase<string | number | Date>[]>;

  public editMode: boolean;

  private contactFormGroup: FormGroup

  private header: FormHeader = {
    label: 'איש קשר',
    slot: 'button',
  };

  private unsubscribeToEdit: Subscription
  private unsubscribeToClient: Subscription

  constructor(
    private squadClientService: SquadClientService

  ) { }

  ngOnInit(): void {

    this.$questions = new Subject<QuestionBase<string | number | Date>[]>()
    this.setClientQuestions()
    this.subscribeToEditMode()
    this.subscribeToClientData()
  }

  ngOnDestroy(): void {
    this.unsubscribeToEdit.unsubscribe();
    this.unsubscribeToClient.unsubscribe();
  }

  private setClientQuestions(): void {
    this.contactQuestions = this.group.questions.pop();
    this.group.questions = this.group.questions.filter((question: QuestionBase<string>) => question.key !== 'contect');
  }


  private subscribeToEditMode(): void {
    this.unsubscribeToEdit = this.squadClientService.getEditModeObs().subscribe(
      (mode: boolean) => {
        this.editMode = mode;
      }
    )
  }

  private subscribeToClientData(): void {
    this.unsubscribeToClient = this.squadClientService.getClientObs().subscribe(
      (value: any) => {
        this.squadClientService.emitEditMode(true)
        this.updateClientHeader()
        this.updateClientForm(value)      }
    )
  }

  private toggleFormState(): void {
    this.editMode
      ? this.contactFormGroup.enable()
      : this.contactFormGroup.disable()
  }

  private updateClientHeader(): void {

    this.editMode
      ? (this.contactQuestions.group.header = this.header)
      : (this.contactQuestions.group.header = null);

    this.$questions.next([this.contactQuestions]);
  }

  private updateClientForm(value?: string): void {
    this.contactFormGroup.patchValue({ fullName: value || ' שלום אברהם' });
  }


  // EVENTS METHOS SECTION

  // method to add new editMode form
  public onAddClient(): void {
    this.editMode = !this.editMode;
    this.toggleFormState()
    this.updateClientHeader()
  }

  public registerToClient(formGroup: FormGroup) {
    this.contactFormGroup = formGroup
  }


  public onEdit(): void {
    this.squadClientService.emitEditMode(true)
    this.toggleFormState()
  }

}
