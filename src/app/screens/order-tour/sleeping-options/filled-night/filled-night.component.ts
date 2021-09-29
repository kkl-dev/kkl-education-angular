import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { AccommodationType, ParticipantType } from 'src/app/open-api';
import { SleepingServiceService } from 'src/app/utilities/services/sleeping-service.service';

export interface lodgingPerDay{
  accomodationType: AccommodationType;   
  participant: ParticipantType;
  lodgersNumber: number;
  unitsNumber: number;
  comments: string;
}

export interface FilledNight1 {
  sleepingPlace: string;
  nightsCount1: string | any;
  saveFor: string;
  sleepingAmount: string;
  amount: string;
  comments: string;
  optionsArr: any[];
}

export interface FilledNight {
  nightsCount: any;
  lodgingPerDay: lodgingPerDay[]
}



@Component({
  selector: 'app-filled-night',
  templateUrl: './filled-night.component.html',
  styleUrls: ['./filled-night.component.scss'],
})
export class FilledNightComponent implements OnInit {
  @Input() filledNight!: FilledNight;
  @Input() index: number;
  @Input() filledNightOptions: any[];
  @Output() deleteFilledNight: EventEmitter<void> = new EventEmitter();
  @Output() deleteFilledNightOption: EventEmitter<number> = new EventEmitter();
  @Output() editFilledNight: EventEmitter<FilledNight> = new EventEmitter();
  @Output() editFilledNightOption: EventEmitter<any> = new EventEmitter();

  public nightsCountForDisplay: string;
  public datesForDisplay: string;

  constructor(private sleepingService: SleepingServiceService) {
  }

  emitDeleteFilledNight(): void {
    this.deleteFilledNight.emit();
  }
  public emitDeleteFilledNightOption(indexOfOption: number): void {
    this.deleteFilledNightOption.emit(indexOfOption);
  }
  public emitEditFilledNightOption(indexOfOption?: number): void {
    this.editFilledNightOption.emit(indexOfOption);
  }
  emitEditFilledNight(): void {
    this.editFilledNight.emit();
  }

  ngOnInit(): void {
    console.log(this.filledNight)
    this.nightsCountForDisplay = this.arrangeNightCountForDisplay();
    this.datesForDisplay = this.arrangeDatesForDisplay();
    console.log('filledNightOptions is :', this.filledNightOptions);
  }

  public arrangeDatesForDisplay(): string {
    let low: Date;
    let hight: Date;
    const arr: any[] = this.filledNight.nightsCount;
    if (arr) {
      arr.map(item => {
        let day = item.date.getDate();
        if (!low && !hight) {
          hight = day;
          low = day;
        }
        if (day < low) {
          low = day;
        }
        if (day > hight) {
          hight = day;
        }
      });
    }
    return `${low}-${hight}.${arr[0].date.getMonth()}.${arr[0].date.getFullYear()}`;
  }
  public arrangeNightCountForDisplay() {
    let first: any, last: any;
    const arr: any[] = this.filledNight.nightsCount;
    arr.map(i => {
      let item = i.nightNumber;
      if (!first && !last) {
        last = item;
        first = item;
      }
      if (item < first) {
        first = item;
      }
      if (item > last) {
        last = item;
      }
    });
    return `לילה ${first}-${last}`;
  }


}
