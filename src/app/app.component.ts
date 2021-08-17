import { UserDataService } from './utilities/services/user-data.service';
import { Component } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'kkl-education';
  public prefix: string = ''

  constructor(
    private userDataService: UserDataService
  ) {
    this.prefix = this.userDataService.user.urlPrefix
  }


}
