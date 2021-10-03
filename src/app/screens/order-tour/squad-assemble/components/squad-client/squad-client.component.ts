import { FormGroup } from '@angular/forms';
import { FormService } from 'src/app/components/form/logic/form.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
import { QuestionGroup } from 'src/app/components/form/logic/question-group';
import { Subject, Observable, Subscription } from 'rxjs';
import { SquadAssembleService } from '../../services/squad-assemble.service';
import { SquadClientService } from './squad-client.service';
import { SquadNewClientService } from '../squad-new-client/squad-new-client.service';

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

  public formGroup: FormGroup;

  private unsubscribeToEdit: Subscription;
  private unsubscribeToClient: Subscription;

  constructor(
    private formService: FormService,
    private squadClientService: SquadClientService,
    private squadNewClientService: SquadNewClientService,
    private squadAssembleService: SquadAssembleService
  ) {}

  ngOnInit(): void {
    this.$questions = new Subject<QuestionBase<string | number | Date>[]>();
    this.setQuestions();
    this.subscribeToEditMode();
    this.subscribeToClientData();

    this.$saveMode = this.squadAssembleService.getSaveModeObs();
    this.formGroup = this.formService.setFormGroup(this.group);
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
      ? this.formGroup.controls.contact.enable()
      : this.formGroup.controls.contact.disable();
  }

  private updateClientForm(value?: string): void {
    this.formGroup.controls.contact.patchValue({
      fullName: value || ' שלום אברהם',
    });
  }

  // EVENTS METHODS SECTION

  // method to add new editMode form
  public onAddClient(): void {
    this.squadNewClientService.emitNewClient(true)
  }

  public onEdit(): void {
    this.squadClientService.emitEditMode(true);
    this.squadAssembleService.emitSaveMode(true);
    this.toggleFormState();
  }

  public onClear() {
    this.squadAssembleService.emitSaveMode(false);
    this.formGroup.controls.contact.disable();
  }
  
  public logForm(form) {
    this.squadAssembleService.updateFormArray(form);
  }
}
