import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivitiesCardInterface } from 'src/app/components/activities-card/activities-card.component';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
import { QuestionSelect } from 'src/app/components/form/logic/question-select';
import { QuestionTextbox } from 'src/app/components/form/logic/question-textbox';
import { InfoCard } from '../../education-results/education-results.component';
import { TripService } from 'src/app/services/trip.service';
import { FakeService } from 'src/app/services/fake.service';
import { UserService } from 'src/app/open-api/api/user.service';

@Component({
  selector: 'app-facilities',
  templateUrl: './facilities.component.html',
  styleUrls: ['./facilities.component.scss']
})

export class FacilitiesComponent implements OnInit {

  timesArray: Array<string | number> = [];
  hiddenElements: any = { facilities: false, activities: false };  

  colors = { green: '#37C56B', blue: '#448ECD' }
  // arrays
  timeLineArray: Array<object> = [
    {
      title: 'ארוחת צהריים', startTime: '12:00', endTime: '13:00',
      iconSrc: 'assets/images/roast-chicken.svg', color: this.colors.green
    },
    {
      title: 'מטבח שדה', startTime: '12:00', endTime: '13:00',
      iconSrc: 'assets/images/kitchen.svg', color: this.colors.blue
    },
    {
      title: 'התייצבות', startTime: '10:00', endTime: '11:00',
      iconSrc: 'assets/images/finish-flag-1.svg', color: this.colors.green, secondIcon: 'bus'
    },
  ];
  formArray: QuestionBase<string | number>[] = [
    new QuestionSelect({
      key: 'durationOfActivity',
      label: 'משך פעילות',
      validations: [Validators.required],
      inputProps: { options: [{ label: '', value: '' }] }
    }),
    new QuestionSelect({
      key: 'area',
      label: 'אזור',
      validations: [Validators.required],
      inputProps: { options: [{ label: '', value: '' }] }
    }),
    new QuestionSelect({
      key: 'typeOfActivity',
      label: 'סוג פעילות',
      validations: [Validators.required],
      inputProps: { options: [{ label: '', value: '' }] }
    }),
    new QuestionTextbox({
      key: 'search',
      label: 'חפש פעילות',
      value: '',
      validations: [Validators.required]
    }),
  ];
  
  facilitiesArray: any = [{
    "date": "2021-09-10T:00:00:00",
    "facilitiesList": []
  }];
  // facilitiesArray: InfoCard[] = [
  //   facilitiesArray: any[] = [
  //   {
  //     iconPath: 'assets/images/museum.svg',
  //     name: 'תאטרון',
  //     maxOccupancy: 320,
  //     availability: [
  //       {
  //         fromHour: 14,
  //         tillHour: 15.25,
  //         totalTime: 1.25,
  //         customerName: 'אורנים',
  //       },
  //     ],
  //   },
  //   {
  //     iconPath: 'assets/images/classroom.svg',
  //     headline: 'תאטרון',
  //     subHeadline: 'עד 20 משתתפים',
  //     availability: [
  //       {
  //         fromHour: 14,
  //         tillHour: 15.25,
  //         totalTime: 1.25,
  //         customerName: 'רתמים',
  //       },
  //     ],
  //   },
  //   {
  //     iconPath: 'assets/images/football.svg',
  //     headline: 'מגרש ספורט',
  //     subHeadline: '',
  //     availability: [
  //       {
  //         fromHour: 14,
  //         tillHour: 15.25,
  //         totalTime: 1.25,
  //         customerName: 'נחלאות',
  //       },
  //     ],
  //   },
  //   {
  //     iconPath: 'assets/images/leafs.svg',
  //     headline: 'סיור במשתלה',
  //     availability: [],
  //   },
  //   {
  //     iconPath: 'assets/images/stage.svg',
  //     headline: 'תאטרון',
  //     subHeadline: 'עד 320 משתתפים',
  //     availability: [
  //       {
  //         fromHour: 14,
  //         tillHour: 15.25,
  //         totalTime: 1.25,
  //         customerName: 'ירושלים',
  //       },
  //     ],
  //   },
  //   // --- length 5 ---
  //   {
  //     iconPath: 'assets/images/stage.svg',
  //     headline: 'תאטרון',
  //     subHeadline: 'עד 320 משתתפים',
  //     availability: [
  //       {
  //         fromHour: 14,
  //         tillHour: 15.25,
  //         totalTime: 1.25,
  //         customerName: 'ירושלים',
  //       },
  //     ],
  //   },
  //   {
  //     iconPath: 'assets/images/stage.svg',
  //     headline: 'תאטרון',
  //     subHeadline: 'עד 320 משתתפים',
  //     availability: [
  //       {
  //         fromHour: 14,
  //         tillHour: 15.25,
  //         totalTime: 1.25,
  //         customerName: 'ירושלים',
  //       },
  //     ],
  //   },
  //   {
  //     iconPath: 'assets/images/stage.svg',
  //     headline: 'תאטרון',
  //     subHeadline: 'עד 320 משתתפים',
  //     availability: [
  //       {
  //         fromHour: 14,
  //         tillHour: 15.25,
  //         totalTime: 1.25,
  //         customerName: 'ירושלים',
  //       },
  //     ],
  //   },
  //   {
  //     iconPath: 'assets/images/stage.svg',
  //     headline: 'תאטרון',
  //     subHeadline: 'עד 320 משתתפים',
  //     availability: [
  //       {
  //         fromHour: 14,
  //         tillHour: 15.25,
  //         totalTime: 1.25,
  //         customerName: 'ירושלים',
  //       },
  //     ],
  //   },
  // ];
  facilityForDay: any;

  // activitiesArray: InfoCard[] = [
    activitiesArray: any[] = [

    {
      iconPath: 'assets/images/fruits.svg',
      name: 'ארוחת ערב',
    },
    {
      iconPath: 'assets/images/roast-chicken.svg',
      name: 'ארוחת צהריים',
    },
    {
      iconPath: 'assets/images/restaurant.svg',
      name: 'ארוחת בוקר',
    },
    {
      iconPath: 'assets/images/alarm.svg',
      name: 'השכמה',
    },
    {
      iconPath: 'assets/images/bus-with-flag.svg',
      name: 'התייצבות',
    },
    {
      iconPath: 'assets/images/fruits.svg',
      name: 'ארוחת ערב',
    },
    {
      iconPath: 'assets/images/alarm.svg',
      name: 'השכמה',
    },
  ];
  upComingActivitiesArray: ActivitiesCardInterface[] = [
    { img: "assets/images/img-1.png", title: "ניווט יערני במחנה", content: "על הפעילות הסבר על הפעילות הסבר על הפעילות הסבר על הפעילות", hours: 1.5 },
    { img: "assets/images/img-2.png", title: "סולמות וחבלים בין העצים", content: "על הפעילות הסבר על הפעילות הסבר על הפעילות הסבר על הפעילות", hours: 3 },
    { img: "assets/images/img-3.png", title: "יום עיון והשתלמות", content: "על הפעילות הסבר על הפעילות הסבר על הפעילות הסבר על הפעילות", hours: 5 },
    { img: "assets/images/img-1.png", title: "ניווט יערני במחנה", content: "על הפעילות הסבר על הפעילות הסבר על הפעילות הסבר על הפעילות", hours: 1.5 },
    { img: "assets/images/img-2.png", title: "סולמות וחבלים בין העצים", content: "על הפעילות הסבר על הפעילות הסבר על הפעילות הסבר על הפעילות", hours: 3 },
    { img: "assets/images/img-3.png", title: "יום עיון והשתלמות", content: "על הפעילות הסבר על הפעילות הסבר על הפעילות הסבר על הפעילות", hours: 5 },
  ];

  constructor(private usersService: UserService, private tripService: TripService, private api: FakeService) { }

  ngOnInit(): void {
    this.facilitiesArray = this.tripService.facilitiesArray;
    this.facilityForDay = this.facilitiesArray[0].facilitiesList;
    //this.getAvailableFacilities();
    this.fillTimes();
  }  

  // getAvailableFacilities() {
  //   let sleepingDates = this.tripService.convertDatesFromSlashToMinus();    
  //   this.usersService.getAvailableFacilities(this.tripService.centerField.id, sleepingDates.from, sleepingDates.till).subscribe((facilities: any) => {
  //     console.log('get Available Facilities: ', facilities);
  //     if (facilities) {
  //       this.facilityForDay = facilities[0].facilitiesList;
  //       this.facilitiesArray = facilities;
  //       //this.tripService.setfacilitiesArray(facilities);
  //       console.log('facility For Day: ', this.facilityForDay);
  //     }
  //   },
  //     error => {
  //       console.log("error: ", { error });
  //     });
  // }

  fillTimes(): void {
    for (let i = 0; i < 24; i++) {
      i < 10 ? this.timesArray.push(`0${i}:00`) : this.timesArray.push(`${i}:00`);
    }
  }
}
