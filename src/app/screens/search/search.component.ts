import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserDataService } from 'src/app/services/user-data.service';

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
