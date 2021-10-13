import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bottom-navigation',
  templateUrl: './bottom-navigation.component.html',
  styleUrls: ['./bottom-navigation.component.scss'],
})
export class BottomNavigationComponent implements OnInit {
  @Input() previousUrl: string = '';
  @Input() text: string = '';
  @Input() nextUrl: string = '';
  @Input() prevUrl: string = '';
  @Input() hasNext: boolean;
  @Input() hasSave: boolean;

  @Output() previous = new EventEmitter();
  @Output() next = new EventEmitter();
  @Output() save = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  // public previousPageHandler(): void {
  //   if (this.currentPage == 0) {
  //     this.router.navigateByUrl(this.previousUrl);
  //   } else {
  //     this.currentPage--;
  //     this.changePage.emit(+this.currentPage);
  //   }
  // }

  // public nextPageHandler(): void {
  //   if (this.currentPage == this.lastPage - 1) {
  //     this.router.navigateByUrl(this.nextUrl);
  //   } else {
  //     this.currentPage++;
  //     this.changePage.emit(+this.currentPage);
  //   }
  // }

  public onPrevious(): void {
    this.previous.emit();
  }

  public onNext(): void {
    this.next.emit();
  }
  
  public onSave(): void {
    this.save.emit();
  }
}
