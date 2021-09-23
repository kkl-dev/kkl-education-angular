import { UserDataService } from './../../utilities/services/user-data.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.scss'],
})
export class LinksComponent implements OnInit {
  public links = [
    {
      headline: '',
      url:'education/search',
      links: ['בדיקת זמינות'],
    },
    {
      headline: '',
      url:'education/order-tour/squad-assemble',
      links: ['טיול חדש'],
    },
    {
      headline: '',
      url:'education/results',
      links: [' הטיולים שלי'],
    },
    {
      headline: '',
      url:'education/results',
      links: ['דוחות'],
    },
  ];

  public chosenLink = 0;
  public chosenCategory = 0;
  public prefix = '';

  public changeLink(catIndex: number, linkIndex: number) {
    this.chosenLink = linkIndex;
    this.chosenCategory = catIndex;
  }

  constructor(private userDataService: UserDataService) {
    this.prefix = this.userDataService.user.urlPrefix;
  }

  ngOnInit(): void {}
}
