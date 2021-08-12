import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-tours',
  templateUrl: './my-tours.component.html',
  styleUrls: ['./my-tours.component.scss']
})
export class MyToursComponent implements OnInit {

  public tableSelectOptions= [
    {text:"בחר פעולה", value:'choose'},
    {text:"הפוך ללא פעיל", value:'disable'},
    {text:'שלח דוא"ל' ,value:'sendMail'}
  ]


  public selectedOption = 'choose';
  constructor() { }

  ngOnInit(): void {
  }

}
