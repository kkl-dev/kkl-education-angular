import { UserDataService } from './../../utilities/services/user-data.service';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  @Output() menuToggle = new EventEmitter();

  public status:{
    text:string;
    src: string;
    count: number
  }[] = [

  ];
  public platformName: string ='education'
  public isOpen: boolean = true;
  public urlAdress = 'main';
  public showSteps:boolean = true;
  public componentType:string= '';
  public prefix:string=''

  public toggleMenu() {
    this.isOpen = !this.isOpen;
    this.menuToggle.emit();
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userDataService: UserDataService
  ) {

     this.prefix = this.userDataService.user.urlPrefix;
    this.status = [
      {
        text: 'בתהליך',
        src: 'assets/images/reload.svg',
        count: 3,
      },
      { text: 'מחכה לאישור', src: 'assets/images/report.svg', count: 1 },
      { text: 'סגור', src: 'assets/images/finish-flag.svg', count: 20 },
    ]


    this.router.events.subscribe((val: any) => {

      this.urlAdress = val.url ? val.url : this.urlAdress;

      this.showSteps =
        this.urlAdress === '/education' ||
        this.urlAdress === '/education/search' ||
        this.urlAdress === '/education/my-tours'
          ? true
          : false;
    });
  }

  ngOnInit(): void {}
}
