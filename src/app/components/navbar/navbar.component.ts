import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { NavigationCardModel } from 'src/app/utilities/models/nav-card-model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  @Output() menuToggle = new EventEmitter();

  @Input() public prefix: string = '';
  @Input() public showStatus: boolean = true;
  @Input() public status: NavigationCardModel[] = [];

  public isOpen: boolean = true;

  public toggleMenu() {
    this.isOpen = !this.isOpen;
    this.menuToggle.emit();
  }

  constructor() {}

  ngOnInit(): void {}
}
