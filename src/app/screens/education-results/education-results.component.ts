import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserDataService } from 'src/app/services/user-data.service';
import { UserService } from '../../api/v1/api/user.service';
import { TripService } from 'src/app/services/trip.service';

@Component({
  selector: 'app-education-results',
  templateUrl: './education-results.component.html',
  styleUrls: ['./education-results.component.scss'],
})
export class EducationResultsComponent implements OnInit {
  centerField: string = 'מרכז שדה - נס הרים';

  constructor(public usersService: UserService, private route: ActivatedRoute, private userDataService: UserDataService, private tripService: TripService) { }

  ngOnInit(): void {

    // this.usersService.getLookupFieldForestCenters().subscribe(
    //   response => {
    //     console.log('response: ', response);
    //   },
    //   error => console.log('error:', error),       // error
    //   () => console.log('completed')     // complete
    // );

    // this.usersService.getLookupFieldForestCenters().subscribe((data: any) => {
    //   //  this.spinner.hide();
    //     if (data) {
    //       console.log('getLookupFieldForestCenters: ', data);
    //     }
    //     else {
    //       console.log('no data in getLookupFieldForestCenters');
    //     }
    //   },
    //     error => {
    //   //    this.spinner.hide();
    //       console.log({ error })
    //     });

    // this.usersService.getLookupFieldForestCenters().subscribe(
    //   response => {
    //     console.log('response:', response);
    //   },
    //   error => console.log('error:', error),       // error
    //   () => console.log('completed')     // complete
    // );

    
    console.log('userDataService:', this.userDataService);
    console.log('tripService:', this.tripService);

    //this.availabilityItemsArray = this.tripService.dateObj;
    //this.centerField = this.tripService.centerField
  }

  public availabilityItemsArray = [
    { date: '15.06.21', text: 'זמינות יום 1' },
    { date: '16.06.21', text: 'זמינות יום 2' },
    { date: '17.06.21', text: 'זמינות יום 3' },
  ];

  public chosenDate: number = 0

  public sleepingOptionsArray = [
    {
      svgUrl: 'assets/images/cabin.svg',
      sleepingAreas: 2,
      avialableSpaces: 16,
      type: 'בקתות',
      singleUnit: 'בבקתה'

    },
    {
      svgUrl: 'assets/images/tent.svg',
      sleepingAreas: 4,
      avialableSpaces: 36,
      type: 'אוהלים',
      singleUnit: 'באוהל'
    },
    {
      svgUrl: 'assets/images/camp.svg',
      sleepingAreas: 1,
      avialableSpaces: 120,
      type: 'גיחה',
      singleUnit: 'לנים'
    }
  ];

  public changeDate(newDate: number) {
    console.log('changeDate:', newDate);

    this.chosenDate = newDate;
  }

  public facilitiesArray = [
    {
      svgUrl: 'assets/images/stage.svg',
      headline: 'תאטרון',
      subHeadline: 'עד 320 משתתפים',
      availability: [
        { hour: 8, avialable: true },
        { hour: 9, avialable: true },
        { hour: 10, avialable: false },
        { hour: 11, avialable: true },
        { hour: 12, avialable: false },
        { hour: 13, avialable: false },
        { hour: 14, avialable: false },
        { hour: 15, avialable: true },
      ],
    },
    {
      svgUrl: 'assets/images/museum.svg',
      headline: 'תאטרון',
      subHeadline: 'עד 320 משתתפים',
      availability: [
        { hour: 8, avialable: true },
        { hour: 9, avialable: true },
        { hour: 10, avialable: false },
        { hour: 11, avialable: true },
        { hour: 12, avialable: false },
        { hour: 13, avialable: false },
        { hour: 14, avialable: false },
        { hour: 15, avialable: true },
      ],
    },
    {
      svgUrl: 'assets/images/classroom.svg',
      headline: 'תאטרון',
      subHeadline: 'עד 20 משתתפים',
      availability: [
        { hour: 8, avialable: true },
        { hour: 9, avialable: true },
        { hour: 10, avialable: false },
        { hour: 11, avialable: true },
        { hour: 12, avialable: false },
        { hour: 13, avialable: false },
        { hour: 14, avialable: false },
        { hour: 15, avialable: true },
      ],
    },
    {
      svgUrl: 'assets/images/football.svg',
      headline: 'מגרש ספורט',
      availability: [
        { hour: 8, avialable: true },
        { hour: 9, avialable: true },
        { hour: 10, avialable: false },
        { hour: 11, avialable: true },
        { hour: 12, avialable: false },
        { hour: 13, avialable: false },
        { hour: 14, avialable: false },
        { hour: 15, avialable: true },
      ],
    },
    {
      svgUrl: 'assets/images/leafs.svg',
      headline: 'סיור במשתלה',
      availability: [
        { hour: 8, avialable: true },
        { hour: 9, avialable: true },
        { hour: 10, avialable: false },
        { hour: 11, avialable: true },
        { hour: 12, avialable: false },
        { hour: 13, avialable: false },
        { hour: 14, avialable: false },
        { hour: 15, avialable: true },
      ],
    },
    {
      svgUrl: 'assets/images/student-hat.svg',
      headline: 'מרכז למידה',
      subHeadline: 'עד 40 משתתפים',
      availability: [
        { hour: 8, avialable: true },
        { hour: 9, avialable: true },
        { hour: 10, avialable: false },
        { hour: 11, avialable: true },
        { hour: 12, avialable: false },
        { hour: 13, avialable: false },
        { hour: 14, avialable: false },
        { hour: 15, avialable: true },
      ],
    },
    {
      svgUrl: 'assets/images/climbing.svg',
      headline: 'תחנות הפעלה',
      subHeadline: 'עד 40 משתתפים',
      availability: [
        { hour: 8, avialable: true },
        { hour: 9, avialable: true },
        { hour: 10, avialable: false },
        { hour: 11, avialable: true },
        { hour: 12, avialable: false },
        { hour: 13, avialable: false },
        { hour: 14, avialable: false },
        { hour: 15, avialable: true },
      ],
    },
    {
      svgUrl: 'assets/images/judaism.svg',
      headline: 'בתי כנסה',
      availability: [
        { hour: 8, avialable: true },
        { hour: 9, avialable: true },
        { hour: 10, avialable: false },
        { hour: 11, avialable: true },
        { hour: 12, avialable: false },
        { hour: 13, avialable: false },
        { hour: 14, avialable: false },
        { hour: 15, avialable: true },
      ],
    },
  ];
}
