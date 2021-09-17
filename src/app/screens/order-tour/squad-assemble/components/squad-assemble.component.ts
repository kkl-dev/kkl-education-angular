import { Component, OnDestroy, OnInit } from '@angular/core';
import { QuestionGroup } from 'src/app/components/form/logic/question-group';
import { SquadAssembleService } from '../services/squad-assemble.service';
import {TripService} from '../../../../services/trip.service';
import{FieldForestCenter, UserService} from 'src/app/open-api';
import { group } from '@angular/animations';

interface SquadGroup {
  group: QuestionGroup;
  hasBottom?: boolean;
  bottomText?: string;
}

@Component({
  selector: 'app-squad-assemble',
  templateUrl: './squad-assemble.component.html',
  styleUrls: ['./squad-assemble.component.scss'],
})
export class SquadAssembleComponent implements OnInit,OnDestroy {
  public squads: SquadGroup[];
 
  constructor(private squadAssembleService: SquadAssembleService, private tripService:TripService, private userService:UserService) { }

  ngOnInit(): void {
    this.squads = [
      {
        group: {
          key : 'date',
          header: { text: 'מועד ושם הטיול', custom: 'tourId' },
          questions: this.squadAssembleService.timeAndNameFormInputs,
        },
        hasBottom: true,

      },
      {
        group: {
          key : 'client',
          header: { text: 'לקוח', custom: 'client' },
          questions: this.squadAssembleService.customerFormInputs,
          cols: '3',
        },
      },
      {
        group: {
          key : 'squad',
          header: { text: 'הרכב הקבוצה', custom: 'gender' },
          questions: this.squadAssembleService.groupAssembleFormMixedInputs,
          cols: '5',
        },
        hasBottom: true,
      },
      {
        group: {
          key : 'details',
          header: { text: 'פרטי הטיול', custom: '' },
          questions: this.squadAssembleService.tourDetailsFormInputs,
        },
      },
    ].reverse();

     //this.squadAssembleService.setLookupsForFirstGroup();
    
     this.userService.getLookupFieldForestCenters().subscribe(res=>{
      let group1 = this.squads.find(
        (element) => element.group.key == 'date'
      );
      let field= group1.group.questions.find(q=> q.key=='centerField');
      res.forEach(element => {
        let options={
           value:element.id,
           key: element.name
        }
        field.inputProps.options.push(options);
       });
      // this.setLookupField(objArr);
     })
    //  console.log(options1);
    //  let group1 = this.squads.find(
    //    (element) => element.group.key == 'date'
    //  );
    //  let field= group1.group.questions.find(q=> q.key=='centerField');
    //  field.inputProps.options.push(options1);
    //  console.log('group1',group1);
    //  console.log('field',field);
      
   // get fieldCenterLookups
    //  let fieldCenterLookups = this.tripService.formOptions;
    //  fieldCenterLookups.forEach(element => {
    //   let options={
    //      value:element.id,
    //      key: element.name
    //   }
    //   this.squads[3].group.questions[1].inputProps.options.push(options);
    // this.userService.getLookupFieldForestCenters().subscribe(res=>{
    //   console.log('lookup :',res);
    //   res.forEach(element => {
    //      let options={
    //         value:element.id,
    //         key: element.name
    //      }
    //      this.squads[3].group.questions[1].inputProps.options.push(options);
    //   });
    //   console.log ('field center:',this.squads[3].group.questions[1].inputProps.options);
    //   //this.squads[3].group.questions[1].inputProps.options=res;
    // },(err)=>{
    //   console.log(err);
    // })

     //get customers
    //  this.tripService.userService.getCustomers().subscribe(res=>{

    //  })
      
    
   
  }

  setLookupField(res){
    let group1 = this.squads.find(
      (element) => element.group.key == 'date'
    );
    let field= group1.group.questions.find(q=> q.key=='centerField');
    field.inputProps.options.push(res);
  }

  ngOnDestroy(){
    console.log();
    
  }
}
