import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { NgForm } from '@angular/forms';
import { CalendarOptions, FreeSpace } from 'comrax-alex-airbnb-calendar';
import { subDays, addDays } from 'date-fns';
import { Locale, getYear } from 'date-fns';
import { UserDataService } from 'src/app/services/user-data.service';
import { UserService } from '../../../api/v1/api/user.service';
import { TripService } from 'src/app/services/trip.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @ViewChild('resultsForm') signupForm: NgForm | undefined;

  date: string | null = null;

  dateObj: { from: string; to: string } = { from: '', to: '' };
  centerField: any = null;
  formOptions: any;

  freeSpacesArray1: FreeSpace[] = [];

  constructor(public usersService: UserService, private userDataService: UserDataService, private tripService: TripService) {
    this.freeSpacesArray1 = this.freeSpacesArrayGenarator(
      new Date(),
      new Date(2022, 11, 17)
    );

    this.options = {
      firstCalendarDay: 0,
      format: 'LL/dd/yyyy',
      closeOnSelected: true,
      // minDate: addDays(new Date(), 5),
      // maxDate: addDays(new Date(), 10),
      minYear: getYear(new Date()) - 1,
      maxYear: getYear(new Date()) + 1,
      freeSpacesArray: this.freeSpacesArray1,
    };

  }
  ngOnInit(): void {

    this.usersService.getLookupFieldForestCenters().subscribe(
      response => {
        console.log(response);
        this.formOptions = response;
        this.tripService.centerField=this.formOptions[0];
      },
      error => console.log(error),       // error
      () => console.log('completed')     // complete
    )

    console.log('userDataService:', this.userDataService);
    console.log('tripService:', this.tripService);

    this.dateObj = this.tripService.dateObj;
    this.centerField = this.tripService.centerField;
  }

  freeSpacesArrayGenarator(start: Date, end: Date) {
    const i = 0;
    let freeSpacesArrayTemp: FreeSpace[] = [];
    while (start < end) {
      start = new Date(start.setDate(start.getDate() + 1));
      freeSpacesArrayTemp.push({
        date: start,
        freeSpace: {
          cabins: Math.floor(Math.random() * 8),
          tents: Math.floor(Math.random() * 8),
          campgrounds: Math.floor(Math.random() * 8),
        },
      });
    }
    return freeSpacesArrayTemp;
  }

  options: CalendarOptions = {
    firstCalendarDay: 0,
    format: 'LL/dd/yyyy',
    closeOnSelected: true,
    // minDate: addDays(new Date(), 5),
    // maxDate: addDays(new Date(), 10),
    minYear: 2019,
    maxYear: 2021,
    freeSpacesArray: this.freeSpacesArray1,
  };

  public dateObjChanged(e: string) {
    if (e.includes('-')) {
      let tempDateArr = [];
      tempDateArr = e.split('-');
      console.log(tempDateArr);
      if (new Date(tempDateArr[0]) < new Date(tempDateArr[1])) {
        this.dateObj.from = tempDateArr[0];
        this.dateObj.to = tempDateArr[1];
      } else {
        this.dateObj.from = tempDateArr[1];
        this.dateObj.to = tempDateArr[0];
      }
    } else {
      console.log(e);

      this.dateObj.from = e;
      this.dateObj.to = '';
    }
  }

  // public formOptions: { imgSrc: string; text: string; value: string }[] = [
  //   { imgSrc: 'assets/images/userImage.jpg', text: 'ציפורי', value: '1' },
  //   { imgSrc: 'assets/images/userImage.jpg', text: 'לביא', value: '1' },
  //   { imgSrc: 'assets/images/userImage.jpg', text: 'נס הרים', value: '1' },
  //   { imgSrc: 'assets/images/userImage.jpg', text: 'יתיר', value: '1' },
  //   { imgSrc: 'assets/images/userImage.jpg', text: 'שוני', value: '1' },
  // ];

}
