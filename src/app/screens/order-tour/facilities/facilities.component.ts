import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivitiesCardInterface } from 'src/app/components/activities-card/activities-card.component';
import { QuestionBase } from 'src/app/components/form/logic/question-base';
import { QuestionSelect } from 'src/app/components/form/logic/question-select';
import { QuestionTextbox } from 'src/app/components/form/logic/question-textbox';
import { InfoCard } from '../../education-results/education-results.component';
import { TripService } from 'src/app/services/trip.service';
import { FakeService } from 'src/app/services/fake.service';
import { ActivitiesService, Area, UserService } from 'src/app/open-api';
import { QuestionAutocomplete } from 'src/app/components/form/logic/question-autocomplete';
@Component({
  selector: 'app-facilities',
  templateUrl: './facilities.component.html',
  styleUrls: ['./facilities.component.scss']
})

export class FacilitiesComponent implements OnInit {
  formArray: QuestionBase<string | number>[];
  timesArray: Array<string | number> = [];
  hiddenElements: any = { facilities: false, activities: false };
  facilityForDay: any;
  tripActivities: any = [];
  tripActivitiesShow: any = [];
  tripActivitiesInfo: any = [];
  pagesAmount: any = 5;
  areas: any = [];
  activityCategories: any = [];
  colors = { green: '#37C56B', blue: '#448ECD' }
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
  // activitiesArray: InfoCard[] = [
  activitiesArray: any[] = [
    {
      iconPath: 'fruits.svg',
      name: 'ארוחת ערב',
    },
    {
      iconPath: 'roast-chicken.svg',
      name: 'ארוחת צהריים',
    },
    {
      iconPath: 'restaurant.svg',
      name: 'ארוחת בוקר',
    },
    {
      iconPath: 'alarm.svg',
      name: 'השכמה',
    },
    {
      iconPath: 'bus-with-flag.svg',
      name: 'התייצבות',
    },
    {
      iconPath: 'fruits.svg',
      name: 'ארוחת ערב',
    },
    {
      iconPath: 'alarm.svg',
      name: 'השכמה',
    },
  ];

  constructor(private usersService: UserService, private tripService: TripService, private activitiyService: ActivitiesService, private api: FakeService) { }

  ngOnInit(): void {
    this.getAvailableFacilities();
    this.fillTimes();
    this.getAreas();
    this.getActivityCategories();
    this.getTripActivities();
    this.setFormArray();
  }

  private setFormArray() {

    this.formArray = [
      new QuestionSelect({
        key: 'durationOfActivity',
        label: 'משך פעילות',
        validations: [Validators.required],
        inputProps: { options: [{ label: 'אירוח', value: '2' }] }
      }),

      new QuestionSelect({
        key: 'areas',
        label: 'אזור',
        validations: [Validators.required],
        inputProps: { options: this.areas }
      }),

      new QuestionSelect({
        key: 'typeOfActivity',
        label: 'סוג פעילות',
        validations: [Validators.required],
        inputProps: { options: this.activityCategories }
      }),

      new QuestionAutocomplete({
        key: 'activity',
        label: 'חפש פעילות',
        cols: 1,
        value: '',
        validations: [Validators.required],
        inputProps: {
          options: this.tripActivitiesShow
        },
      }),
    ];
  }

  getAreas() {
    this.usersService.getAreas().subscribe((areas: any) => {
      console.log('getAreas: ', areas);
      if (areas) {
        areas.forEach(element => {
          this.areas.push({ label: element.name, value: element.id.toString() })
        });
      }
    },
      error => {
        console.log("error: ", { error });
      });
  }

  getActivityCategories() {
    this.activitiyService.getActivityCategories().subscribe((res) => {
      res.forEach(element => {
        this.activityCategories.push({ label: element.name, value: element.id.toString() })
      });
    },
      error => {
        console.log("error: ", { error });
      });
  }

  getTripActivities() {
    this.activitiyService.getTripActivities().subscribe(res => {
      console.log("get Trip Activities res: ", { res });
      this.calculatePages(res.length);
      this.tripActivitiesInfo = res;
      // this.pagesAmount = res.length + 1
      res.forEach(element => {
        this.tripActivities.push({ label: element.name, value: element.activityId.toString() })
        this.tripActivitiesShow.push({ label: element.name, value: element.activityId.toString() })
      });
    })
  }

  getAvailableFacilities() {
    //let sleepingDates = this.tripService.convertDatesFromSlashToMinus();  
    //temp fixed dates and place
    this.usersService.getAvailableFacilities(1, '2021-10-10', '2021-10-12').subscribe((facilities: any) => {
      console.log('get Available Facilities: ', facilities);
      if (facilities) {
        //this.activitiesArray = facilities;
        this.facilityForDay = facilities[0].facilitiesList;
        this.tripService.setfacilitiesArray(facilities);
        console.log('facility For Day: ', this.facilityForDay);
      }
    },
      error => {
        console.log("error: ", error);
      });
  }

  logForm(form) {
    console.log("form: ", form );
    let val = form.value;
    //this.tripActivitiesShow = this.tripActivities.filter(aco => aco.accommodationList.length > 0)
    //this.forestCenterOptions = this.forestCenterOptions.filter(aco => aco.accommodationList.length > 0);


  }

  newPageEmit(page) {
    console.log("page: ", page );
  }

  calculatePages(num) {
    //this.pagesAmount = num / 6;
    console.log("num: ", num );
    var quotient = Math.floor(num/6);
    var remainder = num % 6;
    this.pagesAmount = quotient + remainder;
  }

  fillTimes(): void {
    for (let i = 0; i < 24; i++) {
      i < 10 ? this.timesArray.push(`0${i}:00`) : this.timesArray.push(`${i}:00`);
    }
  }
}