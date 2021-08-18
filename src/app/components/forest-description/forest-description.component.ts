import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-forest-description',
  templateUrl: './forest-description.component.html',
  styleUrls: ['./forest-description.component.scss']
})
export class ForestDescriptionComponent implements OnInit {

  public content=[{
    headline:'גיל היער המחתני',
    text:'קבוצת גיל של שכבת היער הראשית',
    footer:'חדש 0-1'
  },
  {headline:'מספר שכבות יער',
  footer:'חד שכבתי'
},{
  headline:'תצורת צומח יערנית קיימת',
  footer:'בוסתני ומטעים'
},{
  headline:'רמת צפיפות קיימת',
  text:'מספר עצים לדונם',
  footer:'גבוהה מעל 66%'
},{
  headline:'רמת כיסוי צמרות קיימת(%)',
  text:'בשכבה/שכבות המטופלות ללא מינים פולשים',
  footer:'נמוכה 11-33%'
},{
  headline:'מצב היער',
  text:'מהתרשמות אישית',
  footer:'סכנה בטיחותית, צפיפות יתר וסכנה בטיחותית'
}]

  constructor() { }

  ngOnInit(): void {
  }

}
