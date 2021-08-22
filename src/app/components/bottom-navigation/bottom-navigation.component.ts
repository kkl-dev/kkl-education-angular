import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bottom-navigation',
  templateUrl: './bottom-navigation.component.html',
  styleUrls: ['./bottom-navigation.component.scss'],
})
export class BottomNavigationComponent implements OnInit {
  @Output() changePage: EventEmitter<number> = new EventEmitter();
  @Input() currentPage: number = 0;
  @Input() previousUrl: string = '';
  @Input() title: string = '';
  @Input() nextUrl: string = '';
  @Input() lastPage: number = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  public previousPageHandler(): void {
    if (this.currentPage == 0) {
      this.router.navigateByUrl(this.previousUrl);
    } else {
      this.currentPage--;
      this.changePage.emit(+this.currentPage);
    }
  }

  public nextPageHandler(): void {
    if (this.currentPage == this.lastPage - 1) {
      this.router.navigateByUrl(this.nextUrl);
    } else {
      this.currentPage++;
      this.changePage.emit(+this.currentPage);
    }
  }
}
