import { UserDataService } from './../../utilities/services/user-data.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {

  public userInfo={
    imgSrc:"assets/images/userImage.jpg",
    name:"יוסי יוספוב"

  }
public prefix =''
  constructor( private userDataService:UserDataService) {
    this.prefix=this.userDataService.user.urlPrefix
   }

  ngOnInit(): void {
  }

}
