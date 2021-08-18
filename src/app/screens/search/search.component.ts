import { UserDataService } from './../../utilities/services/user-data.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html', 
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
public prefix: string=''
  constructor(private route:ActivatedRoute,private userDataService:UserDataService) {
    this.prefix=this.userDataService.user.urlPrefix
   }

  ngOnInit(): void {
  }

}
