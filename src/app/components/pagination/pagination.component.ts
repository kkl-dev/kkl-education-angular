import { Component, OnInit, Input, EventEmitter, Output, OnChanges } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnInit,OnChanges {
  @Input() pagesCount: number=0;
  @Input() paginationCount: number=0;
  @Input() currentPage: number=0;
  @Output() newPage: EventEmitter<number> = new EventEmitter();
  public pagesToShow:number[] = [1, 2, 3, 4, 5];

  public pageNumberArray:any[] = [];
  constructor() {}

  ngOnChanges():void{
    this.currentPage =1;
    this.newPage.emit(this.currentPage);

    console.log(this.currentPage);
    this.pagesCount = Math.floor(+this.pagesCount + 0.99999);

    this.pageNumberArray = new Array(this.pagesCount)
    console.log(this.pageNumberArray.map((item, index) => {

      index >= this.pagesCount
        ? (this.pagesToShow = this.pagesToShow.slice(0, index))
        : (this.pagesToShow[index] = +this.currentPage + index);
    }));
    
  }

  ngOnInit(): void {
    console.log('d');
    
    this.pagesCount = Math.floor(+this.pagesCount + 0.99999);

    this.pageNumberArray = new Array(this.pagesCount);

    this.pagesToShow.map((item, index) => {

      index >= this.pagesCount
        ? (this.pagesToShow = this.pagesToShow.slice(0, index))
        : (this.pagesToShow[index] = +this.currentPage + index);
    });
    
   
  }

  nextPage() {
    if (this.currentPage < this.pageNumberArray.length) {
      this.currentPage++;
      this.proceed();
    }
    if (this.currentPage + 4 > this.pageNumberArray.length) {
      return;
    }
    if (+this.currentPage + this.pagesCount + 1 > this.pageNumberArray.length) {
      this.newPagesToShow(
        this.currentPage,
        this.pageNumberArray.length,
        this.currentPage
      );
    } else {
      this.newPagesToShow(
        this.currentPage + 1,
        this.currentPage + 4,
        this.currentPage
      );
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.proceed();
    }
    if (this.currentPage - 4 < 1) {
      return;
    }
    if (Number(this.currentPage) - Number(this.pagesToShow.length) + 1 > 1) {
      this.newPagesToShow(
        this.currentPage - 4,
        this.currentPage,
        this.currentPage
      );
    } else {
      this.newPagesToShow(1, this.currentPage, this.currentPage);
    }
  }

  newPagesToShow(startingPosition:number, endingPosition:number, currentPage:number) {
    this.pagesToShow.map((item, index) => {
      if (startingPosition + index > endingPosition) {
        this.pagesToShow[index] = -1;
        this.pagesToShow = this.pagesToShow.filter((number) => number > 0);
        console.log(this.pagesToShow);
      } else {
        this.pagesToShow[index] = startingPosition + index;
      }
    });
  }

  public proceed() {
    console.log('f');
    
    this.newPage.emit(this.currentPage);
  }
}
