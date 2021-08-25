import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-filled-night',
  templateUrl: './filled-night.component.html',
  styleUrls: ['./filled-night.component.scss']
})
export class FilledNightComponent implements OnInit {
@Input() filledNight!:{sleepingPlace: string, nightsCount: string, saveFor: string, peopleCount: string, amount: string,comments:string}
  constructor() { 
    console.log(this.filledNight);
    
  }

  ngOnInit(): void {
  }

}
