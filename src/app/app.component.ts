import { UserDataService } from './utilities/services/user-data.service';
import { Component, OnInit, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'kkl-education';
  public prefix:string =''

  constructor(
    private router: Router,
    private overlayContainer: OverlayContainer,
    private userDataService:UserDataService
  ) {
this.prefix= this.userDataService.user.urlPrefix
  }


}
