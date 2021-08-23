import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NavigationCardModel } from 'src/app/models/nav-card-model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  @Output() menuToggle = new EventEmitter();

  @Input() public prefix: string = '';
  @Input() public allowStatusRoute: string[] = [];
  @Input() public showStatus: boolean = true;
  @Input() public status: NavigationCardModel[] = [];

  public isOpen: boolean = true;
  public showSteps: boolean = true;

  public urlAdress = 'main';

  public toggleMenu() {
    this.isOpen = !this.isOpen;
    this.menuToggle.emit();
  }

  constructor(private router: Router, private route: ActivatedRoute) {
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
