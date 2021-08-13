import { UserDataService } from './../../utilities/services/user-data.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.scss']
})
export class LinksComponent implements OnInit {

  public links=[{
    headline:'ניהול יער',
    links:['יחידות עבודה לדילול','שכבות התיחור והמנות לידלול','תכנית ייצור שתילים למשתלות']
  },
  {
    headline:'תכנון תוכניות עבודה',
    links:['תכנית עבודה אגף תכנון','תוכנית עבודה אגף הנדסה','תכנית עבודה מרחבים']
  }]

  public chosenLink=0;
  public chosenCategory=0;
public prefix=''

  public changeLink(catIndex: number, linkIndex: number) {
    this.chosenLink = linkIndex;
    this.chosenCategory = catIndex;

  }

  constructor(private userDataService:UserDataService) {
this.prefix=this.userDataService.user.urlPrefix
   }

  ngOnInit(): void {
  }

}
