import { UserDataService } from './../../utilities/services/user-data.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss'],
})
export class WizardComponent implements OnInit {
  public chosenWizardItem: number = 2;
  public prefix: string = 'education'
  public wizardItems: {
    src: string,
    text: string,
    link: string
  }[] = [

    ];

  public changeWizardItem(index: number): void {
    this.chosenWizardItem = +index;
  }

  constructor(
    private route: ActivatedRoute,
    private userDataService: UserDataService) {
    this.prefix = this.userDataService.user.urlPrefix
    this.wizardItems = [
      {
        src: 'assets/images/05-destination.svg',
        text: 'הטיולים שלי',
      link: '',},
      {
        src: 'assets/images/button.svg',
        text: 'טיול חדש',
        link: ''
      },
      {
        src: 'assets/images/report.svg',
        text: 'דוחות',
        link: 'http://knf-appl-dev3/EducationNew/angularPilot/#/reports',
      },
      {
        src: 'assets/images/calendar.svg',
        text: 'בדיקת זמינות',
        link: ''
      },
    ]
  }

  ngOnInit(): void { }
}
