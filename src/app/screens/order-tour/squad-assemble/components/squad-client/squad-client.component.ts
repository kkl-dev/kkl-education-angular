import { FormGroup } from '@angular/forms';
import { SquadClientService } from './squad-client.service';
import { FormService } from 'src/app/components/form/logic/form.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
import { QuestionGroup } from 'src/app/components/form/logic/question-group';
import { FormHeader } from '../squad-group/squad-group.component';
import { Subject, Observable, Subscription } from 'rxjs';
import { SquadAssembleService } from '../../services/squad-assemble.service';

@Component({
  selector: 'app-squad-client',
  templateUrl: './squad-client.component.html',
  styleUrls: ['./squad-client.component.scss'],
})
export class SquadClientComponent implements OnInit, OnDestroy {
  @Input() public group: QuestionGroup;

  public clientQuestions: QuestionBase<string>;
  public contactQuestions: QuestionBase<string>;
  public payerQuestions: QuestionBase<string>;

  public $questions: Subject<QuestionBase<string | number | Date>[]>;
  public $saveMode: Observable<boolean>;

  public editMode: boolean;

  private clientFormGroup: FormGroup;

  private unsubscribeToEdit: Subscription;
  private unsubscribeToClient: Subscription;

  constructor(
    private squadClientService: SquadClientService,
    private squadAssembleService: SquadAssembleService
  ) {}

  ngOnInit(): void {
    this.$questions = new Subject<QuestionBase<string | number | Date>[]>();
    this.setQuestions();
    this.subscribeToEditMode();
    this.subscribeToClientData();
    this.$saveMode = this.squadAssembleService.getSaveModeObs();
  }

  ngOnDestroy(): void {
    this.unsubscribeToEdit.unsubscribe();
    this.unsubscribeToClient.unsubscribe();
  }

  private findQuestions(key: string): QuestionBase<string> {
    return this.group.questions.find(
      (question: QuestionBase<string>) => question.key == key
    );
  }

  private setQuestions() {
    this.clientQuestions = this.findQuestions('client');
    this.contactQuestions = this.findQuestions('contact');
    this.payerQuestions = this.findQuestions('payer');
  }

  private subscribeToEditMode(): void {
    this.unsubscribeToEdit = this.squadClientService
      .getEditModeObs()
      .subscribe((mode: boolean) => {
        this.editMode = mode;
      });
  }

  private subscribeToClientData(): void {
    this.unsubscribeToClient = this.squadClientService
      .getClientObs()
      .subscribe((value: any) => {
        this.squadClientService.emitEditMode(true);
        this.updateClientForm(value);
      });
  }

  private toggleFormState(): void {
    this.editMode
      ? this.clientFormGroup.enable()
      : this.clientFormGroup.disable();
  }

  private updateClientForm(value?: string): void {
    this.clientFormGroup.patchValue({ fullName: value || ' שלום אברהם' });
  }

  // EVENTS METHOS SECTION

  // method to add new editMode form
  public onAddClient(): void {
    this.editMode = !this.editMode;
    this.toggleFormState();
  }

  public registerToClient(formGroup: FormGroup) {
    this.clientFormGroup = formGroup;
  }

  public onEdit(): void {
    this.squadClientService.emitEditMode(true);
    this.squadAssembleService.emitSaveMode(true);
    this.toggleFormState();
  }

  public onCLear() {
    this.squadAssembleService.emitSaveMode(false);
  }
}
