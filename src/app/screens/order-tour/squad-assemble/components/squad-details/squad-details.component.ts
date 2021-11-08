import { Component, Input, OnInit } from '@angular/core';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
import { QuestionGroup } from 'src/app/components/form/logic/question-group';
import { Observable, Subject } from 'rxjs';
import { BreakpointService } from 'src/app/utilities/services/breakpoint.service';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { distinctUntilChanged, map } from 'rxjs/operators';

@Component({
  selector: 'app-squad-details',
  templateUrl: './squad-details.component.html',
  styleUrls: ['./squad-details.component.scss'],
})
export class SquadDetailsComponent implements OnInit {
  @Input() public detailsGroup: QuestionGroup;
  @Input() public budgetGroup: QuestionGroup;

  public budgetKKL: number = 18332736;
  public expend: boolean = true;

  public value$: Observable<string>;
  public questions$ = new Subject<QuestionBase<string | number | Date>[]>();
  public tablet$: Observable<boolean>;

  constructor(private breakpoints: BreakpointService) {}

  ngOnInit(): void {
    this.tablet$ = this.breakpoints.isTablet();
  }

  public onBudget() {}

  public listenToRadioButton(formGroup: FormGroup) {
    const radioControl = formGroup.controls['department'];
    const tripLocation = formGroup.controls['tripLocation'];
    this.value$ = radioControl.valueChanges.pipe(
      distinctUntilChanged(),
      map((value: string) => {
        value === 'domestic'
          ? tripLocation.disable({ emitEvent: false })
          : tripLocation.enable({ emitEvent: false });

        return value;
      })
    );
  }

  public onRegister(formGroup: FormGroup) {
    this.listenToRadioButton(formGroup);
  }
}
