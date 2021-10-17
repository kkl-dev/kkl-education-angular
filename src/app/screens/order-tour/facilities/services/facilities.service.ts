import { Injectable } from '@angular/core';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
import { QuestionSelect } from 'src/app/components/form/logic/question-select';
import { QuestionTextbox } from 'src/app/components/form/logic/question-textbox';
import { Validators, FormControl } from '@angular/forms';
@Injectable({
  providedIn: 'root'
})
export class FacilitiesService {

  tripActivities?: any = [];
  areas?: any = [];
  activityCategories?: any = [];

  constructor() { }

  // formArray: QuestionBase<string | number>[] = [
  //   new QuestionSelect({
  //     key: 'durationOfActivity',
  //     label: 'משך פעילות',
  //     validations: [Validators.required],
  //     inputProps: { options: [{ label: 'גולן, עמק החולה', value: '11' }, { label: 'גjsdfk df', value: '12' }] }
  //   }),
  //   new QuestionSelect({
  //     key: 'areas',
  //     label: 'אזור',
  //     inputProps: { options: this.areas },
  //     validations: [Validators.required]
  //   }),
  //   new QuestionSelect({
  //     key: 'typeOfActivity',
  //     label: 'סוג פעילות',
  //     validations: [Validators.required],
  //     inputProps: { options: [{ label: '', value: '' }] }
  //   }),
  //   new QuestionTextbox({
  //     key: 'search',
  //     label: 'חפש פעילות',
  //     value: '',
  //     validations: [Validators.required]
  //   }),
  // ];
}
