import { FormControl, FormGroup } from '@angular/forms';
import { FormService } from 'src/app/components/form/logic/form.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  QuestionBase,
  SelectOption,
} from 'src/app/components/form/logic/question-base';
import { QuestionGroup } from 'src/app/components/form/logic/question-group';
import {
  Subject,
  Observable,
  Subscription,
  BehaviorSubject,
  iif,
  of,
  merge,
} from 'rxjs';
import { SquadAssembleService } from '../../services/squad-assemble.service';
import { SquadClientService } from './squad-client.service';
import { SquadNewClientService } from '../squad-new-client/squad-new-client.service';
import { map, startWith, switchMap } from 'rxjs/operators';
import { QuestionAutocomplete } from 'src/app/components/form/logic/question-autocomplete';

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

  private subjectSchool: Subject<SelectOption>;
  private subjectPayer: Subject<SelectOption>;

  private removeSchool: Subject<string>;
  private removePayer: Subject<string>;

  private subjectSchoolOptions: BehaviorSubject<SelectOption[]>;
  private subjectPayerOptions: BehaviorSubject<SelectOption[]>;

  public schoolOptions$: Observable<SelectOption[]>;
  public payerOptions$: Observable<SelectOption[]>;

  private unsubscribeToEdit: Subscription;
  private unsubscribeToClient: Subscription;

  constructor(
    private formService: FormService,
    private squadClientService: SquadClientService,
    private squadNewClientService: SquadNewClientService,
    private squadAssembleService: SquadAssembleService
  ) {}

  ngOnInit(): void {
    this.subjectSchool = new Subject<SelectOption>();
    this.removeSchool = new Subject<string>();
    this.subjectSchoolOptions = new BehaviorSubject<SelectOption[]>([]);

    this.subjectPayer = new Subject<SelectOption>();
    this.removePayer = new Subject<string>();
    this.subjectPayerOptions = new BehaviorSubject<SelectOption[]>([]);

    this.$questions = new Subject<QuestionBase<string | number | Date>[]>();
    this.setQuestions();
    this.subscribeToEditMode();
    this.subscribeToClientData();

    this.$saveMode = this.squadAssembleService.getSaveModeObs();
    this.formGroup = this.formService.setFormGroup(this.group);

    this.schoolOptions$ = merge(this.setSchoolOptions(), this.onDeleteSchool());
    this.payerOptions$ = merge(this.setPayerOptions(), this.onDeletePayer());
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
    this.squadNewClientService.emitNewClient(true);
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

  public onAutocomplete(control: FormControl) {}

  public onSelect(control: FormControl) {}

  // return event : {key : string, option : {label, value}}
  public onOptionSelected(event: any, groupKey: string) {
    const { option, key } = event;
    const label = `${option.value} - ${option.label}`;
    this.formGroup.controls[groupKey]['controls'][key].patchValue(label);
    this.squadClientService.emitClientSelected(label);

    if (groupKey === 'client') {
      this.subjectSchool.next(option);
    }
    if (groupKey === 'payer') {
      this.subjectPayer.next(option);
    }

    // TODO - SERVER SIDE
  }
  public onDelete(option: {
    optionToDelete: SelectOption;
    question: QuestionAutocomplete;
  }) {
    const { question, optionToDelete } = option;

    // TODO - server logic here

    const { key } = question;


    if (key === 'clientName') {
      this.removeSchool.next(optionToDelete.value);
    }
    if (key === 'payerName') {
      this.removePayer.next(optionToDelete.value);
    }
  }

  private onDeleteSchool(): Observable<SelectOption[]> {
    return this.removeSchool.asObservable().pipe(
      switchMap((value: string) => {
        return this.subjectSchoolOptions.asObservable().pipe(
          map((options: SelectOption[]) => {
            const index = options.findIndex((option) => option.value === value);
            options.splice(index, 1);
            return options;
          })
        );
      })
    );
  }
  private onDeletePayer(): Observable<SelectOption[]> {
    return this.removePayer.asObservable().pipe(
      switchMap((value: string) => {
        return this.subjectPayerOptions.asObservable().pipe(
          map((options: SelectOption[]) => {
            const index = options.findIndex((option) => option.value === value);
            options.splice(index, 1);
            return options;
          })
        );
      })
    );
  }

  private setSchoolOptions() {
    return this.subjectSchool.asObservable().pipe(
      switchMap((option: SelectOption) => {
        return this.subjectSchoolOptions.asObservable().pipe(
          switchMap((options: SelectOption[]) => {
            return of(this.findOption(options, option)).pipe(
              map((found: boolean) => {
                found ? options : options.push(option);
                return options;
              })
            );
          })
        );
      })
    );
  }
  private setPayerOptions() {
    return this.subjectPayer.asObservable().pipe(
      startWith({ value: '', label: '' }),
      switchMap((option: SelectOption) => {
        return this.subjectPayerOptions.asObservable().pipe(
          switchMap((options: SelectOption[]) => {
            return of(this.findOption(options, option)).pipe(
              map((found: boolean) => {
                found ? options : options.push(option);
                return options;
              })
            );
          })
        );
      })
    );
  }

  private findOption(options: SelectOption[], option: SelectOption): boolean {
    if (option.value) {
      return !!options.find((item) => item.value === option.value);
    } else {
      return true;
    }
  }
}
